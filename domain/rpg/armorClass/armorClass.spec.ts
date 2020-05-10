import assert from "assert";

import { WithAbilityScores, AbilityScore } from "../abilityScores/interfaces";
import { WithEquipments } from "../equipments/interfaces";
import { getDefaultAbilityScores } from "../abilityScores/getters";
import { Armor } from "../equipments/interfaces/armor";
import { ArmorType } from "../../enums/ArmorType";
import { CostUnit } from "../../enums/CostUnit";
import { EquipmentType } from "../../enums/EquipmentType";
import { MassUnit } from "../../enums/MassUnit";
import { Shield } from "../equipments/interfaces/shield";
import { AbilityScoreType } from "../../enums/AbilityScoreType";

import { BASE_ARMOR_CLASS } from "./constants";
import * as getters from "./getters";
import { abilityScoreLens, abilityScoresLens } from "../abilityScores/lens";
import { valueLens } from "../../interfaces/WithValue";

describe("armorClass", () => {
  describe("getters", () => {
    const character: WithAbilityScores & WithEquipments = {
      abilityScores: getDefaultAbilityScores(10),
      equipments: [],
    };

    const armor: Armor = {
      name: "",
      baseArmor: 12,
      armorType: ArmorType.Light,
      cost: { unit: CostUnit.Cooper, value: 1 },
      hasDisadvantage: false,
      type: EquipmentType.Armor,
      weight: { value: 1, unit: MassUnit.Kilogram },
    };

    const bonusArmor = 2;

    const shield: Shield = {
      name: "",
      bonusArmor,
      cost: { unit: CostUnit.Cooper, value: 1 },
      hasDisadvantage: false,
      type: EquipmentType.Shield,
      weight: { value: 1, unit: MassUnit.Kilogram },
    };

    describe("findArmorClasss", () => {
      it("should return 10 AC when no armor found and no modifier", () => {
        const modifier = 0;

        assert.equal(
          getters.findArmorClass(modifier)(character),
          BASE_ARMOR_CLASS,
        );
      });

      it("should return 12 AC when no armor found and +2 modifier", () => {
        const modifier = 2;

        assert.equal(
          getters.findArmorClass(modifier)(character),
          BASE_ARMOR_CLASS + modifier,
        );
      });

      it("should return 14 AC when armor with base armor 12 and +2 modifier", () => {
        const charWithArmor: WithAbilityScores & WithEquipments = {
          ...character,
          equipments: [armor],
        };

        const modifier = 2;

        assert.equal(
          getters.findArmorClass(modifier)(charWithArmor),
          armor.baseArmor + modifier,
        );
      });
    });

    describe("findShieldBonus", () => {
      it("should return 0 shield bonus when no shield", () => {
        assert.equal(getters.findShieldBonus(character), 0);
      });

      it("should return +2 shield bonus when with shield", () => {
        const charWithShield: WithAbilityScores & WithEquipments = {
          ...character,
          equipments: [shield],
        };

        assert.equal(getters.findShieldBonus(charWithShield), bonusArmor);
      });
    });

    describe("getTotalArmorClass", () => {
      const armorAbilityScore: AbilityScoreType = AbilityScoreType.Dexterity;

      it("should return 10 total armor class when no equipments", () => {
        assert.equal(
          getters.getTotalArmorClass(armorAbilityScore)(character),
          10,
        );
      });

      it("should return 12 total armor when with armor but no modifier", () => {
        const charWithArmor = {
          ...character,
          equipments: [armor],
        };

        assert.equal(
          getters.getTotalArmorClass(armorAbilityScore)(charWithArmor),
          12,
        );
      });

      it("should return 12 total armor when with shield but no modifier", () => {
        const charWithShield = {
          ...character,
          equipments: [shield],
        };

        assert.equal(
          getters.getTotalArmorClass(armorAbilityScore)(charWithShield),
          12,
        );
      });

      it("should return 14 total armor when with all equipments but no modifier", () => {
        const charWithEquips = {
          ...character,
          equipments: [armor, shield],
        };

        assert.equal(
          getters.getTotalArmorClass(armorAbilityScore)(charWithEquips),
          14,
        );
      });

      it("should return 15 total armor when with all equipments and modifier", () => {
        const updatedCharacter = abilityScoresLens
          .compose(abilityScoreLens(armorAbilityScore))
          .compose(valueLens<AbilityScore>())
          .set(12)(character);

        const charWithEquips: WithAbilityScores & WithEquipments = {
          ...updatedCharacter,
          equipments: [armor, shield],
        };

        assert.equal(
          getters.getTotalArmorClass(armorAbilityScore)(charWithEquips),
          15,
        );
      });
    });
  });
});
