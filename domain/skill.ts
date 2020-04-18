import * as R from "ramda";
import * as E from "fp-ts/lib/Either";

import {
  WithHasProficiency,
  withHasProficiency,
} from "./interfaces/WithHasProficiency";
import { WithName, withName, getName } from "./interfaces/WithName";
import { WithValue, withValue } from "./interfaces/WithValue";
import { AbilityScoreType } from "./abilityScore";
import { merge, MergeFn } from "./property";
import { Creator } from "./creators";
import {
  WithKeyAbilityScore,
  withKeyAbilityScore,
} from "./interfaces/WithKeyAbilityScore";

import { createGetDefinition } from "./utils/definitions";
import { onDefaultError } from "./utils/errorHandling";
import { notUndefined } from "./utils/checking";
import { filter } from "./utils/array";

/** Types & Interfaces */

export interface Skill
  extends WithHasProficiency,
    WithName,
    WithValue<number>,
    WithKeyAbilityScore {}

export enum SkillType {
  Athletics = "Athletics",

  Acrobatics = "Acrobatics",
  SleightOfHand = "Sleight of Hand",
  Stealth = "Stealth",

  Arcana = "Arcana",
  History = "History",
  Investigation = "Investigation",
  Nature = "Nature",
  Religion = "Religion",

  AnimalHandling = "Animal Handling",
  Insight = "Insight",
  Medicine = "Medicine",
  Perception = "Perception",
  Survival = "Survival",

  Deception = "Deception",
  Intimidation = "Intimidation",
  Performance = "Performance",
  Persuasion = "Persuasion",
}

export interface SkillDefinition extends WithName, WithKeyAbilityScore {}

/** Creators */

export const createSkill: Creator<Skill> = R.pipe(
  withName,
  withValue(0),
  withHasProficiency,
  withKeyAbilityScore
);

/** Definitions */

export const SkillsDefinitions: SkillDefinition[] = [
  { name: SkillType.Athletics, keyAbilityScore: AbilityScoreType.strength },

  { name: SkillType.Acrobatics, keyAbilityScore: AbilityScoreType.dexterity },
  {
    name: SkillType.SleightOfHand,
    keyAbilityScore: AbilityScoreType.dexterity,
  },
  { name: SkillType.Stealth, keyAbilityScore: AbilityScoreType.dexterity },

  { name: SkillType.Arcana, keyAbilityScore: AbilityScoreType.intelligence },
  { name: SkillType.History, keyAbilityScore: AbilityScoreType.intelligence },
  {
    name: SkillType.Investigation,
    keyAbilityScore: AbilityScoreType.intelligence,
  },
  { name: SkillType.Nature, keyAbilityScore: AbilityScoreType.intelligence },
  { name: SkillType.Religion, keyAbilityScore: AbilityScoreType.intelligence },

  { name: SkillType.AnimalHandling, keyAbilityScore: AbilityScoreType.wisdom },
  { name: SkillType.Insight, keyAbilityScore: AbilityScoreType.wisdom },
  { name: SkillType.Medicine, keyAbilityScore: AbilityScoreType.wisdom },
  { name: SkillType.Perception, keyAbilityScore: AbilityScoreType.wisdom },
  { name: SkillType.Survival, keyAbilityScore: AbilityScoreType.wisdom },

  { name: SkillType.Deception, keyAbilityScore: AbilityScoreType.charisma },
  { name: SkillType.Intimidation, keyAbilityScore: AbilityScoreType.charisma },
  { name: SkillType.Performance, keyAbilityScore: AbilityScoreType.charisma },
  { name: SkillType.Persuasion, keyAbilityScore: AbilityScoreType.charisma },
];

/** Getters */

const getSkillDefinition = createGetDefinition(
  SkillsDefinitions
)((definitionToFind: string | SkillType) =>
  R.pipe(getName, R.equals(definitionToFind))
);

/** Withs */

export interface WithSkills {
  skills: Skill[];
}

export const withSkills = (skills: Skill[]): MergeFn<WithSkills> =>
  merge<WithSkills>({ skills });

export const getDefaultSkills = (initialValue = 0): Skill[] =>
  R.pipe(
    Object.values,
    R.map(getSkillDefinition),
    R.map(
      E.fold(onDefaultError(undefined), (skillDefinition) => {
        const { name, keyAbilityScore } = skillDefinition;

        return createSkill({
          name,
          value: initialValue,
          keyAbilityScore,
        });
      })
    ),
    filter(notUndefined)
  )(SkillType);

export const withDefaultSkills = (initialValue = 0): MergeFn<WithSkills> =>
  withSkills(getDefaultSkills(initialValue));

export const getSkills = (c: WithSkills): Skill[] => c.skills;
