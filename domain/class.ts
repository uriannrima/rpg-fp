import R, { pipe } from "ramda";
import * as E from "fp-ts/lib/Either";

import { WithName, withName, getName } from "./interfaces/WithName";
import { AbilityScoreType } from "./abilityScore";
import { SkillType } from "./skill";
import {
  Proficiency,
  createArmorProficiency,
  createWeaponProficiency,
  createSavingThrowProficiency,
  createSkillProficiency,
  ArmorProficiencyType,
  WeaponProficiencyType,
} from "./proficiency";
import { merge, MergeFn } from "./property";
import { Creator } from "./creators";
import { WithLevel, withLevel } from "./interfaces/WithLevel";
import { createGetDefinition } from "./utils/definitions";

/** Types & Interfaces */

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
  Wizard = "Wizard",
}

export interface WithProficiencies {
  proficiencies: Proficiency[];
}

export interface ClassDefinition extends WithName, WithProficiencies {}

export interface Class extends WithName, WithLevel {}

export interface WithClasses {
  classes: Class[];
}

/** Creators */

export const createClass: Creator<Class> = pipe(withName, withLevel);

/** Withs */

export const withClasses = (classes: Class[]): MergeFn<WithClasses> =>
  pipe(
    merge<WithClasses>({ classes })
  );

/** Definitions */

export const ClassesDefinitions: ClassDefinition[] = [
  {
    name: ClassType.Barbarian,
    proficiencies: [
      ...[
        ArmorProficiencyType.Light,
        ArmorProficiencyType.Medium,
        ArmorProficiencyType.Shields,
      ].map(createArmorProficiency),
      ...[WeaponProficiencyType.Simple, WeaponProficiencyType.Martial].map(
        createWeaponProficiency
      ),
      ...[AbilityScoreType.strength, AbilityScoreType.constitution].map(
        createSavingThrowProficiency
      ),
      ...[
        SkillType.AnimalHandling,
        SkillType.Athletics,
        SkillType.Intimidation,
        SkillType.Nature,
        SkillType.Perception,
        SkillType.Survival,
      ].map(createSkillProficiency),
    ],
  },
];

/** Getters */

export const getProficiencies = (entry: WithProficiencies): Proficiency[] =>
  entry.proficiencies;

export const getClassDefinition = createGetDefinition(
  ClassesDefinitions
)((toFind: string | ClassType) => R.pipe(getName, R.equals(toFind)));
