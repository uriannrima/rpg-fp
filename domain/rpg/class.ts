import {
  compose,
  set,
  get,
  find,
  simpleEquals,
  join,
  mergeJoin,
  trace,
  groupBy
} from "../fp/pureFunctions";
import { withCollectionOf, withProperty } from "./property";
import { Creator } from "../fp/base";
import { WithHitDie, withHitDie } from "./hitDie";
import { getName, getElementOrHead } from "../fp/getters";

export enum ClassType {
  Barbarian = "Barbarian",
  Bard = "Bard",
  Cleric = "Cleric",
  Druid = "Druid",
  Fighter = "Fighter",
  Monk = "Monk",
  Paladin = "Paladin",
  Ranger = "Ranger",
  Rogue = "Rogue",
  Sorcerer = "Sorcerer",
  Warlock = "Warlock",
  Wizard = "Wizard"
}

export type ClassName = ClassType | string;

export interface ClassDefinition {
  name: ClassName;
  hitDie: number;
}

export const ClassesDefinitions: ClassDefinition[] = [
  {
    name: ClassType.Barbarian,
    hitDie: 12
  },
  {
    name: ClassType.Fighter,
    hitDie: 10
  },
  {
    name: ClassType.Paladin,
    hitDie: 10
  },
  {
    name: ClassType.Ranger,
    hitDie: 10
  },
  {
    name: ClassType.Bard,
    hitDie: 8
  },
  {
    name: ClassType.Cleric,
    hitDie: 8
  },
  {
    name: ClassType.Druid,
    hitDie: 8
  },
  {
    name: ClassType.Monk,
    hitDie: 8
  },
  {
    name: ClassType.Rogue,
    hitDie: 8
  },
  {
    name: ClassType.Warlock,
    hitDie: 8
  },
  {
    name: ClassType.Wizard,
    hitDie: 6
  },
  {
    name: ClassType.Sorcerer,
    hitDie: 6
  }
];

export const ClassByHitDie = groupBy(get("hitDie"))(ClassesDefinitions);

export interface Class extends WithHitDie {
  name: ClassName;
  level: number;
}

const setHitDieByClass = (classesDefinitions: ClassDefinition[]) =>
  compose(
    mergeJoin,
    join(
      compose(
        set("hitDie.faces"),
        get("hitDie"),
        // Find predicate is applied to EACH element of the array.
        // So we may get the entry name, do a simple Equal, if its true, will return the entire object.
        (name: ClassName) =>
          find(compose(simpleEquals(name), getName))(classesDefinitions),
        getName
      )
    )
  );

export const setClass = (className: ClassName) =>
  compose(
    setHitDieByClass(ClassesDefinitions),
    set<ClassName>("name")(className),
    getElementOrHead
  );

export const createClass: Creator<Class> = compose(
  setHitDieByClass(ClassesDefinitions),
  withHitDie,
  withProperty<string>("name", ClassType.Barbarian),
  withProperty("level", 1)
);

export interface WithClasses {
  classes: Class[];
}

export const withClasses = withCollectionOf("classes", createClass, 1);
