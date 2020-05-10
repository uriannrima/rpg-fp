import * as Ramda from "ramda";
import { fromNullable, Option } from "fp-ts/lib/Option";

import { Equipment } from "../types";
import { isEquipmentType } from "../morphism";
import { EquipmentType } from "../../../enums/EquipmentType";
import { equipmentsLens } from "../lens";
import { Weapon } from "../interfaces/weapon";
import { Armor } from "../interfaces/armor";
import { getType } from "../../../proficiency";
import { Shield } from "../interfaces/shield";

export const getWeapons = (es: Equipment[]): Weapon[] =>
  es.filter(isEquipmentType(EquipmentType.Weapon));

export const findEquipmentByPredicate = <T extends Equipment>(
  fn: (predicate: Equipment) => boolean,
) => (es: Equipment[]): Option<T> => {
  const equipment = es.find((e): e is T => fn(e));

  return fromNullable(equipment);
};

const _findArmor = findEquipmentByPredicate<Armor>(
  Ramda.pipe(getType, Ramda.equals(EquipmentType.Armor)),
);

const _findShield = findEquipmentByPredicate<Shield>(
  Ramda.pipe(getType, Ramda.equals(EquipmentType.Shield)),
);

export const findArmor = Ramda.pipe(equipmentsLens.get, _findArmor);
export const findShield = Ramda.pipe(equipmentsLens.get, _findShield);
