import { ArmorType } from "../../enums/ArmorType";
import { CostUnit } from "../../enums/CostUnit";
import { MassUnit } from "../../enums/MassUnit";
import { EquipmentType } from "../../enums/EquipmentType";
import { DamageType } from "../../enums/DamageType";
import { WeaponType } from "../../enums/WeaponType";
import { RangeType } from "../../enums/RangeType";

import { Equipment } from "./types";

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
    damages: [
      {
        type: DamageType.Bludgeoning,
        dice: [{ multiplier: 1, faces: 4 }],
      },
    ],
    weight: {
      unit: MassUnit.Pounds,
      value: 2,
    },
    properties: [
      {
        name: "light",
        description:
          "A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons.",
      },
    ],
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
