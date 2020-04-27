import * as assert from "assert";
import * as Either from "fp-ts/lib/Either";

import { withDefaultAbilityScores } from "../../abilityScore";
import { AbilityScoreType } from "../../enums/AbilityScoreType";

import { SkillType } from "./types";
import { getSkillDC, getSkillModifier } from "./getters";
import { withSkills } from "./withs";
import { withProficiencyBonus } from "../../interfaces/WithProficiencyBonus";
import { SkillNotFound } from "./errors";

describe("skill", () => {
  describe("for a character with 16 in all scores, proficient in [Insight, Religion] and with +2 Proficiency Bonus", () => {
    const character = {
      ...withDefaultAbilityScores(16)({}),
      ...withSkills([
        {
          name: SkillType.Perception,
          keyAbilityScore: AbilityScoreType.Wisdom,
          hasProficiency: false,
        },
        {
          name: SkillType.Insight,
          keyAbilityScore: AbilityScoreType.Wisdom,
          hasProficiency: true,
        },
      ])({}),
      ...withProficiencyBonus(2)({}),
    };

    describe("findSkill", () => {});

    describe("getSkillModifier", () => {
      it("should get modifier 3 for Perception skill", () => {
        const skillModifier = getSkillModifier(SkillType.Perception)(character);

        assert.deepStrictEqual(skillModifier, Either.right(3));
      });

      it("should get modifier 5 for Insight skill", () => {
        const skillModifier = getSkillModifier(SkillType.Insight)(character);

        assert.deepStrictEqual(skillModifier, Either.right(5));
      });
    });

    describe("getSkillDC", () => {
      it("should get DC 13 for Perception skill", () => {
        const skillDC = getSkillDC(SkillType.Perception)(character);

        assert.deepStrictEqual(skillDC, Either.right(13));
      });

      it("should get DC 15 for Insight skill", () => {
        const skillDC = getSkillDC(SkillType.Insight)(character);

        assert.deepStrictEqual(skillDC, Either.right(15));
      });

      it("should give skill not found when getting DC for a skill not defined in character", () => {
        const skillDC = getSkillDC(SkillType.Intimidation)(character);
        assert.deepStrictEqual(
          skillDC,
          Either.left(new SkillNotFound(SkillType.Intimidation))
        );
      });
    });
  });
});
