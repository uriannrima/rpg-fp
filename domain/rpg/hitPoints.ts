import { compose } from "../fp/pureFunctions";
import { withProperty } from "./property";
import { Creator } from "../fp/base";

export interface Hitpoints {
  maximum: number;
  current: number;
  temporary: number;
}

export const createHitpoints: Creator<Hitpoints> = compose(
  withProperty("maximum", 0),
  withProperty("current", 0),
  withProperty("temporary", 0)
);

export interface WithHitpoints {
  hitPoints: Hitpoints;
}

export const withHitpoints = withProperty("hitPoints", createHitpoints());
