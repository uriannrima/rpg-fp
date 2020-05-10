import { AbilityScoreType } from "../enums/AbilityScoreType";

export enum LimitType {
  Min = "min",
  Max = "max",
}

export interface MinScore {
  abilityScore: AbilityScoreType;
  value: number;
  limit: LimitType;
}

export interface WithMinScore {
  minScore?: MinScore;
}
