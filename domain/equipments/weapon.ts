import { WithType } from "../proficiency";
import { EquipmentType } from "../enums/EquipmentType";
import { Cost } from "../interfaces/Cost";
import { Damage } from "../damage";
import { Weight } from "../interfaces/Weight";
import { EquipmentProperty } from "./equipment";
import { WeaponType } from "../enums/WeaponType";
import { RangeType } from "../enums/RangeType";

export enum WeaponModifierType {
  Attack = "attack",
  Damage = "damage",
}

export interface WeaponModifier {
  name: string;
  type: WeaponModifierType;
}

export interface Weapon extends WithType<EquipmentType.Weapon> {
  name: string;
  cost: Cost;
  damage: Damage;
  weight: Weight;
  properties?: EquipmentProperty[];
  weaponType: WeaponType;
  range: RangeType;
  modifiers?: WeaponModifier[];
}
