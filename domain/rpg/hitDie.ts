import { withProperty } from "./property";
import { Dice, createDice } from "./dice";

export interface WithHitDie {
  hitDie: Dice;
}

export const withHitDie = withProperty("hitDie", createDice());
