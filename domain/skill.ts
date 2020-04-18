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
  { name: SkillType.Athletics, keyAbilityScore: AbilityScoreType.Strength },

  { name: SkillType.Acrobatics, keyAbilityScore: AbilityScoreType.Dexterity },
  {
    name: SkillType.SleightOfHand,
    keyAbilityScore: AbilityScoreType.Dexterity,
  },
  { name: SkillType.Stealth, keyAbilityScore: AbilityScoreType.Dexterity },

  { name: SkillType.Arcana, keyAbilityScore: AbilityScoreType.Intelligence },
  { name: SkillType.History, keyAbilityScore: AbilityScoreType.Intelligence },
  {
    name: SkillType.Investigation,
    keyAbilityScore: AbilityScoreType.Intelligence,
  },
  { name: SkillType.Nature, keyAbilityScore: AbilityScoreType.Intelligence },
  { name: SkillType.Religion, keyAbilityScore: AbilityScoreType.Intelligence },

  { name: SkillType.AnimalHandling, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Insight, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Medicine, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Perception, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Survival, keyAbilityScore: AbilityScoreType.Wisdom },

  { name: SkillType.Deception, keyAbilityScore: AbilityScoreType.Charisma },
  { name: SkillType.Intimidation, keyAbilityScore: AbilityScoreType.Charisma },
  { name: SkillType.Performance, keyAbilityScore: AbilityScoreType.Charisma },
  { name: SkillType.Persuasion, keyAbilityScore: AbilityScoreType.Charisma },
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

export const getSkills = ({ skills }: WithSkills): Skill[] => skills;
