import { WithHasProficiency } from "../../interfaces/WithHasProficiency";
import { WithName } from "../../interfaces/WithName";
import { WithValue } from "../../interfaces/WithValue";
import { WithKeyAbilityScore } from "../../interfaces/WithKeyAbilityScore";

export interface Skill
  extends WithHasProficiency,
    WithName,
    WithValue<number>,
    WithKeyAbilityScore {}

export interface WithSkills {
  skills: Skill[];
}

export interface SkillDefinition extends WithName, WithKeyAbilityScore {}
