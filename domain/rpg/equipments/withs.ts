import { merge, MergeFn } from "../../property";

import { Equipment } from "./types";
import { WithEquipments } from "./interfaces";

export const withEquipments = (
  equipments: Equipment[],
): MergeFn<WithEquipments> =>
  merge<WithEquipments>({
    equipments,
  });
