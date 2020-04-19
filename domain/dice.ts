import { pipe, add, multiply, subtract } from "ramda";

export type Die = number;
export type Dice = Array<Die>;

export const createDice = ({
  faces,
  multiplier,
}: {
  faces: number;
  multiplier: number;
}): Array<number> => Array.from({ length: multiplier }, () => faces);

export const random = ({ max = 1, min = 1 }): number =>
  pipe(
    ([min, max]) => [Math.ceil(min), Math.floor(max)],
    ([min, max]) => subtract(max, min),
    add(1),
    multiply(Math.random()),
    Math.floor,
    add(min)
  )([min, max]);
