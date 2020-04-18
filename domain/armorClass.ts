import { add, pipe } from "ramda";

import {
  AbilityScoreType,
  WithAbilityScores,
  getAbilityScoreModifier,
} from "./abilityScore";

import {
  WithEquipments,
  getArmorFromEquipments,
  getShieldFromEquipments,
  getArmorClassFromArmor,
  getBonusArmorFromShield,
} from "./equipment/equipment";

const BASE_ARMOR_CLASS = 10;

export const getBaseArmorClass = (modifier: number): number =>
  add(BASE_ARMOR_CLASS)(modifier);

export const getArmorClass = (armorAbilityScore: AbilityScoreType) => (
  character: WithAbilityScores & WithEquipments
): number => {
  const modifier = getAbilityScoreModifier(armorAbilityScore)(character);

  const baseArmorClass = pipe(
    getArmorFromEquipments,
    getArmorClassFromArmor(modifier)
  )(character);

  const shieldBonusArmor = pipe(
    getShieldFromEquipments,
    getBonusArmorFromShield
  )(character);

  return add(baseArmorClass)(shieldBonusArmor);
};
