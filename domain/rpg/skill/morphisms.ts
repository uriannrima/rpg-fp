import * as Reader from "fp-ts/lib/Reader";

import { Configuration } from "../Configuration";

import { Skills } from "./types";
import { createSkill } from "./creators";
import { SkillDefinition, Skill } from "./interfaces";

const definitionToSkill = () => (definition: SkillDefinition): Skill =>
  createSkill({ ...definition });

export const getDefaultSkills = (): Reader.Reader<Configuration, Skills> => (
  configuration
): Skills => configuration.definitions.skills.map(definitionToSkill());
