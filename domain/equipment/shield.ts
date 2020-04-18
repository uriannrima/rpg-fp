import { WithType } from "../proficiency";
import { EquipmentType } from "../enums/EquipmentType";
import { Cost } from "../interfaces/Cost";
import { Weight } from "../interfaces/Weight";

export interface Shield extends WithType<EquipmentType.Shield> {
  name: string;
  cost: Cost;
  bonusArmor: number;
  maxModifier?: number;
  minStrength?: number;
  hasDisadvantage: boolean;
  weight: Weight;
}
