import { WithType } from "../proficiency";
import { Cost } from "../interfaces/Cost";
import { Weight } from "../interfaces/Weight";
import { EquipmentType } from "../enums/EquipmentType";
import { ArmorType } from "../enums/ArmorType";

export interface Armor extends WithType<EquipmentType.Armor> {
  name: string;
  cost: Cost;
  baseArmor: number;
  maxModifier?: number;
  minStrength?: number;
  hasDisadvantage: boolean;
  weight: Weight;
  armorType: ArmorType;
}