import { withProperty } from "./property";

export interface WithArmorClass {
  armorClass: number;
}

export const withArmorClass = withProperty("armorClass", 0);
