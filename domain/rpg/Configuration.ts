import { SkillDefinitions } from "./skill/types";

export interface Configuration {
  definitions: {
    skills: SkillDefinitions;
  };
}

export const getDefinitions = ({ definitions }: Configuration) => definitions;

export const getSkills = ({ skills }: { skills: SkillDefinitions }) => skills;
