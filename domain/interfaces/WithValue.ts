import { merge } from "../property";

export interface WithValue<TValue> {
  value: TValue;
}

export const withValue = <TValue>(value: TValue) =>
  merge<WithValue<TValue>>({ value });
