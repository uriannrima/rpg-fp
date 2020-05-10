import { WithName } from "../../../interfaces/WithName";
import { WithCost } from "../../../interfaces/Cost";
import { WithWeight } from "../../../interfaces/Weight";
import { WithType } from "../../../proficiency";
import { EquipmentType } from "../../../enums/EquipmentType";
import { Damage } from "../../../damage";
import { EquipmentProperty } from "../interfaces";
import { WeaponType } from "../../../enums/WeaponType";
import { RangeType } from "../../../enums/RangeType";
import { WeaponModifierType } from "../enums";
import { WithMinScore } from "../../../interfaces/WithMinScore";

export interface WeaponModifier {
  name: string;
  type: WeaponModifierType;
}

export interface Weapon
  extends WithName,
    WithCost,
    WithWeight,
    WithMinScore,
    WithType<EquipmentType.Weapon> {
  damages: Damage[];
  properties?: EquipmentProperty[];
  weaponType: WeaponType;
  range: RangeType;
  modifiers?: WeaponModifier[];
}
