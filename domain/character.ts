import * as R from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { withDefaultAbilityScores, WithAbilityScores } from "./abilityScore";

import { Creator } from "./creators";
import { withDefaultSavingThrows, WithSavingThrows } from "./savingThrow";
import { withClasses, WithClasses } from "./class";
import { WithEquipments, withEquipments } from "./equipments/equipment";
import { WithSkills } from "./rpg/skill/interfaces";
import { withSkills } from "./rpg/skill/withs";
import {
  WithProficiencyBonus,
  withProficiencyBonus,
} from "./interfaces/WithProficiencyBonus";

export interface Character
  extends WithName,
    WithAbilityScores,
    WithSavingThrows,
    WithClasses,
    WithSkills,
    WithEquipments,
    WithProficiencyBonus {}

export const createCharacter: Creator<Character> = R.pipe(
  withName,
  withDefaultAbilityScores(10),
  withDefaultSavingThrows(0),
  withClasses([]),
  withSkills([]),
  withEquipments([]),
  withProficiencyBonus(0)
);
