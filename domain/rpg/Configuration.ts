import { Lens } from "monocle-ts";
import { SkillDefinitions } from "./skill/types";

interface Definitions {
  skills: SkillDefinitions;
}

export interface Configuration {
  definitions: Definitions;
}

export const definitionsLens = Lens.fromProp<{ definitions: Definitions }>()(
  "definitions"
);

export const skillsLens = Lens.fromProp<{ skills: SkillDefinitions }>()(
  "skills"
);

export const getDefinitions = ({ definitions }: Configuration) => definitions;

export const getSkills = ({ skills }: { skills: SkillDefinitions }) => skills;
