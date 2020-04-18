import { WithType } from "../proficiency";
import { EquipmentType } from "../enums/EquipmentType";
import { Cost } from "../interfaces/Cost";
import { Damage } from "../damage";
import { Weight } from "../interfaces/Weight";
import { EquipmentProperty } from "./equipment";

export interface Weapon extends WithType<EquipmentType.Weapon> {
  name: string;
  cost: Cost;
  damage: Damage;
  weight: Weight;
  properties: EquipmentProperty[];
}
