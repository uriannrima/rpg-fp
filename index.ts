import { createCharacter } from "./domain/character";
import { updateAbilityScore } from "./domain/abilityScore";
import {
  setProficiencyTo,
  setProficiencyToMap,
} from "./domain/interfaces/WithHasProficiency";
import { SkillType, getSkills } from "./domain/rpg/skill/skill";
import { getSavingThrows } from "./domain/savingThrow";
import { getArmorClass } from "./domain/armorClass";

import { AbilityScoreType } from "./domain/enums/AbilityScoreType";
import {
  setEquipments,
  EXAMPLE_EQUIPMENTS,
} from "./domain/equipments/equipment";

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
