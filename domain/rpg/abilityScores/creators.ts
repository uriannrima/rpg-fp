import { pipe } from "ramda";

import { Creator } from "../../creators";
import { withName } from "../../interfaces/WithName";
import { withValue } from "../../interfaces/WithValue";

import { AbilityScore } from "./interfaces";

export const createAbilityScore: Creator<AbilityScore> = pipe(
  withName,
  withValue(0)
);
