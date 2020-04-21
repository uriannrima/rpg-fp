import * as assert from "assert";

import { getSkillDC, SkillType } from "./skill";
import { withDefaultAbilityScores } from "./abilityScore";
import { right, left } from "fp-ts/lib/Either";

describe("skill", () => {
  it("should compute a skill difficult class", () => {
    const c = withDefaultAbilityScores(14)({});
    assert.deepStrictEqual(getSkillDC(SkillType.Perception)(c), right(12));
  });

  it("should give an error while trying to compute difficult class of a skill that doesn't exists", () => {
    const c = withDefaultAbilityScores(14)({});

    assert.deepStrictEqual(
      getSkillDC("No Skill")(c),
      left(new Error('Definition not found for "No Skill".'))
    );
  });
});
