import R from "ramda";
import { F } from "ts-toolbelt";

export const compose: F.Compose = R.compose;

export const pipe: F.Pipe = R.pipe;

export function curry<Fn extends F.Function>(fn: Fn): F.Curry<Fn> {
  return R.curry(fn);
}

export const isNullOrUndefined = entry =>
  typeof entry === "undefined" || entry === null;

export const isNullOrUndefinedOrEmpty = entry =>
  isNullOrUndefined(entry) || entry.length <= 0;

export function isFunction(fn: any): fn is Function {
  return typeof fn === "function";
}

export const opReduce = curry(
  (operation: (a: number, b: number) => number, acc: number, curr: number) =>
    operation(acc, curr)
);
export const addOperation = curry((a: number, b: number) => a + b);
export const minusOperation = curry((a: number, b: number) => a - b);
export const multiplyOperation = curry((a: number, b: number) => a * b);
export const divideOperation = curry((a: number, b: number) => a / b);
export const sumReduce = opReduce(addOperation);
export const identity = <TValue = any>(value: TValue) => value;
export const simpleEquals = curry((a: any, b: any) => a === b);

export const encapsulate = (propertyName: string) => <TValue>(
  value: TValue
) => ({
  [propertyName]: value
});
