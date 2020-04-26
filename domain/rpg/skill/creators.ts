import * as Ramda from "ramda";

import { Creator } from "../../creators";
import { withName } from "../../interfaces/WithName";
import { withValue } from "../../interfaces/WithValue";
import { withHasProficiency } from "../../interfaces/WithHasProficiency";
import { withKeyAbilityScore } from "../../interfaces/WithKeyAbilityScore";

import { Skill } from "./interfaces";

export const createSkill: Creator<Skill> = Ramda.pipe(
  withName,
  withValue(0),
  withHasProficiency,
  withKeyAbilityScore
);
