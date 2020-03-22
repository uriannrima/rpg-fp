import { createCharacter } from "./domain/rpg/character";
import { FiveEditionSkillsType as SkillType } from "./domain/rpg/skill";
import { AbilityScoresType } from "./domain/rpg/abilityScore";
import { setAbilityScores, setProficiencyTo } from "./domain/fp/setters";
import { createHitpoints } from "./domain/rpg/hitPoints";
import { ClassType, setClass } from "./domain/rpg/class";

const character = createCharacter({
  name: "Uriann",
  proficiencyBonus: 2,
  armorClass: 9,
  speed: "25ft",
  fate: 1,
  inspiration: 1,
  hitPoints: createHitpoints({
    maximum: 10,
    current: 10,
    temporary: 0
  })
});

setProficiencyTo<AbilityScoresType>([
  AbilityScoresType.Wisdom,
  AbilityScoresType.Charisma
])(character.savingThrows);

setProficiencyTo<SkillType>([SkillType.Religion, SkillType.Insight])(
  character.skills
);

setAbilityScores([
  {
    name: AbilityScoresType.Strength,
    value: 14
  },
  {
    name: AbilityScoresType.Dexterity,
    value: 9
  },
  {
    name: AbilityScoresType.Constitution,
    value: 15
  },
  {
    name: AbilityScoresType.Intelligence,
    value: 11
  },
  {
    name: AbilityScoresType.Wisdom,
    value: 16
  },
  {
    name: AbilityScoresType.Charisma,
    value: 13
  }
])(character);

setClass(ClassType.Druid)(character.classes);

console.log({ character }, character.abilityScores);
