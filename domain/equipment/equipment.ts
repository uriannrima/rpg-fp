import { equals, pipe, always, add } from "ramda";
import { some, none, Option, fold } from "fp-ts/lib/Option";

import { getType } from "../proficiency";
import { MergeFn, merge } from "../property";
import { CostUnit } from "../enums/CostUnit";
import { MassUnit } from "../enums/MassUnit";
import { DamageType } from "../enums/DamageType";
import { EquipmentType } from "../enums/EquipmentType";
import { Armor } from "./armor";
import { Weapon } from "./weapon";
import { Shield } from "./shield";
import { getBaseArmorClass } from "../armorClass";
import { getMaxModifier } from "../utils/number";

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

  return equipment ? some(equipment) : none;
};

export const getArmor = (es: Equipment[]): Option<Armor> => {
  const armor = es.find((e): e is Armor => {
    const type = getType(e);
    return equals(EquipmentType.Armor)(type);
  });

  return armor ? some(armor) : none;
};

export const getShield = findEquipment<Shield>(
  pipe(getType, equals(EquipmentType.Shield))
);

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
      dice: { faces: 4, multiplier: 1 },
    },
    weight: {
      unit: MassUnit.Pounds,
      value: 2,
    },
    properties: [{ name: "Light" }],
    type: EquipmentType.Weapon,
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
