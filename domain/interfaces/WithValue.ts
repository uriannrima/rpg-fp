import { Lens } from "monocle-ts";

import { merge, MergeFn } from "../property";

export interface WithValue<TValue> {
  value: TValue;
}

export const withValue = <TValue>(value: TValue): MergeFn<WithValue<TValue>> =>
  merge<WithValue<TValue>>({ value });

type InferValueType<A> = A extends WithValue<infer T>
  ? WithValue<T>
  : WithValue<any>;

export const valueLens = <A>() =>
  Lens.fromProp<InferValueType<A> & A>()("value");
