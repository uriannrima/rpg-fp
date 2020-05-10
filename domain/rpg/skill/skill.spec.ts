import * as assert from "assert";

import * as Either from "fp-ts/lib/Either";

import { AbilityScoreType } from "../../enums/AbilityScoreType";
import { withProficiencyBonus } from "../../interfaces/WithProficiencyBonus";
import { Configuration } from "../Configuration";
import { DefinitionNotFound } from "../../utils/definitions";
import { withDefaultAbilityScores } from "../abilityScores/withs";

import { SkillType } from "./types";
import * as Getters from "./getters";
import * as Morphisms from "./morphisms";
import * as Withs from "./withs";
import { SkillNotFound } from "./errors";

const insightDefinition = {
  name: SkillType.Insight,
  keyAbilityScore: AbilityScoreType.Charisma,
};

const configuration: Configuration = {
  definitions: {
    skills: [insightDefinition],
  },
};

describe("skill", () => {
  describe("getters", () => {
    describe("for a character with 16 in all scores, proficient in [Insight, Religion] and with +2 Proficiency Bonus", () => {
      const character = {
        ...withDefaultAbilityScores(16)({}),
        ...Withs.withSkills([
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

      describe("getSkills", () => {
        it("should the list of skills of a character", () => {
          assert.deepStrictEqual(
            Getters.getSkills(character),
            character.skills,
          );
        });
      });

      describe("findSkill", () => {
        it("should get a skill defined in character", () => {
          const skill = Getters.findSkill(SkillType.Perception)(character);
          assert.deepStrictEqual(skill, Either.right(character.skills[0]));
        });

        it("should give skill not found when looking for a skill not defined in character", () => {
          const skill = Getters.findSkill(SkillType.Intimidation)(character);
          assert.deepStrictEqual(
            skill,
            Either.left(new SkillNotFound(SkillType.Intimidation)),
          );
        });
      });

      describe("getSkillModifier", () => {
        it("should get modifier 3 for Perception skill", () => {
          const skillModifier = Getters.tryGetSkillModifier(SkillType.Perception)(
            character,
          );

          assert.deepStrictEqual(skillModifier, Either.right(3));
        });

        it("should get modifier 5 for Insight skill", () => {
          const skillModifier = Getters.tryGetSkillModifier(SkillType.Insight)(
            character,
          );

          assert.deepStrictEqual(skillModifier, Either.right(5));
        });
      });

      describe("getSkillDC", () => {
        it("should get DC 13 for Perception skill", () => {
          const skillDC = Getters.tryGetSkillDC(SkillType.Perception)(character);

          assert.deepStrictEqual(skillDC, Either.right(13));
        });

        it("should get DC 15 for Insight skill", () => {
          const skillDC = Getters.tryGetSkillDC(SkillType.Insight)(character);

          assert.deepStrictEqual(skillDC, Either.right(15));
        });
      });
    });

    describe("findSkillDefinition", () => {
      it("should find a skill definition for insight", () => {
        assert.deepStrictEqual(
          Getters.findSkillDefinition(SkillType.Insight)(configuration),
          Either.right(insightDefinition),
        );
      });

      it("should not find a definition for any other", () => {
        assert.deepStrictEqual(
          Getters.findSkillDefinition(SkillType.Intimidation)(configuration),
          Either.left(new DefinitionNotFound(SkillType.Intimidation)),
        );
      });
    });
  });

  describe("morphisms", () => {
    describe("definitionToSkill", () => {
      it("should get skills for each definition", () => {
        const skills = Morphisms.getDefaultSkills()(configuration);

        assert.equal(skills.length, configuration.definitions.skills.length);
        assert.deepStrictEqual(
          skills[0],
          Morphisms.skillDefinitionToSkill(insightDefinition),
        );
      });
    });
  });

  describe("withs", () => {
    describe("withDefaultSkills", () => {
      it("should get a object with skills with default skills", () => {
        const withDefaultSkills = Withs.withDefaultSkills()(configuration)({});

        assert.equal(
          withDefaultSkills.skills.length,
          configuration.definitions.skills.length,
        );

        assert.deepStrictEqual(
          withDefaultSkills.skills[0],
          Morphisms.skillDefinitionToSkill(insightDefinition),
        );
      });
    });
  });
});
