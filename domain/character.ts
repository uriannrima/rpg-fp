import * as R from "ramda";

import { WithName, withName } from "./interfaces/WithName";
import { withDefaultAbilityScores, WithAbilityScores } from "./abilityScore";

import { Creator } from "./creators";
import { withDefaultSavingThrows, WithSavingThrows } from "./savingThrow";
import { withClasses, WithClasses } from "./class";
import { WithSkills, withDefaultSkills } from "./skill";

export interface Character
  extends WithName,
    WithAbilityScores,
    WithSavingThrows,
    WithClasses,
    WithSkills {}

export const createCharacter: Creator<Character> = R.pipe(
  withName,
  withDefaultAbilityScores(10),
  withDefaultSavingThrows(0),
  withClasses([]),
  withDefaultSkills(0)
);
