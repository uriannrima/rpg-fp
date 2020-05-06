import { array } from "fp-ts/lib/Array";
import { Either, either } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";

import * as Ramda from "ramda";

console.log("Predicate Example:");

type Predicate<A> = (a: A) => boolean;

// fromPredicate :: (a -> boolean) -> e -> a -> Either e a
const fromPredicate = <E, A>(predicate: Predicate<A>) => (e: E) => (
  a: A
): Either<E, A> => (predicate(a) ? either.of(a) : either.throwError(e));

const gt = (b: number) => (a: number) => a > b;
const getLength = (s: string) => s.length;
const isLengthGt = (b: number) => flow(getLength, gt(b));
const nameError = new Error("Name should be bigger than 3 characters long.");

const isNameTooSmall = fromPredicate((a: string) => a.length > 3)(nameError);

// Chad
either.map(isNameTooSmall("Chad"), console.log);
// Error: Name should be bigger than 3 characters long.
either.mapLeft(isNameTooSmall("Joe"), console.log);

// partition :: (a -> Bool) -> [a] -> [Either e a]
// Partitions an array using a predicate:
// Array A -> Array Either E A
const partition = <E, A>(predicate: Predicate<A>) => (e: E) =>
  Ramda.map(fromPredicate<E, A>(predicate)(e));

const names = ["Chad", "Joe", "Uriann"];

console.log("Partition:");

const namesPartition = partition<Error, string>(isLengthGt(3))(nameError)(
  names
);

namesPartition.map((e) => {
  either.map(e, console.log);
  either.mapLeft(e, (error) => console.log(error.message));
});

// validate :: (a -> Bool) -> [a] -> Either e [a]
// Will return at the first that gives an error, or all values validated
const validate = <E, A>(predicate: Predicate<A>) => (e: E) => (as: A[]) =>
  array.traverse(either)(as, fromPredicate<E, A>(predicate)(e));

console.log("Validate:");

const namesValidated = validate<Error, string>(isLengthGt(3))(nameError)(names);
// Wont map, because we have an left
either.map(namesValidated, console.log);
// Error: Name should be bigger than 3 characters long.
either.mapLeft(namesValidated, console.log);



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

import { IO, io, chain } from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/pipeable";

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
