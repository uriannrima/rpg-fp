import { createCharacter } from "./domain/character";
import { AbilityScoreType, updateAbilityScore } from "./domain/abilityScore";
import {
  setProficiencyTo,
  setProficiencyToMap,
} from "./domain/interfaces/WithHasProficiency";
import { SkillType, getSkills } from "./domain/skill";
import { getSavingThrows } from "./domain/savingThrow";
import { getArmorClass } from "./domain/armorClass";
import {
  setEquipments,
  EXAMPLE_EQUIPMENTS,
} from "./domain/equipment/equipment";

const c = createCharacter({
  name: "Uriann",
});

setProficiencyTo([SkillType.Insight, SkillType.Religion])(getSkills(c));
setProficiencyToMap([AbilityScoreType.Wisdom, AbilityScoreType.Charisma])(
  getSavingThrows(c)
);

// setAbilityScore(
//   setAbilityScoreValue(14)(
//     getAbilityScore(AbilityScoreType.Dexterity)(getAbilityScores(c))
//   )
// )(c);

updateAbilityScore(AbilityScoreType.Dexterity)(16)(c);
setEquipments(EXAMPLE_EQUIPMENTS)(c);

console.log(
  // { c },
  // getAbilityScoreModifier(AbilityScoreType.Strength)(c),
  // c.savingThrows,
  // head(c.classes),
  // c.skills,
  // proficientSkills,
  // proficientSavingThrow,
  // c.abilityScores[AbilityScoreType.Charisma],
  c.abilityScores.dexterity,
  c.equipments,
  getArmorClass(AbilityScoreType.Dexterity)(c)
);
