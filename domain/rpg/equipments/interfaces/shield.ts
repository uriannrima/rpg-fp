import { WithName } from "../../../interfaces/WithName";
import { WithCost } from "../../../interfaces/Cost";
import { WithType } from "../../../proficiency";
import { EquipmentType } from "../../../enums/EquipmentType";
import { WithWeight } from "../../../interfaces/Weight";
import { WithHasDisadvantage } from "../../../interfaces/WithHasDisadvantage";
import { WithMinScore } from "../../../interfaces/WithMinScore";

type BonusArmor = number;

interface WithBonusArmor {
  bonusArmor: BonusArmor;
}

export interface Shield
  extends WithName,
    WithCost,
    WithHasDisadvantage,
    WithWeight,
    WithMinScore,
    WithBonusArmor,
    WithType<EquipmentType.Shield> {}
