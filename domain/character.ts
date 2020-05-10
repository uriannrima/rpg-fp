import * as Ramda from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { Creator } from "./creators";
import { withDefaultSavingThrows, WithSavingThrows } from "./savingThrow";
import { withClasses, WithClasses } from "./class";
import { WithSkills } from "./rpg/skill/interfaces";
import { withSkills } from "./rpg/skill/withs";
import {
  WithProficiencyBonus,
  withProficiencyBonus,
} from "./interfaces/WithProficiencyBonus";
import { WithAbilityScores } from "./rpg/abilityScores/interfaces";
import { WithEquipments } from "./rpg/equipments/interfaces";
import { withDefaultAbilityScores } from "./rpg/abilityScores/withs";
import { withEquipments } from "./rpg/equipments/withs";

export interface Character
  extends WithName,
    WithAbilityScores,
    WithSavingThrows,
    WithClasses,
    WithSkills,
    WithEquipments,
    WithProficiencyBonus {}

export const createCharacter: Creator<Character> = Ramda.pipe(
  withName,
  withDefaultAbilityScores(10),
  withDefaultSavingThrows(0),
  withClasses([]),
  withSkills([]),
  withEquipments([]),
  withProficiencyBonus(0),
);
