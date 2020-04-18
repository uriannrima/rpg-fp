import { merge, MergeFn } from "../property";

export interface WithValue<TValue> {
  value: TValue;
}

export const withValue = <TValue>(value: TValue): MergeFn<WithValue<TValue>> =>
  merge<WithValue<TValue>>({ value });

export const getValue = <TValue>({ value }: WithValue<TValue>): TValue => value;
