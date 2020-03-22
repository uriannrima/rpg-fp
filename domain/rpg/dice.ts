import { withProperty } from "./property";
import { Creator } from "../fp/base";
import { compose } from "../fp/pureFunctions";

export interface Dice {
  faces: number;
}

const diceToString = ({ faces }: Dice) => `d${faces}`;

export const createDice: Creator<Dice> = compose(
  withProperty("valueOf", diceToString),
  withProperty("toString", diceToString),
  withProperty("faces", 1)
);
