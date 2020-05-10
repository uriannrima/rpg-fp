import { EquipmentType } from "../../enums/EquipmentType";
import { isType } from "../../proficiency";

import { Equipment } from "./types";

export const isEquipmentType = <TEquipment extends Equipment>(
  type: EquipmentType,
) => (e: Equipment): e is TEquipment => isType(type)(e);
