import { pipe } from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { WithValue, withValue } from "./interfaces/WithValue";

import { merge } from "./property";
import { Creator } from "./creators";

export interface AbilityScore extends WithName, WithValue<number> {}

export enum AbilityScoreType {
  strength = "strength",
  dexterity = "dexterity",
  constitution = "constitution",
  intelligence = "intelligence",
  wisdom = "wisdom",
  charisma = "charisma",
}

export type AbilityScoreMap = {
  [key in keyof typeof AbilityScoreType]: AbilityScore;
};

export interface WithAbilityScores {
  abilityScores: AbilityScoreMap;
}

export const withAbilityScores = (abilityScores: AbilityScoreMap) =>
  pipe(
    merge<WithAbilityScores>({ abilityScores })
  );

export const createAbilityScore: Creator<AbilityScore> = pipe(
  withName,
  withValue(0)
);

const getDefaultAbilityScores = (initialValue = 0): AbilityScoreMap =>
  Object.values(AbilityScoreType).reduce<AbilityScoreMap>(
    (map, name) => ({
      ...map,
      [name]: createAbilityScore({ name, value: initialValue }),
    }),
    {} as AbilityScoreMap
  );

export const withDefaultAbilityScores = (initialValue = 0) =>
  withAbilityScores(getDefaultAbilityScores(initialValue));
