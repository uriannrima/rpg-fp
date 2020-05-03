import { pipe, equals, always, add } from "ramda";
import { Option, fold, fromNullable } from "fp-ts/lib/Option";

import { getType, isType } from "../../proficiency";
import { EquipmentType } from "../../enums/EquipmentType";
import { getBaseArmorClass } from "../../armorClass";
import { getMaxModifier } from "../../utils/number";

import { WithEquipments } from "./interfaces";
import { Equipment } from "./types";
import { Armor } from "./armor";
import { Shield } from "./shield";
import { Weapon } from "./weapon";

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
