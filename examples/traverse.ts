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
