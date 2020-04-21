import {
  WithAbilityScores,
  getAbilityScore,
  getAbilityScores,
} from "./abilityScore";
import { AbilityScoreType } from "./enums/AbilityScoreType";
import { getValue } from "./interfaces/WithValue";
import { getModifier } from "./utils/number";
import { add, pipe } from "ramda";

const createGetInitiative = (
  a: AbilityScoreType = AbilityScoreType.Dexterity
): ((c: WithAbilityScores) => number) =>
  pipe(getAbilityScores, getAbilityScore(a), getValue, getModifier, add(10));

export const getInitiative = createGetInitiative(AbilityScoreType.Dexterity);
