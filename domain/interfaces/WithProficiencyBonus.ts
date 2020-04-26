import { merge, MergeFn } from "../property";

export interface WithProficiencyBonus {
  proficiencyBonus: number;
}

export const withProficiencyBonus = (
  proficiencyBonus = 0
): MergeFn<WithProficiencyBonus> =>
  merge<WithProficiencyBonus>({
    proficiencyBonus,
  });

export const getProficiencyBonus = ({
  proficiencyBonus,
}: WithProficiencyBonus): number => proficiencyBonus;
