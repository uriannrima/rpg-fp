import * as assert from "assert";
import * as Either from "fp-ts/lib/Either";

import { withDefaultAbilityScores } from "../../abilityScore";
import { AbilityScoreType } from "../../enums/AbilityScoreType";
import { provide } from "../../utils/reader";
import { DefinitionNotFound } from "../../utils/definitions";

import { Configuration } from "../Configuration";

import { SkillType } from "./types";
import { getSkillDC } from "./getters";

describe("skill", () => {
  it("should compute a skill difficult class if skill definition available", () => {
    const withScores = withDefaultAbilityScores(14)({});

    const configuration: Configuration = {
      definitions: {
        skills: [
          {
            name: SkillType.Perception,
            keyAbilityScore: AbilityScoreType.Wisdom,
          },
        ],
      },
    };

    const provideConfiguration = provide(configuration);

    const skillDC = provideConfiguration(
      getSkillDC(SkillType.Perception)(withScores)
    );

    assert.deepStrictEqual(skillDC, Either.right(12));
  });

  it("should give an error while trying to compute difficult class of a skill without definition", () => {
    const withScores = withDefaultAbilityScores(14)({});

    const configuration: Configuration = {
      definitions: {
        skills: [],
      },
    };

    const provideConfiguration = provide(configuration);

    const skillDC = getSkillDC(SkillType.Perception)(withScores);

    assert.deepStrictEqual(
      provideConfiguration(skillDC),
      Either.left(new DefinitionNotFound(SkillType.Perception))
    );
  });
});
