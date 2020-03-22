import { AbilityScoresType } from "./abilityScore";
import {
  Field,
  WithName,
  WithDescription,
  withField,
  withProperty,
  withDescription,
  withName,
  withCollectionOf
} from "./property";
import { Creator } from "../fp/base";
import { compose, set, map } from "../fp/pureFunctions";
import { WithModifiers, getModifiersTotal, withModifiers } from "./modifier";

export enum FiveEditionSkillsType {
  Acrobatics = "Acrobatics",
  AnimalHandling = "Animal Handling",
  Arcana = "Arcana",
  Athletics = "Athletics",
  Deception = "Deception",
  History = "History",
  Insight = "Insight",
  Intimidation = "Intimidation",
  Investigation = "Investigation",
  Medicine = "Medicine",
  Nature = "Nature",
  Perception = "Perception",
  Perfomance = "Perfomance",
  Persuasion = "Persuasion",
  Religion = "Religion",
  SleightOfHand = "Sleight of Hand",
  Stealth = "Stealth",
  Survival = "Survival"
}
export type SkillNameType = FiveEditionSkillsType | string;

export const SkillsDefinitions: {
  name: SkillNameType;
  keyAbilityScore: AbilityScoresType;
}[] = [
  {
    name: "Acrobatics",
    keyAbilityScore: AbilityScoresType.Dexterity
  },
  {
    name: "Animal Handling",
    keyAbilityScore: AbilityScoresType.Wisdom
  },
  {
    name: "Arcana",
    keyAbilityScore: AbilityScoresType.Intelligence
  },
  {
    name: "Athletics",
    keyAbilityScore: AbilityScoresType.Strength
  },
  {
    name: "Deception",
    keyAbilityScore: AbilityScoresType.Charisma
  },
  {
    name: "History",
    keyAbilityScore: AbilityScoresType.Intelligence
  },
  {
    name: "Insight",
    keyAbilityScore: AbilityScoresType.Wisdom
  },
  {
    name: "Intimidation",
    keyAbilityScore: AbilityScoresType.Charisma
  },
  {
    name: "Investigation",
    keyAbilityScore: AbilityScoresType.Intelligence
  },
  {
    name: "Medicine",
    keyAbilityScore: AbilityScoresType.Wisdom
  },
  {
    name: "Nature",
    keyAbilityScore: AbilityScoresType.Intelligence
  },
  {
    name: "Perception",
    keyAbilityScore: AbilityScoresType.Wisdom
  },
  {
    name: "Perfomance",
    keyAbilityScore: AbilityScoresType.Charisma
  },
  {
    name: "Persuasion",
    keyAbilityScore: AbilityScoresType.Charisma
  },
  {
    name: "Religion",
    keyAbilityScore: AbilityScoresType.Intelligence
  },
  {
    name: "Sleight of Hand",
    keyAbilityScore: AbilityScoresType.Dexterity
  },
  {
    name: "Stealth",
    keyAbilityScore: AbilityScoresType.Dexterity
  },
  {
    name: "Survival",
    keyAbilityScore: AbilityScoresType.Wisdom
  }
];

export interface WithIsClassSkill {
  isClassSkill: boolean;
}

export interface WithIsUntrainedSkill {
  isUntrainedSkill: boolean;
}

export interface WithHasProficiency {
  hasProficiency: boolean;
}

export interface WithHasArmorCheckPenalty {
  hasArmorCheckPenalty: boolean;
}

export interface WithKeyAbilityScore {
  keyAbilityScore: string | AbilityScoresType;
}

export interface WithSkills {
  skills: Skill[];
}

export interface With35Skills {
  skills: Skill35[];
}

export interface WithSubType {
  subType: SubType;
}

export interface SubType extends Field<number> {}

export interface Skill
  extends Field<number, SkillNameType>,
    WithKeyAbilityScore {
  hasProficiency: boolean;
}

export interface Skill35
  extends WithKeyAbilityScore,
    WithName,
    WithDescription,
    WithIsUntrainedSkill,
    WithHasArmorCheckPenalty,
    WithIsClassSkill,
    WithModifiers,
    WithSubType {
  getTotal(): number;
}

export const createSubType: Creator<SubType> = withField;

export const withIsClassSkill = withProperty("isClassSkill", false);

export const withIsUntrainedSkill = withProperty("isUntrainedSkill", false);

export const withHasProficiency = withProperty("hasProficiency", false);

export const withHasArmorCheckPenalty = withProperty(
  "hasArmorCheckPenalty",
  false
);

export const withKeyAbilityScore = withProperty(
  "keyAbilityScore",
  AbilityScoresType.Strength
);

export const create35Skill: Creator<Skill35> = compose(
  withProperty("getTotal", getModifiersTotal),
  withProperty("subType", createSubType()),
  withModifiers(3),
  withHasArmorCheckPenalty,
  withIsUntrainedSkill,
  withIsClassSkill,
  withDescription,
  withKeyAbilityScore,
  withName
);

export const createSkill: Creator<Skill> = compose(
  withHasProficiency,
  withKeyAbilityScore,
  withField
);

export const with35Skills = withCollectionOf("skills", create35Skill, 5);

export const setDefaultSkills = compose(
  set("skills"),
  map(createSkill)(SkillsDefinitions)
);

export const withSkills = compose(
  // setDefaultSkills,
  withCollectionOf("skills", createSkill, 5)
);
