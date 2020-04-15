import { pipe } from "ramda";

import { Creator } from "./creators";
import { WithName, withName } from "./interfaces/WithName";
import { withDefaultAbilityScores, WithAbilityScores } from "./abilityScore";

interface Character extends WithName, WithAbilityScores {}

export const createCharacter: Creator<Character> = pipe(
  withName,
  withDefaultAbilityScores(10)
);
