import * as Ramda from "ramda";
import * as Reader from "fp-ts/lib/Reader";
import { flow } from "fp-ts/lib/function";

import * as Configuration from "../Configuration";

import { Skills } from "./types";
import { createSkill } from "./creators";
import { SkillDefinition, Skill } from "./interfaces";

export const skillDefinitionToSkill = (definition: SkillDefinition): Skill =>
  createSkill({ ...definition });

export const getDefaultSkills = (): Reader.Reader<
  Configuration.Configuration,
  Skills
> =>
  flow(
    Configuration.getDefinitions,
    Configuration.getSkills,
    Ramda.map(skillDefinitionToSkill)
  );
