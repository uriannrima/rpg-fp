import { WithName } from "./interfaces/WithName";

export enum ProficiencyType {
  Armor = "armor",
  Weapon = "weapon",
  Tool = "tool",
  SavingThrow = "savingThrow",
  Skill = "skill",
}

export enum ArmorProficiencyType {
  Light = "Light armor",
  Medium = "Medium armor",
  Heavy = "Heavy armor",
  Shields = "Shields",
}

export enum WeaponProficiencyType {
  Simple = "Simple weapons",
  Martial = "Martial weapons",
}

export interface WithType<TType> {
  type: TType;
}

export const getType = <TType>({ type }: WithType<TType>): TType => type;

export const isType = <TType>(toCompare: TType) => ({
  type,
}: WithType<TType>): boolean => type === toCompare;

export interface Proficiency extends WithName, WithType<ProficiencyType> {}

export const createProficiency = (type: ProficiencyType) => (
  name: string
): Proficiency => ({
  name,
  type,
});

export const createSkillProficiency = createProficiency(ProficiencyType.Skill);
export const createSavingThrowProficiency = createProficiency(
  ProficiencyType.SavingThrow
);
export const createWeaponProficiency = createProficiency(
  ProficiencyType.Weapon
);
export const createArmorProficiency = createProficiency(ProficiencyType.Armor);
