import {
  identity,
  sumReduce,
  curry,
  compose,
  addOperation
} from "./pureFunctions";
import { AbilityScoresType, findAbilityScoreByName } from "../rpg/abilityScore";

export const getValue = get("value");
export const getName = get("name");
export const getAbilityScores = get("abilityScores");

export const getPropertyTotal = curry(
  (propertyName, mapFn = identity, reduceFn = sumReduce, defaultValue = 0) =>
    compose(reduce(reduceFn)(defaultValue), map(mapFn), get(propertyName))
);

export const getWithProficiency = compose(filter(get("hasProficiency")));

export const getSkillsGroupedByKeyAbilityScore = groupBy(
  get("keyAbilityScore")
);

const getModifier = value => Math.floor((value - 10) / 2);

export const getPassivePerception = compose(
  addOperation(10),
  getModifier,
  getValue,
  findAbilityScoreByName(AbilityScoresType.Wisdom),
  getAbilityScores
);
