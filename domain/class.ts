import R, { pipe } from "ramda";

import { WithName, withName, getName } from "./interfaces/WithName";
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
import { ClassType } from "./enums/ClassType";
import { AbilityScoreType } from "./enums/AbilityScoreType";

/** Types & Interfaces */

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
      ...[AbilityScoreType.Strength, AbilityScoreType.Constitution].map(
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
