import { compose } from "../fp/pureFunctions";
import { withProperty } from "../fp/property";
import { Creator } from "../fp/base";

export interface HitDice {
  remaining: number;
  maximum: number;
}

export const createHitDice: Creator<HitDice> = compose(
  withProperty("remaining")(1),
  withProperty("maximum")(1)
);

export interface WithHitDice {
  hitDice: HitDice;
}

export const withHitDice = withProperty("hitDice")(createHitDice());
