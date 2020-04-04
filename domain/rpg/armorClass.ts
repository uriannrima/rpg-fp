import { withProperty } from "../fp/property";

export interface WithArmorClass {
  armorClass: number;
}

export const withArmorClass = withProperty<WithArmorClass>("armorClass")(0);
