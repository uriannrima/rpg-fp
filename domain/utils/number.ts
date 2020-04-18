import { min } from "ramda";

export const getModifier = (value: number): number =>
  Math.floor((value - 10) / 2);

export const getMaxModifier = (maxModifier?: number) => (
  modifier: number
): number => (maxModifier ? min(maxModifier)(modifier) : modifier);
