/* eslint-disable @typescript-eslint/camelcase */
import { flow } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/Task"
import * as TE from "fp-ts/lib/TaskEither"
import * as RT from "fp-ts/lib/ReaderTask"
import * as R from "fp-ts/lib/Reader"
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as SG from "fp-ts/lib/Semigroup";
import * as IO from "fp-ts/lib/IO";
import * as O from "fp-ts/lib/Option";

import * as Monocle from "monocle-ts"

import fetch, { Response, RequestInfo, RequestInit } from "node-fetch"
import { URLSearchParams } from "url"

import { eitherToTask, maybeToTask } from "./natural-transformation";
import { applyTo, indexOf } from "ramda";

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
            client_id: "",
            client_secret: "",
            grant_type: "client_credentials"
        },
        access_token: "",
    },
    urls: {
        search: (query: string): string => `https://api.spotify.com/v1/search?q=${query}&type=artist`,
        relatedArtists: (artistId: string): string => `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    }
}

type Configuration = typeof configuration;
const authorizationLens = Monocle.Lens.fromProp<Configuration>()('authorization');
const accessTokenLens = Monocle.Lens.fromProp<typeof configuration.authorization>()('access_token');
const bodyLens = Monocle.Lens.fromProp<typeof configuration.authorization>()('body');
const clientIdLens = Monocle.Lens.fromProp<typeof configuration.authorization.body>()('client_id');
const clientSecretLens = Monocle.Lens.fromProp<typeof configuration.authorization.body>()('client_secret');


// mainWithConfiguration(["Blind Guardian", "Masterplan", "Freedom Call", "Gamma Ray"])(configuration)().then(console.log).catch(console.error);

////////////////////////////////////////////////////////////////////////////////////////////////////////

const createAuthBody = (body: { [key: string]: string }) => {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => params.append(key, value));
    return params;
};

const isSuccess = (status: number): boolean => /^2\d{2}$/.test(status.toString());

const isSuccessResponse = <E, T>(r: Response): TE.TaskEither<E, T> => async () => {
    const json = await r.json();

    if (isSuccess(r.status)) {
        return E.right(json as T);
    }

    return E.left(json as E);
};

const fetchTask = <E>(url: RequestInfo, init?: RequestInit): TE.TaskEither<E, Response> => async () => {
    return fetch(url, init).then(E.right).catch(E.left);
}

const httpPost = <E, T>(url: string, body: URLSearchParams) =>
    pipe(
        fetchTask<E>(url, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }),
        TE.chain(r => isSuccessResponse<E, T>(r)),
    )

interface ErrorResponse {
    error: string;
    error_description: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

const tokenLens = Monocle.Lens.fromProp<{ access_token: string }>()('access_token');

const setConfigurationAccessToken = (accessToken: string): (c: Configuration) => Configuration =>
    authorizationLens
        .compose(accessTokenLens)
        .set(accessToken);

const trace = (label: string) => <T>(x: T): T => {
    console.log(label, x);
    return x;
}

const populateAccessToken = (): RT.ReaderTask<Configuration, Configuration> => (c: Configuration) =>
    pipe(
        httpPost<ErrorResponse, AuthResponse>(c.authorization.url, createAuthBody(c.authorization.body)),
        T.chain(eitherToTask),
        T.map(tokenLens.get),
        T.map(setConfigurationAccessToken),
        T.map(applyTo(c)),
    );

const mainWithRequestAccess = (names: string[]) => pipe(
    RT.ask<Configuration>(),
    RT.chain(populateAccessToken),
    RT.chainTaskK(
        mainWithConfiguration(names)
    )
);

export const runWithResource = <R>(r: R) => <A>(ma: (r: R) => A): A => ma(r);

// RT.run(mainWithRequestAccess(["Blind Guardian", "Masterplan", "Freedom Call", "Gamma Ray"]), {
//     ...configuration,
//     authorization: {
//         ...configuration.authorization,
//         access_token: ""
//     }
// }).then(console.log).catch(console.error);


/////////////////////////////////////////////////////////////////

const popupateClientCredentials = ({ clientId, clientSecret }: Credentials): R.Reader<Configuration, Configuration> =>
    flow(
        authorizationLens
            .compose(bodyLens)
            .compose(clientIdLens)
            .set(clientId),
        authorizationLens
            .compose(bodyLens)
            .compose(clientSecretLens)
            .set(clientSecret),
    );

const getArgv: IO.IO<string[]> = () => process.argv;

const getArgs = pipe(
    getArgv,
    IO.map(argv => argv.slice(2)),
)

const findArg = (argName: string) => (args: string[]): O.Option<string> => {
    const index = args.indexOf(argName);

    if (index !== -1) {
        return O.option.of(args[index + 1]);
    }

    return O.option.zero();
}

interface Credentials {
    clientId: string;
    clientSecret: string;
};

const createCredentials = (clientId: string) => (clientSecret: string): Credentials => ({ clientId, clientSecret });

const findCredentials = (args: string[]) => pipe(
    O.option.of(createCredentials),
    O.ap(findArg("--client_id")(args)),
    O.ap(findArg("--client_secret")(args)),
)

// getCredentials :: IO Maybe Credentials
const getCredentialsFromArgs = pipe(
    getArgs,
    IO.map(findCredentials),
)

const mainWithArgs = (names: string[]) => pipe(
    RT.ask<Configuration>(),
    RT.chainTaskK(configuration => pipe(
        getCredentialsFromArgs, // IO Maybe Credentials
        T.fromIO, // Task Maybe Credentials
        T.chain(maybeToTask), // Task Credentials
        T.map(popupateClientCredentials), // Task Configuration Configuration
        T.map(applyTo(configuration)), // Task Configuration
    )),
    RT.chainTaskK(c => pipe(
        mainWithRequestAccess(names)(c), // Task Array String
    )),
);

mainWithArgs(["Blind Guardian", "Masterplan", "Freedom Call", "Gamma Ray"])(configuration)()
    .then(console.log)
    .catch(console.error);