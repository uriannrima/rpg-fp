import { Lens } from "monocle-ts";

import { WithEquipments } from "./interfaces";

export const equipmentsLens = Lens.fromProp<WithEquipments>()("equipments");
