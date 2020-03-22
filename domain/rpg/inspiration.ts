import { withProperty } from "./property";

export interface WithInspiration {
  inspiration: number;
}

export const withInspiration = withProperty("inspiration", 0);
