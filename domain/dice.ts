import { pipe, add, multiply, subtract } from "ramda";

export type Die = {
  multiplier: number;
  faces: number;
};

export type Dice = Array<Die>;

export const createDie = ({
  faces,
  multiplier,
}: {
  faces: number;
  multiplier: number;
}): Die => ({ faces, multiplier });

export const random = ({ max = 1, min = 1 }): number =>
  pipe(
    ([min, max]) => [Math.ceil(min), Math.floor(max)],
    ([min, max]) => subtract(max, min),
    add(1),
    multiply(Math.random()),
    Math.floor,
    add(min)
  )([min, max]);

export const Die = {
  createDie,
  toString: ({ multiplier, faces }: Die): string => `${multiplier}d${faces}`,
};

export const Dice = {
  toString: (ds: Dice): string => ds.map(Die.toString).join(" + "),
};
