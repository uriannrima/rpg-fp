/* eslint-disable @typescript-eslint/camelcase */
import { flow } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/Task"
import * as RT from "fp-ts/lib/ReaderTask"
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as SG from "fp-ts/lib/Semigroup";

import fetch from "node-fetch"
import { URLSearchParams } from "url"

import { eitherToTask } from "./natural-transformation";

const httpGet = <T>(url): T.Task<T> => (): Promise<T> => fetch(url, {
    headers: {
        'Authorization': 'Bearer BQDR7wjMtBR6pEtIvZgp3ZeD6ZfUsv-nTrKng85g0hzdkEMwcj8VUqKcO9ErXaGuwY7d_sONykpAQ9CsJ_Y'
    }
}).then(r => r.json());

const httpGetR = <T>(url): RT.ReaderTask<Configuration, T> => (c: Configuration) => (): Promise<T> => fetch(url, {
    headers: {
        'Authorization': `Bearer ${c.authorization.access_token}`
    }
}).then(r => r.json());

interface Artist {
    id: string;
    name: string;
}

const first = <T>(xs: T[]): E.Either<T[], T> => E.fromNullable([])(xs[0]);

const Spotify = {
    // findArtist :: String -> Task Artist
    findArtist: (name: string): T.Task<Artist> => pipe(
        httpGet<{ artists: { items: Artist[] } }>(`https://api.spotify.com/v1/search?q=${name}&type=artist`),
        T.map(response => response.artists.items),
        T.map(first), // findArtist :: String -> Task Either [] Artist
        T.chain(eitherToTask) // findArtist :: String -> Task Artist
    ),
    relatedArtists: (artistId: string): T.Task<Artist[]> => pipe(
        httpGet<{ artists: Artist[] }>(`https://api.spotify.com/v1/artists/${artistId}/related-artists`),
        T.map(response => response.artists),
    ),
    R: {
        findArtist: (name: string) => pipe(
            httpGetR<{ artists: { items: Artist[] } }>(`https://api.spotify.com/v1/search?q=${name}&type=artist`),
            RT.map(response => response.artists.items),
            RT.map(first),
            RT.chain(a => RT.fromTask(eitherToTask(a)))
        ),
        relatedArtists: (artistId: string) => pipe(
            httpGetR<{ artists: Artist[] }>(`https://api.spotify.com/v1/artists/${artistId}/related-artists`),
            RT.map(response => response.artists),
        ),
    }
};

const findRelated = flow(
    Spotify.findArtist, // Task Artist
    T.map(a => a.id), // Task String
    T.chain(Spotify.relatedArtists), // Task Array Artist
    T.map(a => a.map(a => a.name)), // Task Array String
);

const findRelatedR = flow(
    Spotify.R.findArtist, // Task Artist
    RT.map(a => a.id), // Task String
    RT.chain(Spotify.R.relatedArtists), // Task Array Artist
    RT.map(a => a.map(a => a.name)), // Task Array String
);

const intersectionSemigroup: SG.Semigroup<string[]> = {
    concat: <T>(xs: T[], ys: T[]) => xs.filter(x => ys.some(y => y === x))
}

const applicativeArtistIntersection = (rels1: string[]) => (rels2: string[]): string[] => intersectionSemigroup.concat(rels1, rels2);
const semigroupArtistIntersection = ([first, ...others]: string[][]): string[] => SG.fold(intersectionSemigroup)(first, others);

const mainForTwo = ([name1, name2]: string[]): T.Task<string[]> => pipe(
    T.of(applicativeArtistIntersection),
    T.ap(findRelated(name1)),
    T.ap(findRelated(name2)),
);

// mainForTwo(["Blind Guardian", "Masterplan"])().then(console.log).catch(console.error);

const mainForMany = (names: string[]): T.Task<string[]> => pipe(
    names.map(findRelated), // Array Task Array String
    A.array.sequence(T.task), // Task Array Array String
    T.map(semigroupArtistIntersection) // Task Array String
);

// mainForMany(["Blind Guardian", "Masterplan", "Freedom Call", "Gamma Ray"])().then(console.log).catch(console.error);

const mainWithConfiguration = (names: string[]): RT.ReaderTask<Configuration, string[]> => pipe(
    names.map(findRelatedR), // Array Task Array String
    A.array.sequence(RT.readerTask), // Task Array Array String
    RT.map(semigroupArtistIntersection) // Task Array String
);

const configuration = {
    authorization: {
        url: "https://accounts.spotify.com/api/token",
        body: {
            client_id: "b1d45e1f83f04f688977ff1f712aba6f",
            client_secret: "212d8d46c9454a1497adfcecdbce59d8",
            grant_type: "client_credentials"
        },
        access_token: "BQDR7wjMtBR6pEtIvZgp3ZeD6ZfUsv-nTrKng85g0hzdkEMwcj8VUqKcO9ErXaGuwY7d_sONykpAQ9CsJ_Y",
    },
    urls: {
        search: (query: string): string => `https://api.spotify.com/v1/search?q=${query}&type=artist`,
        relatedArtists: (artistId: string): string => `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    }
}

type Configuration = typeof configuration;


// mainWithConfiguration(["Blind Guardian", "Masterplan", "Freedom Call", "Gamma Ray"])(configuration)().then(console.log).catch(console.error);

const createAuthBody = (body: { [key: string]: string }) => {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => params.append(key, value));
    return params;
};

const httpPost = <T>(url: string, body: URLSearchParams): T.Task<T> => (): Promise<T> =>
    fetch(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(r => r.json());

interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

const populateAccessToken = (): RT.ReaderTask<Configuration, Configuration> => (c: Configuration) => {
    return pipe(
        httpPost<AuthResponse>(c.authorization.url, createAuthBody(c.authorization.body)),
        T.map(({ access_token }) => access_token),
        T.map(access_token => ({
            ...c,
            authorization: {
                ...c.authorization,
                access_token
            }
        }))
    );
};

const mainWithRequestAccess = (names: string[]) => pipe(
    RT.ask<Configuration>(),
    RT.chain(populateAccessToken),
    RT.chainTaskK(
        mainWithConfiguration(names)
    )
);

export const runWithResource = <R>(r: R) => <A>(ma: (r: R) => A): A => ma(r);

RT.run(mainWithRequestAccess(["Blind Guardian", "Masterplan", "Freedom Call", "Gamma Ray"]), {
    ...configuration,
    authorization: {
        ...configuration.authorization,
        access_token: ""
    }
}).then(console.log).catch(console.error);
