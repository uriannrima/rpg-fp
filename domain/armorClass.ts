import { add, pipe } from "ramda";

import {
  getAbilityScore,
  AbilityScoreType,
  getAbilityScores,
} from "./abilityScore";
import { getModifier } from "./utils/number";
import { getValue } from "./interfaces/WithValue";

export const getArmorClass = pipe(
  getAbilityScores,
  getAbilityScore(AbilityScoreType.Dexterity),
  getValue,
  getModifier,
  add(10)
);
