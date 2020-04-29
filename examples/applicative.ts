// Write a function that adds two possibly null numbers together using `Maybe` and `ap`.

import * as O from "fp-ts/lib/Option";
import { add } from "ramda";
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
 * https://stackoverflow.com/questions/60645655/map-io-to-array-of-either-in-fp-ts 
 */

/** Used as to always return an element to avoid using maybe/option */
const get = (elementId: string) =>
  document.getElementById(elementId) || ({} as HTMLElement);

const find = (selector: string) => (selection: Element) =>
  selection.querySelectorAll(selector);

const attr = (name: string, value?: string) => (
  selection: Element
): string | null | undefined => {
  if (value) {
    selection.setAttribute(name, value);
    return;
  }

  return selection.getAttribute(name);
};

const getIO = (elementId: string) => io.of(get(elementId));

const findIO = (selector: string) => (selection: Element) =>
  io.of(find(selector)(selection));

const attrIO = (name, value?) => (selection: Element) =>
  io.of(attr(name, value)(selection));

const rows: Array<HTMLTableRowElement> = [];
/**
 * We have an Array IO, which isnt the most pratical to work on.
 * Would be better to have an IO Array
 */
const arrayOfIo: Array<IO<string | null | undefined>> = rows.map(
  attrIO("data-test")
);

/**
 * We can traverse an array when we want to "invert" the result
 * Array<IO> ~> IO<Array>
 * To do so, we must traverse using an Applicative:
 * - Functor (map)
 * - Pointed (of)
 * - Apply (ap)
 * array.traverse(Applicative)(target, functionToApply)
 */
const ioOfArray = array.traverse(io)(rows, attrIO("data-test"));

const getTests = pipe(
  /** Get Table */
  get("table"),
  /** Get All TRs */
  findIO("tr"),
  /**
   * Find links inside rows
   * Traverse instead of map, otherwise we'll have Array<IO>, we want IO<Array>
   * We also chain, instead of map, otherwise we'll have IO<IO<Array>>
   */
  chain((rows) => array.traverse(io)(Array.from(rows), findIO("a"))),
  /**
   * Get data test attr from links
   * We flatten links, since we have [TR[Links,Links,Links], TR[Links]]
   */
  chain((links) =>
    array.traverse(io)(Array.from(links).flat(), attrIO("data-test"))
  )
);
