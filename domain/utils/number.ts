import { min } from "ramda";

export const getModifier = (value: number): number =>
  Math.floor((value - 10) / 2);

export const max = (maxValue?: number) => (value: number): number =>
  maxValue ? min(maxValue)(value) : value;
