import { Equipment } from "./types";
import { WithEquipments } from "./interfaces";

export const setEquipments = (equipments: Equipment[]) => (
  c: WithEquipments
): WithEquipments => Object.assign({}, c, { equipments });
