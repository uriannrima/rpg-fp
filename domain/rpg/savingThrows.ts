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
import { Field, withValue, withName, withCollectionOf } from "../fp/property";
import { AbilityScoresType } from "./abilityScore";
import { Creator } from "../fp/base";

export interface SavingThrow extends Field<number>, WithHasProficiency {}

export interface WithSavingThrows {
  savingThrows: SavingThrow[];
}

export const createSavingThrow: Creator<SavingThrow> = compose(
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
  withCollectionOf<SavingThrow, WithSavingThrows>("savingThrows")(
    createSavingThrow
  )(6)
);
