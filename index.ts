import { createCharacter } from "./domain/character";
import {
  getAbilityScoreModifier,
  AbilityScoreType,
} from "./domain/abilityScore";
import { head } from "ramda";
import {
  setProficiencyTo,
  getProficient,
  setProficiencyToMap,
} from "./domain/interfaces/WithHasProficiency";
import { SkillType, getSkills } from "./domain/skill";
import { getSavingThrows } from "./domain/savingThrow";

const c = createCharacter({
  name: "Uriann",
});

setProficiencyTo([SkillType.Insight, SkillType.Religion])(getSkills(c));
setProficiencyToMap([AbilityScoreType.wisdom, AbilityScoreType.charisma])(
  getSavingThrows(c)
);

const proficientSkills = getProficient(getSkills(c));
const proficientSavingThrow = getProficient(getSavingThrows(c));

console.log(
  { c },
  getAbilityScoreModifier(AbilityScoreType.strength)(c),
  c.savingThrows,
  head(c.classes),
  c.skills,
  proficientSkills,
  proficientSavingThrow
);
