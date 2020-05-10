import * as Ramda from "ramda";
import * as Pipeable from "fp-ts/lib/pipeable";
import * as Function from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as I from "fp-ts/lib/Identity";

import { AbilityScoreType } from "../../enums/AbilityScoreType";
import { WithAbilityScores } from "../abilityScores/interfaces";
import { WithEquipments } from "../equipments/interfaces";
import { getAbilityScoreModifier } from "../abilityScores/getters";
import * as Equipments from "../equipments/getters/equipments";
import * as Armor from "../equipments/getters/armor";
import * as Shield from "../equipments/getters/shield";

import { BASE_ARMOR_CLASS } from "./constants";

type Character = WithAbilityScores & WithEquipments;

const getBaseArmorClass = (modifier: number): number =>
  Ramda.add(BASE_ARMOR_CLASS)(modifier);

export const findArmorClass = (modifier: number) => (character: Character) =>
  Pipeable.pipe(
    Equipments.findArmor(character),
    O.fold(
      Ramda.always(getBaseArmorClass(modifier)),
      Function.flow(Armor.getArmorClass(modifier)),
    ),
  );

export const findShieldBonus = (character: Character) =>
  Pipeable.pipe(
    Equipments.findShield(character),
    O.fold(Ramda.always(0), Function.flow(Shield.getBonusArmor)),
  );

const armorClassWithShield = (armorClass: number) => (shieldBonus: number) =>
  Ramda.add(armorClass)(shieldBonus);

const getCompleteArmorClass = (modifier: number) => (character: Character) =>
  Pipeable.pipe(
    I.identity.of(armorClassWithShield),
    I.ap(findArmorClass(modifier)(character)),
    I.ap(findShieldBonus(character)),
  );

// getArmorClass :: keyAbilityScore -> Character -> number
export const getTotalArmorClass = (armorAbilityScore: AbilityScoreType) => (
  character: Character,
) =>
  Pipeable.pipe(
    getAbilityScoreModifier(armorAbilityScore),
    Ramda.applyTo(character),
    getCompleteArmorClass,
    Ramda.applyTo(character),
  );
