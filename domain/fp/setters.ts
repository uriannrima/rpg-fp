import {
  set,
  compose,
  forEach,
  join,
  mergeJoin,
  executeOn,
  filter,
  includes,
  trace
} from "./pureFunctions";
import { getAbilityScores, getName, getValue } from "./getters";
import { findAbilityScoreByName } from "../rpg/abilityScore";
import { WithHasProficiency } from "../rpg/skill";

export const setProperty = <TProperty = any, TElement = any>(
  propertyName: string
) => set<TProperty, TElement>(propertyName);

export const setValue = setProperty<number>("value");
export const setHasProficiency = setProperty<boolean>("hasProficiency");
export const setProficient = setHasProficiency(true);

export const setAbilityScores = abilityScores =>
  compose(
    forEach(
      compose(
        mergeJoin,
        join(
          compose(
            compose(setValue, getValue),
            executeOn(abilityScores),
            findAbilityScoreByName,
            getName
          )
        )
      )
    ),
    getAbilityScores
  );

export const setProficiencyTo = <TElement>(include: TElement[] = []) =>
  compose<WithHasProficiency[]>(
    forEach(setProficient),
    filter(compose(includes(include), getName))
  );
