// Write a function that adds two possibly null numbers together using `Maybe` and `ap`.

import * as O from "fp-ts/lib/Option";
import { add, map } from "ramda";
import { IO, io, chain } from "fp-ts/lib/IO";
import { array } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";

// safeAdd :: Maybe number -> Maybe number -> Maybe number
const safeAdd = (ma: O.Option<number>) => (
  mb: O.Option<number>
): O.Option<number> => {
  // const maybeAdd = O.option.of(add);
  // const ap: <A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B>
  // const maybeAddB = O.ap(mb)(maybeAdd);
  //
  // return O.ap(ma)(maybeAddB);
  // return O.ap(ma)(O.ap(mb)(O.option.of(add)));
  //
  // Apply1<"Option">.ap: <A, B>(fab: O.Option<(a: A) => B>, fa: O.Option<A>) => O.Option<B>
  // const maybeAddB = O.option.ap(maybeAdd, mb);
  //
  // return O.option.ap(O.option.ap(O.option.of(add), mb), ma);
  // return O.option.ap(maybeAddB, ma);

  return O.option.ap(O.option.ap(O.option.of(add), mb), ma);
};

interface Player {
  id: number;
  name: string;
}

const localStorage: { [key: string]: Player } = {
  player1: { id: 1, name: "Albert" },
  player2: { id: 2, name: "Theresa" },
};

// getFromCache :: String -> IO User
const getFromCache: (x: string) => IO<Player> = (
  x: string
): IO<Player> => (): Player => localStorage[x];

// game :: User -> User -> String
const game: (p1: Player) => (p2: Player) => string = (p1: Player) => (
  p2: Player
): string => `${p1.name} vs ${p2.name}`;

// startGame :: IO String
const startGame: IO<string> = io.ap(
  io.ap(io.of(game), getFromCache("player1")),
  getFromCache("player2")
);

console.log(startGame());

/**
 * https://egghead.io/lessons/javascript-applying-applicatives-exhibit-a
 */

import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";


const $ = (document: Document) => (selector: string): TE.TaskEither<Error, Element> =>
  (): Promise<E.Either<Error, Element>> =>
    Promise.resolve(
      E.fromNullable(
        new Error("Element not found.")
      )(document.querySelector(selector)));

const getName = (element: Element): E.Either<Error, string> => E.fromNullable(new Error("Name attribute not found."))(element.getAttribute("name"));

const getSafeName = flow(
  $({ querySelector: (name: string) => ({ name, getAttribute: (): string => name }) } as Document),
  TE.chain(
    flow(
      getName,
      TE.fromEither,
    )
  )
);

/**
 * Get the element
 * Then, get the name, 
 * and if there is a name, log it
 */
getSafeName(".my-maybe-not-present-element")().then(E.map(console.log)).catch(console.log)

/**
 * Get screen size with applicatives...
 * GetScreenSize is a curried function which accepts values
 * that are "normal" (not functors)
 * But we want it to behave safely so we want to use our fakeSafeSelector
 * As you can see, our fakeSafeSelector returns Option<FakeElement> which
 * isn't exactly accepted by our getScreenSize
 * What we can do, is use applicatives to "encapsulate" values and use
 * the currying to invoke it only when we have the correct values
 */

interface FakeElement {
  selector: string;
  height: number;
}

const fakeSafeSelector = (selector: string): O.Option<FakeElement> => O.option.of({ selector, height: 10 });

const getScreenSize =
  (screenHeight: number) => {
    console.log("I have a screen height");
    return (header: FakeElement) => {
      console.log("I have a header height");
      return (footer: FakeElement): number => {
        console.log("I have a footer height");
        return screenHeight - (header.height + footer.height)
      }
    }
  };

const maybeScreenSize = pipe(
  /** 
   * Gives getScreenSize version that accepts Options
   * Since the screen size is "defined" always, 
   * we may pass it beforehand
   */
  O.option.of(getScreenSize(800)),
  /**
   * It gives us a function that depends on a Option<FakeElement>
   * And with O.ap() we may give it a function that returns a Option<FakeElement>
   * which is exactly what our fakeSafeSelector does
   */
  O.ap(fakeSafeSelector("header")),
  /**
   * After that, now we have a function that only depends on the last argument
   * which is the option of the footer
   */
  O.ap(fakeSafeSelector("footer")),
)

/**
 * I have a screen height -> O.option.of(getScreenSize(800)),
 * I have a header height -> O.ap(fakeSafeSelector("header")),
 * I have a footer height -> O.ap(fakeSafeSelector("footer")),
 * { _tag: 'Some', value: 780 }
 */
console.log(maybeScreenSize)

import * as T from "fp-ts/lib/Task";

const waitResolve = <T>(delay: number, resolveValue: T) => new Promise<T>(resolve => {
  setTimeout(() => {
    console.log("Fetched", resolveValue, new Date().getTime());
    resolve(resolveValue);
  }, delay);
});

const getCities: T.Task<string[]> = () => {
  console.log("Fetching cities", new Date().getTime());
  return waitResolve(Math.random() * 3000, ["Rio de Janeiro", "Lisboa"]);
}
const getEvents: T.Task<string[]> = () => {
  console.log("Fetching events", new Date().getTime());
  return waitResolve(Math.random() * 3000, ["Rock in Rio", "Rock in Rio - Lisboa"]);
}

const showCitiesEvents =
  (cities: string[]) =>
    (events: string[]): any =>
      ({ cities, events })

const pullTheTrigger = pipe(
  T.of(showCitiesEvents),
  T.ap(getCities),
  T.ap(getEvents),
)

/**
 * Fetching cities 1588767180122 <-\ 
 *                                  > T.of(showCitiesEvents), invoke both "at the same time"
 * Fetching events 1588767180126 <-/
 * Fetched [ 'Rio de Janeiro', 'Lisboa' ] - T.ap(getCities) results
 * Received cities
 * Fetched [ 'Rock in Rio', 'Rock in Rio - Lisboa' ] - T.ap(getEvents) results
 * Received events
 * {
 *   cities: ['Rio de Janeiro', 'Lisboa'],
 *   events: ['Rock in Rio', 'Rock in Rio - Lisboa']
 * } -> Both values arrive at the "real implementation" of showCitiesEvents together
 */
pullTheTrigger().then(v => console.log(v, new Date().getTime()));