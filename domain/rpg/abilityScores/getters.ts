import { pipe } from "ramda";

import { AbilityScoreType } from "../../enums/AbilityScoreType";
import { getModifier } from "../../utils/number";
import { valueLens } from "../../interfaces/WithValue";

import { AbilityScore, AbilityScores, WithAbilityScores } from "./interfaces";
import { createAbilityScore } from "./creators";
import { abilityScoresLens, abilityScoreLens } from "./lens";

export const getDefaultAbilityScores = (initialValue = 0): AbilityScores =>
  Object.values(AbilityScoreType).reduce<AbilityScores>(
    (map, name) => ({
      ...map,
      [name]: createAbilityScore({ name, value: initialValue }),
    }),
    {} as AbilityScores,
  );

export const getAbilityScore = (abilityScore: AbilityScoreType) => (
  abilityScores: AbilityScores,
): AbilityScore => abilityScores[abilityScore];

export const getAbilityScoreModifier = (
  abilityScore: AbilityScoreType,
): ((withAbilityScores: WithAbilityScores) => number) =>
  pipe(
    abilityScoresLens.get,
    abilityScoreLens(abilityScore).get,
    valueLens<AbilityScore>().get,
    getModifier,
  );
