import { withProperty } from "./property";

export interface WithSpeed {
  speed: string;
}

export const withSpeed = withProperty("speed", "");
