import { Field, withField, withCollectionOf } from "../fp/property";
import { Creator } from "../fp/base";
import { findByProperty } from "./filters";
import {
  compose,
  set,
  encapsulate,
  map,
  trace,
  join,
  mergeJoin
} from "../fp/pureFunctions";

export enum AbilityScoresType {
  Strength = "Strength",
  Dexterity = "Dexterity",
  Constitution = "Constitution",
  Intelligence = "Intelligence",
  Wisdom = "Wisdom",
  Charisma = "Charisma"
}

export const FiveEditionAbilityScores: {
  name: AbilityScoresType | string;
}[] = Object.keys(AbilityScoresType).map(name => ({ name }));

export interface AbilityScore extends Field<number> {}

export interface WithAbilityScores {
  abilityScores: AbilityScore[];
}

export const createAbilityScore: Creator<AbilityScore> = withField;

export const setDefaultAbilityScores = compose(
  mergeJoin,
  join(
    compose(
      set("abilityScores"),
      map(compose(createAbilityScore, encapsulate("name"))),
      Object.keys
    )(AbilityScoresType)
  )
);

export const withAbilityScores = compose(
  setDefaultAbilityScores,
  withCollectionOf<AbilityScore, WithAbilityScores>("abilityScores")(
    createAbilityScore
  )(6)
);

export const findAbilityScoreByName = findByProperty<
  AbilityScore,
  AbilityScoresType
>("name");
