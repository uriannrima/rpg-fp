import { merge } from "../property";

import { AbilityScoreType } from "../abilityScore";

export interface WithKeyAbilityScore {
  keyAbilityScore: AbilityScoreType;
}

export const withKeyAbilityScore = merge<WithKeyAbilityScore>({
  keyAbilityScore: AbilityScoreType.Strength,
});

export const getKeyAbilityScore = ({
  keyAbilityScore,
}: WithKeyAbilityScore): AbilityScoreType => keyAbilityScore;
