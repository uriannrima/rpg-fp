import { Lens } from "monocle-ts";

import { AbilityScoreType } from "../../enums/AbilityScoreType";

import { WithAbilityScores, AbilityScores } from "./interfaces";

export const abilityScoresLens = Lens.fromProp<WithAbilityScores>()(
  "abilityScores"
);

export const abilityScoreLens = (abilityScoreType: AbilityScoreType) =>
  Lens.fromProp<AbilityScores>()(abilityScoreType);
