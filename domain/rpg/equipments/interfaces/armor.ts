import { WithType } from "../../../proficiency";
import { EquipmentType } from "../../../enums/EquipmentType";
import { WithCost } from "../../../interfaces/Cost";
import { WithWeight } from "../../../interfaces/Weight";
import { ArmorType } from "../../../enums/ArmorType";
import { WithName } from "../../../interfaces/WithName";
import { Modifier } from "../../../types/Modifier";
import { WithHasDisadvantage } from "../../../interfaces/WithHasDisadvantage";
import { WithMinScore } from "../../../interfaces/WithMinScore";

type BaseArmor = number;

interface WithBaseArmor {
  baseArmor: BaseArmor;
}

export interface Armor
  extends WithName,
    WithCost,
    WithBaseArmor,
    WithHasDisadvantage,
    WithWeight,
    WithMinScore,
    WithType<EquipmentType.Armor> {
  maxModifier?: Modifier;
  armorType: ArmorType;
}
