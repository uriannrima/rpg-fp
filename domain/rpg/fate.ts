import { withProperty } from "./property";

export interface WithFate {
  fate: number;
}

export const withFate = withProperty("fate", 0);
