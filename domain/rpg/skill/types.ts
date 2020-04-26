import { Name } from "../../interfaces/WithName";

import { Skill, SkillDefinition } from "./interfaces";

export type Skills = Skill[];

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

export type SkillName = Name | SkillType;
export type SkillDefinitions = SkillDefinition[];
