import { pipe } from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { WithValue, withValue, getValue } from "./interfaces/WithValue";

import { merge } from "./property";
import { Creator } from "./creators";
import { getModifier } from "./utils/computations";

/** Types & Interfaces */

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

export type AbilityScoreDictionary = {
  [key: string]: AbilityScore;
};

export type AbilityScores = AbilityScoreMap & AbilityScoreDictionary;

export interface WithAbilityScores {
  abilityScores: AbilityScores;
}

/** Creators */

export const createAbilityScore: Creator<AbilityScore> = pipe(
  withName,
  withValue(0)
);

/** Getters */

const getDefaultAbilityScores = (initialValue = 0): AbilityScores =>
  Object.values(AbilityScoreType).reduce<AbilityScores>(
    (map, name) => ({
      ...map,
      [name]: createAbilityScore({ name, value: initialValue }),
    }),
    {} as AbilityScores
  );

export const getAbilityScores = (a: WithAbilityScores): AbilityScores =>
  a.abilityScores;

export const getAbilityScore = (abilityScore: AbilityScoreType) => (
  abilityScores: AbilityScores
): AbilityScore => abilityScores[abilityScore];

export const getAbilityScoreModifier = (
  abilityScore: AbilityScoreType
): ((withAbilityScores: WithAbilityScores) => number) =>
  pipe(getAbilityScores, getAbilityScore(abilityScore), getValue, getModifier);

/** Withs */

export const withAbilityScores = (
  abilityScores: AbilityScores
): (<TEntry>(entry: TEntry) => TEntry & WithAbilityScores) =>
  pipe(
    merge<WithAbilityScores>({ abilityScores })
  );

export const withDefaultAbilityScores = (
  initialValue = 0
): (<TEntry>(entry: TEntry) => TEntry & WithAbilityScores) =>
  withAbilityScores(getDefaultAbilityScores(initialValue));
