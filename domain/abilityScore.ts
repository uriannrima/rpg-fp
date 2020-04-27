import { pipe } from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { WithValue, withValue, getValue } from "./interfaces/WithValue";

import { merge } from "./property";
import { Creator } from "./creators";
import { getModifier } from "./utils/number";
import { KeyMap } from "./utils/enum";
import { applyTo } from "./utils/pipe";
import { AbilityScoreType } from "./enums/AbilityScoreType";

/** Types & Interfaces */

export interface AbilityScore extends WithName, WithValue<number> {}

export type AbilityScores = KeyMap<AbilityScoreType, AbilityScore>;

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

export const getAbilityScores = ({
  abilityScores,
}: WithAbilityScores): AbilityScores => abilityScores;

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

export const setAbilityScoreValue = (value: number) => (
  score: AbilityScore
): AbilityScore => ({
  ...score,
  value,
});

export const setAbilityScore = (newAbilityScore: AbilityScore) => (
  c: WithAbilityScores
): WithAbilityScores => {
  c.abilityScores[newAbilityScore.name] = newAbilityScore;
  return c;
};

export const updateAbilityScore = (abilityScore: AbilityScoreType) => (
  value: number
) => (c: WithAbilityScores): WithAbilityScores =>
  pipe(
    getAbilityScores,
    getAbilityScore(abilityScore),
    setAbilityScoreValue(value),
    setAbilityScore,
    applyTo(c)
  )(c);
