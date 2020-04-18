import * as R from "ramda";
import { pipe } from "fp-ts/lib/pipeable";

import { merge } from "../property";
import { WithName, getName } from "./WithName";
import { filter } from "../utils/array";

export interface WithHasProficiency {
  hasProficiency: boolean;
}

export const withHasProficiency = merge<WithHasProficiency>({
  hasProficiency: false,
});

export const setHasProficiency = (hasProficiency: boolean) => <
  TEntry extends WithHasProficiency
>(
  entry: TEntry
): TEntry => Object.assign(entry, { hasProficiency });

export const setProficient = setHasProficiency(true);

const inside = <T>(array: T[]) => (
  searchElement: T,
  fromIndex?: number
): boolean => array.includes(searchElement, fromIndex);

type ProficiencyWithName = WithHasProficiency & WithName;

export const setProficiencyTo = (proficiency: string[]) => (
  toSet: ProficiencyWithName[]
): void => {
  R.forEach(setProficient)(
    R.filter(R.pipe(getName, inside(proficiency)))(toSet)
  );
};

export const setProficiencyToMap = (proficiency: string[]) => (toSet: {
  [key: string]: WithHasProficiency;
}): void => proficiency.map((p) => toSet[p]).forEach(setProficient);

export const getHasProficiency = ({
  hasProficiency,
}: WithHasProficiency): boolean => hasProficiency;

export const getProficient = R.filter(getHasProficiency);
