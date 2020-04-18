import { Dice } from "./dice";
import { DamageType } from "./enums/DamageType";

export interface Damage {
  dice: Dice;
  type: DamageType;
}
