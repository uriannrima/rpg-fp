import { WithHasProficiency, withHasProficiency } from "./skill";
import {
  compose,
  map,
  encapsulate,
  join,
  mergeJoin,
  set,
  trace
} from "../fp/pureFunctions";
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
  mergeJoin,
  join(
    compose(
      set("savingThrows"),
      map(compose(createSavingThrow, encapsulate("name"))),
      Object.keys
    )(AbilityScoresType)
  )
);

export const withSavingThrows = compose(
  setDefaultSavingThrows,
  withCollectionOf("savingThrows", createSavingThrow, 6)
);
