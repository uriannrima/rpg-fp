import { withProperty } from "./property";

export interface WithInitiative {
  initiative: number;
}

export const withInitiative = withProperty("initiative", 0);
