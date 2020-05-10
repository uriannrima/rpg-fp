import { pipe } from "ramda";

import { merge } from "../../property";

import { getDefaultAbilityScores } from "./getters";
import { AbilityScores, WithAbilityScores } from "./interfaces";

export const withAbilityScores = (
  abilityScores: AbilityScores,
): (<TEntry>(entry: TEntry) => TEntry & WithAbilityScores) =>
  pipe(
    merge<WithAbilityScores>({ abilityScores }),
  );

export const withDefaultAbilityScores = (
  initialValue = 0,
): (<TEntry>(entry: TEntry) => TEntry & WithAbilityScores) =>
  withAbilityScores(getDefaultAbilityScores(initialValue));
