import { withProperty } from "../fp/property";

export interface WithSpeed {
  speed: string;
}

export const withSpeed = withProperty("speed")("");
