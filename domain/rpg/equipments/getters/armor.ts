import * as Ramda from "ramda";
import { pipe } from "fp-ts/lib/pipeable";

import { max } from "../../../utils/number";
import { Armor } from "../interfaces/armor";

export const getArmorClass = (modifier: number) => ({
  baseArmor,
  maxModifier,
}: Armor) =>
  pipe(max(maxModifier), Ramda.applyTo(modifier), Ramda.add(baseArmor));
