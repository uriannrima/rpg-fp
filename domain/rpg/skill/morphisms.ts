import * as Reader from "fp-ts/lib/Reader";

import { Configuration } from "../Configuration";

import { Skills } from "./types";
import { createSkill } from "./creators";
import { SkillDefinition, Skill } from "./interfaces";

const definitionToSkill = (initialValue = 0) => (
  definition: SkillDefinition
): Skill => createSkill({ ...definition, value: initialValue });

export const getDefaultSkills = (
  initialValue = 0
): Reader.Reader<Configuration, Skills> => (configuration): Skills =>
  configuration.definitions.skills.map(definitionToSkill(initialValue));
