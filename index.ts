import R from "ramda";

export interface WithAge {
  age: number;
}

export interface Person extends WithAge {
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

export const setAge = (age: number) => (p: {
  age: number;
}): { age: number } => ({
  ...p,
  age,
});

export const getAge = (p: { age: number }): number => p.age;
export const halveNumber = (number: number): number => number / 2;
export const getHalvedAge = R.compose(halveNumber, getAge);
export const setToHalvedAge = R.compose(setAge, getHalvedAge);

export type Composer<P, R> = <TP extends P, TR extends R>(p: TP) => TR;

export const halveAge: Composer<
  { age: number },
  { age: number }
> = R.converge(R.call, [setToHalvedAge, R.identity]);
