import { CostUnit } from "../enums/CostUnit";

export interface Cost {
  value: number;
  unit: CostUnit;
}

export interface WithCost {
  cost: Cost;
}
