import { pipe } from "fp-ts/lib/pipeable";
import { applyTo } from "ramda";

import { AbilityScoreType } from "../../enums/AbilityScoreType";
import { valueLens } from "../../interfaces/WithValue";

import { WithAbilityScores, AbilityScore } from "./interfaces";
import { abilityScoresLens, abilityScoreLens } from "./lens";

export const updateAbilityScore = (abilityScore: AbilityScoreType) => (
  value: number,
) => (c: WithAbilityScores): WithAbilityScores =>
  pipe(
    abilityScoresLens.get(c),
    abilityScoreLens(abilityScore).get,
    valueLens<AbilityScore>().set(value),
    abilityScoresLens.compose(abilityScoreLens(abilityScore)).set,
    applyTo(c),
  );
