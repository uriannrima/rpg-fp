import { equals, pipe, always, add } from "ramda";
import { some, none, Option, fold, fromNullable } from "fp-ts/lib/Option";

import { getType, isType } from "../proficiency";
import { MergeFn, merge } from "../property";
import { CostUnit } from "../enums/CostUnit";
import { MassUnit } from "../enums/MassUnit";
import { DamageType } from "../enums/DamageType";
import { EquipmentType } from "../enums/EquipmentType";
import { Armor } from "./armor";
import { Shield } from "./shield";
import { getBaseArmorClass } from "../armorClass";
import { getMaxModifier } from "../utils/number";
import { ArmorType } from "../enums/ArmorType";
import { createDice } from "../dice";
import { Weapon } from "./weapon";
import { WeaponType } from "../enums/WeaponType";
import { RangeType } from "../enums/RangeType";

export interface EquipmentProperty {
  name: string;
  description?: string;
}

export type Equipment = Armor | Weapon | Shield;

export interface WithEquipments {
  equipments: Equipment[];
}

export const withEquipments = (
  equipments: Equipment[]
): MergeFn<WithEquipments> =>
  merge<WithEquipments>({
    equipments,
  });

export const setEquipments = (equipments: Equipment[]) => (
  c: WithEquipments
): WithEquipments => {
  c.equipments = equipments;
  return c;
};

export const getEquipments = ({ equipments }: WithEquipments): Equipment[] =>
  equipments;

export const findEquipment = <T extends Equipment>(
  fn: (e: Equipment) => boolean
) => (es: Equipment[]): Option<T> => {
  const equipment = es.find((e): e is T => fn(e));

  return fromNullable(equipment);
};

export const getArmor = findEquipment<Armor>(
  pipe(getType, equals(EquipmentType.Armor))
);

export const getShield = findEquipment<Shield>(
  pipe(getType, equals(EquipmentType.Shield))
);

export const isEquipmentType = <TEquipment extends Equipment>(
  type: EquipmentType
) => (e: Equipment): e is TEquipment => isType(type)(e);

export const getWeapons = (es: Equipment[]): Weapon[] =>
  es.filter(isEquipmentType(EquipmentType.Weapon));

export const getArmorFromEquipments = pipe(getEquipments, getArmor);
export const getShieldFromEquipments = pipe(getEquipments, getShield);

export const getArmorClassFromArmor = (
  modifier: number
): ((armor: Option<Armor>) => number) =>
  fold(
    always(getBaseArmorClass(modifier)),
    ({ baseArmor, maxModifier }: Armor) => {
      const allowedModifier = getMaxModifier(maxModifier)(modifier);
      return add(baseArmor)(allowedModifier);
    }
  );

export const getBonusArmorFromShield = fold(
  always(0),
  ({ bonusArmor }: Shield) => bonusArmor
);

export const EXAMPLE_EQUIPMENTS: Equipment[] = [
  {
    name: "Padded armor",
    armorType: ArmorType.Light,
    cost: { unit: CostUnit.Gold, value: 5 },
    baseArmor: 11,
    hasDisadvantage: true,
    weight: {
      unit: MassUnit.Pounds,
      value: 8,
    },
    type: EquipmentType.Armor,
  },
  {
    name: "Club",
    cost: { unit: CostUnit.Silver, value: 1 },
    damage: {
      type: DamageType.Bludgeoning,
      dice: [4],
    },
    weight: {
      unit: MassUnit.Pounds,
      value: 2,
    },
    properties: [{ name: "Light" }],
    type: EquipmentType.Weapon,
    weaponType: WeaponType.Simple,
    range: RangeType.Melee,
  },
  {
    name: "Small shield",
    cost: { unit: CostUnit.Gold, value: 5 },
    bonusArmor: 2,
    hasDisadvantage: true,
    weight: { value: 8, unit: MassUnit.Pounds },
    type: EquipmentType.Shield,
  },
];
