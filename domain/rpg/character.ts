import { compose } from "../fp/pureFunctions";
import { WithSkills, withSkills } from "./skill";
import { WithSavingThrows, withSavingThrows } from "./savingThrows";
import { WithAbilityScores, withAbilityScores } from "./abilityScore";
import { WithName, withName, withProperty } from "./property";
import { WithProficiencyBonus, withProficiencyBonus } from "./proficiencyBonus";
import { Creator } from "../fp/base";
import { WithArmorClass, withArmorClass } from "./armorClass";
import { WithInitiative, withInitiative } from "./initiative";
import { WithSpeed, withSpeed } from "./speed";
import { WithFate, withFate } from "./fate";
import { WithInspiration, withInspiration } from "./inspiration";
import { WithHitpoints, withHitpoints } from "./hitPoints";
import { WithHitDice, withHitDice } from "./hitDice";
import { WithDeathSaves, withDeathSaves } from "./deathSaves";
import { WithDescriptions, withDescriptions } from "./descriptions";
import { WithClasses, withClasses } from "./class";
import { getName } from "../fp/getters";

interface Character
  extends WithName,
    WithSkills,
    WithAbilityScores,
    WithProficiencyBonus,
    WithSavingThrows,
    WithArmorClass,
    WithInitiative,
    WithSpeed,
    WithFate,
    WithInspiration,
    WithHitpoints,
    WithHitDice,
    WithDeathSaves,
    WithDescriptions,
    WithClasses {}

export const createCharacter: Creator<Character> = compose(
  withClasses,
  withDescriptions,
  withDeathSaves,
  withHitDice,
  withHitpoints,
  withInspiration,
  withFate,
  withSpeed,
  withInitiative,
  withArmorClass,
  withSavingThrows,
  withProficiencyBonus,
  withSkills,
  withAbilityScores,
  withName
);
