import { withProperty } from "../fp/property";

export interface WithInitiative {
  initiative: number;
}

export const withInitiative = withProperty("initiative")(0);
