import { SkillDefinitions, SkillType } from "./types";
import { AbilityScoreType } from "../../enums/AbilityScoreType";

export const SkillsDefinitions: SkillDefinitions = [
  { name: SkillType.Athletics, keyAbilityScore: AbilityScoreType.Strength },

  { name: SkillType.Acrobatics, keyAbilityScore: AbilityScoreType.Dexterity },
  {
    name: SkillType.SleightOfHand,
    keyAbilityScore: AbilityScoreType.Dexterity,
  },
  { name: SkillType.Stealth, keyAbilityScore: AbilityScoreType.Dexterity },

  { name: SkillType.Arcana, keyAbilityScore: AbilityScoreType.Intelligence },
  { name: SkillType.History, keyAbilityScore: AbilityScoreType.Intelligence },
  {
    name: SkillType.Investigation,
    keyAbilityScore: AbilityScoreType.Intelligence,
  },
  { name: SkillType.Nature, keyAbilityScore: AbilityScoreType.Intelligence },
  { name: SkillType.Religion, keyAbilityScore: AbilityScoreType.Intelligence },

  { name: SkillType.AnimalHandling, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Insight, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Medicine, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Perception, keyAbilityScore: AbilityScoreType.Wisdom },
  { name: SkillType.Survival, keyAbilityScore: AbilityScoreType.Wisdom },

  { name: SkillType.Deception, keyAbilityScore: AbilityScoreType.Charisma },
  { name: SkillType.Intimidation, keyAbilityScore: AbilityScoreType.Charisma },
  { name: SkillType.Performance, keyAbilityScore: AbilityScoreType.Charisma },
  { name: SkillType.Persuasion, keyAbilityScore: AbilityScoreType.Charisma },
];
