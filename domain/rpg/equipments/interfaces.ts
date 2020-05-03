import { Equipment } from "./types";

export interface EquipmentProperty {
  name: string;
  description?: string;
}

export interface WithEquipments {
  equipments: Equipment[];
}

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

export interface Shield extends WithType<EquipmentType.Shield> {
  name: string;
  cost: Cost;
  bonusArmor: number;
  maxModifier?: number;
  minStrength?: number;
  hasDisadvantage: boolean;
  weight: Weight;
}

export interface Weapon extends WithType<EquipmentType.Weapon> {
  name: string;
  cost: Cost;
  damages: Damage[];
  weight: Weight;
  properties?: EquipmentProperty[];
  weaponType: WeaponType;
  range: RangeType;
  modifiers?: WeaponModifier[];
}

export interface WeaponModifier {
  name: string;
  type: WeaponModifierType;
}
