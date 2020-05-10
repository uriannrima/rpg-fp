import { AbilityScoreType } from "../../enums/AbilityScoreType";
import { KeyMap } from "../../utils/enum";
import { WithName } from "../../interfaces/WithName";
import { WithValue } from "../../interfaces/WithValue";

export interface AbilityScore extends WithName, WithValue<number> {}

export type AbilityScores = KeyMap<AbilityScoreType, AbilityScore>;

export interface WithAbilityScores {
  abilityScores: AbilityScores;
}
