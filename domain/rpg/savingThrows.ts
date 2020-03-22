import { WithHasProficiency, withHasProficiency } from "./skill";
import { compose, map, encapsulate } from "../fp/pureFunctions";
import { Field, withValue, withName, withCollectionOf } from "./property";
import { AbilityScoresType } from "./abilityScore";

export interface SavingThrow extends Field<number>, WithHasProficiency {}

export interface WithSavingThrows {
  savingThrows: SavingThrow[];
}

export const createSavingThrow = compose(
  withHasProficiency,
  withValue,
  withName
);

export const setDefaultSavingThrows = compose(
  compose(createSavingThrow, encapsulate("name")),
  Object.keys
);

export const withSavingThrows = compose(
  // setDefaultSavingThrows(AbilityScoresType),
  withCollectionOf("savingThrows", createSavingThrow, 6)
);
