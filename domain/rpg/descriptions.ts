import { withProperty } from "../fp/property";
import { compose } from "../fp/pureFunctions";

export interface WithPersonalityTrait {
  personalityTrait: string;
}

export interface WithIdeals {
  ideals: string;
}

export interface WithBonds {
  bonds: string;
}

export interface WithFlaws {
  flaws: string;
}

export interface WithDescriptions
  extends WithPersonalityTrait,
    WithIdeals,
    WithBonds,
    WithFlaws {}

export const withPersonalityTrait = withProperty("personalityTrait")("");
export const withIdeals = withProperty("ideals")("");
export const withBonds = withProperty("bonds")("");
export const withFlaws = withProperty("flaws")("");

export const withDescriptions = compose(
  withPersonalityTrait,
  withIdeals,
  withBonds,
  withFlaws
);
