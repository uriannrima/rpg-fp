import { withProperty } from "../fp/property";

export interface WithProficiencyBonus {
  proficiencyBonus: number;
}

export const withProficiencyBonus = withProperty("proficiencyBonus")(0);
