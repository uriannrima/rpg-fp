import { pipe } from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { WithValue, withValue } from "./interfaces/WithValue";
import {
  WithHasProficiency,
  withHasProficiency,
} from "./interfaces/WithHasProficiency";

import { Creator } from "./creators";
import { AbilityScoreType, AbilityScore } from "./abilityScore";
import { merge, MergeFn } from "./property";
import { Proficiency } from "./proficiency";

/** Types & Interfaces */

export interface SavingThrow
  extends WithName,
    WithValue<number>,
    WithHasProficiency {}

export interface WithSavingThrows {
  savingThrows: SavingThrows;
}

export type SavingThrowMap = {
  [key in keyof typeof AbilityScoreType]: SavingThrow;
};

export type SavingThrowDictionary = {
  [key: string]: SavingThrow;
};

export type SavingThrows = SavingThrowMap & SavingThrowDictionary;

/** Creators */

export const createSavingThrow: Creator<SavingThrow> = pipe(
  withName,
  withValue(0),
  withHasProficiency
);

/** Getters */

const getDefaultSavingThrows = (initialValue = 0): SavingThrows =>
  Object.values(AbilityScoreType).reduce<SavingThrows>(
    (map, name) => ({
      ...map,
      [name]: createSavingThrow({ name, value: initialValue }),
    }),
    {} as SavingThrows
  );

export const getSavingThrow = (savingThrow: string | AbilityScoreType) => (
  savingThrows: SavingThrows
): SavingThrow => savingThrows[savingThrow];

export const getSavingThrows = (a: WithSavingThrows): SavingThrows =>
  a.savingThrows;

/** Withs */

export const withSavingThrows = (
  savingThrows: SavingThrows
): MergeFn<WithSavingThrows> =>
  pipe(
    merge<WithSavingThrows>({ savingThrows })
  );

export const withDefaultSavingThrows = (
  initialValue = 0
): (<TEntry>(entry: TEntry) => TEntry & WithSavingThrows) =>
  withSavingThrows(getDefaultSavingThrows(initialValue));

/** Setters */
