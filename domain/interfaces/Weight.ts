import { MassUnit } from "../enums/MassUnit";

export interface Weight {
  value: number;
  unit: MassUnit;
}

export interface WithWeight {
  weight: Weight;
}
