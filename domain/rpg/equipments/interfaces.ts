import { Equipment } from "./types";

export interface EquipmentProperty {
  name: string;
  description?: string;
}

export interface WithEquipments {
  equipments: Equipment[];
}

