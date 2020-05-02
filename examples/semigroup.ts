/**
 * Semigroups are intefaces that has "concat" (conbination) or data that has a way to combine
 * And has associativity:
 * 1 + 2 + 3 === (1 + 2) + 3 === 1 + (2 + 3)
 */

import * as SG from "fp-ts/lib/Semigroup";

/**
 * String is a semigroup
 * Beucase it is an Array, and a Array is a semigroup also.
 */
console.log("a".concat("b").concat("c"));

const bc = "b".concat("c");
console.log("a".concat(bc));

/**
 * Array is a semigroup
 */
const a1 = [1, 2].concat([3, 4]).concat([5, 6]);

// It doesn't matter if we prepent after, we get the same result
const a2 = [3, 4].concat([5, 6]);
const a3 = [1, 2].concat(a2); // === a1;
console.log(a1, a2, a3);

/**
 * Operations can be semigroup, as far as it defines a concat:
 */
interface Sum {
  x: number;
  concat({ x: y }: Sum): Sum;
  toString(): string;
}

const Sum = (x): Sum => ({
  x,
  concat: ({ x: y }: Sum): Sum => Sum(x + y),
  toString: (): string => `Sum(${x})`,
});

const sum = Sum(1).concat(Sum(2));
console.log(String(sum));

/**
 * Or even "logic":
 */
interface All {
  x: boolean;
  concat({ x: y }: All): All;
  toString(): string;
}

const All = (x: boolean): All => ({
  x,
  concat: ({ x: y }: All): All => All(x && y),
  toString: (): string => `All(${x})`,
});

const all = All(false).concat(All(true));
console.log(String(all));

/**
 * Or any meta combination:
 */

interface Semigroup<T> {
  x: T;
  concat(y: Semigroup<T>): Semigroup<T>;
  toString(): string;
}

const First = <T>(x): Semigroup<T> => ({
  x,
  concat: (y: Semigroup<T>): Semigroup<T> => First(x),
  toString: (): string => `Fist(${x})`,
});

const Last = <T>(x): Semigroup<T> => ({
  x,
  concat: (y: Semigroup<T>): Semigroup<T> => y,
  toString: (): string => `Last(${x})`,
});

const first = First("Bob").concat(First("Joe"));
const last = Last("Bob").concat(Last("Joe"));
console.log(String(first), String(last));

/**
 * A nice property of Semigroup is that if it is a structure
 * And each part of the strucutre is a Semigroup,
 * The Structure is a semigroup it self:
 */

const acc1 = {
  name: First("Nico"),
  isPaid: All(true),
  points: Sum(10),
  friends: ["Franklin"],
};

const acc2 = {
  name: First("Nico"),
  isPaid: All(false),
  points: Sum(2),
  friends: ["Gatsby"],
};

// Objects don't have an concat method,
// But libs (like fp-ts) has utilities for that
// We may create a semigroup without having to chage our
// Data structure, but lets implement our own, just for learning
// We won't make a lot of checks nor typechecking that is necessary because
// Other libraries does it for us.
const concat = (a: any, b: any) => {
  // For each property of A
  return (
    Object.keys(a)
      .map((key) => {
        // Concat with property of B
        return {
          [key]: a[key].concat(b[key]),
        };
      })
      // Reconstruct into a new object
      .reduce((map, piece) => ({ ...map, ...piece }), {
        toString: function () {
          return Object.values(this)
            .filter((v) => typeof v !== "function")
            .reduce((r, value) => `${r}${String(value)}\n`, "");
        },
      })
  );
};

const acc3 = concat(acc1, acc2);
console.log("Merged:", String(acc3));

const semigroupAccount: SG.Semigroup<{
  name: string;
  isPaid: boolean;
  points: number;
  friends: string[];
}> = SG.getStructSemigroup({
  name: SG.getFirstSemigroup<string>(),
  points: SG.semigroupSum,
  friends: { concat: (x, y) => x.concat(y) } as SG.Semigroup<string[]>,
  isPaid: SG.semigroupAll,
});

/**
 * Using getStructSemigroup we may create our semigroup
 * without having to change our data structure.
 */
const acc4 = semigroupAccount.concat(
  {
    name: "Nico",
    isPaid: true,
    points: 10,
    friends: ["Franklin"],
  },
  {
    name: "Nico",
    isPaid: false,
    points: 2,
    friends: ["Gatsby"],
  }
);

console.log(acc4);
