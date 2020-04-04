import R from "ramda";

interface Person {
  age?: number;
  weight: number;
  height: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const expect = (value, debug = false) => ({
  toEqual: (toCheck): boolean => {
    debug && console.log({ value, toCheck });

    if (value === toCheck) {
      return true;
    } else {
      throw new Error(`Expected '${value}' to equals '${toCheck}'.`);
    }
  },
});

const setAge = (age: number) => (p: { age: number }): { age: number } => ({
  ...p,
  age,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(function testSetAge() {
  const p: { age: number } = {
    age: 1,
  };

  const p2 = setAge(12)(p);
  expect(p2.age).toEqual(12);
})();

const getHalvedAge = (p: { age: number }): number => p.age / 2;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(function testeGetHalvedAge() {
  const p: { age: number } = {
    age: 2,
  };

  const hAge = getHalvedAge(p);
  expect(hAge).toEqual(1);
})();

const setToHalvedAge = R.compose(setAge, getHalvedAge);

type Composer<P, R> = <TP extends P, TR extends R>(p: TP) => TR;
// type Composer<P, R> = (p: P) => R;

const halveAge: Composer<{ age: number }, { age: number }> = R.converge(
  R.call,
  [setToHalvedAge, R.identity]
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(function testeHalveAge() {
  const { age } = halveAge({
    age: 10,
  });

  expect(age).toEqual(5);
})();

const p2: Person = {
  age: 1,
  height: 175,
  weight: 90,
};

// const p3 = halveAge(p2);
const p4: Person = halveAge(p2);

console.log({ p4 });
