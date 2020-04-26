import * as R from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { withDefaultAbilityScores, WithAbilityScores } from "./abilityScore";

import { Creator } from "./creators";
import { withDefaultSavingThrows, WithSavingThrows } from "./savingThrow";
import { withClasses, WithClasses } from "./class";
import { WithSkills, withSkills } from "./rpg/skill/skill";
import { WithEquipments, withEquipments } from "./equipments/equipment";

export interface Character
  extends WithName,
    WithAbilityScores,
    WithSavingThrows,
    WithClasses,
    WithSkills,
    WithEquipments {}

export const createCharacter: Creator<Character> = R.pipe(
  withName,
  withDefaultAbilityScores(10),
  withDefaultSavingThrows(0),
  withClasses([]),
  withSkills([]),
  withEquipments([])
);
