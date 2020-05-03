/**
 * Monoid are semigroups that have an identity (or neutral) value:
 *
 * Considering Sum:
 * 1 + 0 = 1;
 * 2 + 0 = 2;
 * x + 0 = x;
 *
 * We have a sum semigroup, and we consider "addition" our concatenation
 * But as you can see, we have an value, 0, that may concatenate with any value
 * and returns the concatenated value, working as an identity:
 * Identity x = x;
 *
 */

import { getMonoid } from "fp-ts/lib/Array";
import { Monoid } from "fp-ts/lib/Monoid";

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

/**
 * Our "identity", neutral element
 */
Sum.empty = () => Sum(0);

const sum = Sum.empty().concat(Sum(1).concat(Sum(2)));
console.log(String(sum));

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

All.empty = () => All(true);

const all = All.empty().concat(All(true).concat(All(false)));
console.log(String(all));

////////////////////////////////////

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

/**
 * We can't (without any tools) transform our First Semigroup into a monoid
 * Since we can't find a way to:
 * First(1).concat(First.empty()) === First(1) ✓
 * First.empty().concat(First(1)) === ???
 */

const sumReduce = (xs: number[]) =>
  xs.reduce(
    // This has the same signature as our sum semigroup
    (acc, val) => acc + val,
    // And this, the sum semigroup identity
    0
  );

console.log(sumReduce([1, 2, 3])); // 6
// Even though we don't have any value, we still make it work,
// Since we have our neutral value, our starting point
console.log(sumReduce([])); // 0, Our identity

const allReduce = (bs: boolean[]) =>
  bs.reduce(
    // Again, same signature as our all semigroup
    (acc, val) => acc && val,
    // Same identity
    true
  );

allReduce([true, false]); // False
allReduce([]); // True, even though no value

const firstReduce = (bs: number[]) =>
  bs.reduce(
    // Same signature as first semigroup
    (acc) => acc
    // We don't have a starting value...
  );

console.log(firstReduce([1, 2, 3])); // 1
// firstReduce([]); // It blows... because we don't have a starting value

/**
 * So, you may see that a monoid is "safer" to work with
 * Since if we don't have anything, we still have a starting point
 * A neutral value...
 */

/**
 * Some other Monoids
 */

const Any = (x) => ({
  x,
  concat: ({ x: y }) => Any(x || y),
  toString: () => `Any(${x})`,
});

Any.empty = () => Any(false);

const Max = (x) => ({
  x,
  concat: ({ x: y }) => Max(x > y ? x : y),
  toString: () => `Max(${x})`,
});

Max.empty = () => Max(-Infinity);

const Min = (x) => ({
  x,
  concat: ({ x: y }) => Min(x < y ? x : y),
  toString: () => `Min(${x})`,
});

Min.empty = () => Min(Infinity);

const Pair = (x, y) => ({
  x,
  y,
  concat: ({ x: x1, y: y1 }) => Pair(x.concat(x1), y.concat(y1)),
  toString: () => `Pair([${x}], [${y}])`,
});

console.log(String(Pair([], []).concat(Pair([1, 3], [2, 4]))));

/**
 * Monoids using FP-TS
 */

// Sum Monoid
const monoidSum: Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0,
};

import * as M from "fp-ts/lib/Monoid";
import * as SG from "fp-ts/lib/Semigroup";

const a1 = [1, 2, 3];
console.log(M.fold(monoidSum)(a1));

// Struct Monoid

interface Account {
  name: string;
  isPaid: boolean;
  points: number;
  friends: string[];
}

const semigroupAccount: SG.Semigroup<Account> = SG.getStructSemigroup({
  name: SG.getFirstSemigroup<string>(),
  points: SG.semigroupSum,
  friends: { concat: (x, y) => x.concat(y) } as SG.Semigroup<string[]>,
  isPaid: SG.semigroupAll,
});

const accountMonoid: M.Monoid<Account> = {
  concat: semigroupAccount.concat,
  empty: {
    name: "",
    isPaid: false,
    points: 0,
    friends: [],
  },
};

const mergedAccount = M.fold(accountMonoid)([
  // {
  //   name: "Nico",
  //   isPaid: true,
  //   points: 10,
  //   friends: ["Franklin"],
  // },
  // {
  //   name: "Nico",
  //   isPaid: false,
  //   points: 2,
  //   friends: ["Gatsby"],
  // },
]);

console.log(mergedAccount);
