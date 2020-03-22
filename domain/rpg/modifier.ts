import { Field, withField, withCollectionOf } from "./property";
import { Creator } from "../fp/base";
import { getPropertyTotal, getValue } from "../fp/getters";
import { sumReduce } from "../fp/pureFunctions";

export interface Modifier extends Field<number> {}

export interface WithModifiers {
  modifiers: Modifier[];
}

export const createModifier: Creator<Modifier> = withField;

export const withModifiers = withCollectionOf("modifiers", createModifier);

export const getModifiersTotal: (entity: any) => number = getPropertyTotal(
  "modifiers",
  getValue,
  sumReduce,
  0
);
