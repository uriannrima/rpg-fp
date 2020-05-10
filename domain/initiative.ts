import { add, pipe } from "ramda";

import { AbilityScoreType } from "./enums/AbilityScoreType";
import { getModifier } from "./utils/number";
import {
  WithAbilityScores,
  AbilityScore,
} from "./rpg/abilityScores/interfaces";
import { getAbilityScore } from "./rpg/abilityScores/getters";
import { abilityScoresLens } from "./rpg/abilityScores/lens";
import { valueLens } from "./interfaces/WithValue";

const createGetInitiative = (
  a: AbilityScoreType = AbilityScoreType.Dexterity,
): ((c: WithAbilityScores) => number) =>
  pipe(
    abilityScoresLens.get,
    getAbilityScore(a),
    valueLens<AbilityScore>().get,
    getModifier,
    add(10),
  );

export const getInitiative = createGetInitiative(AbilityScoreType.Dexterity);
