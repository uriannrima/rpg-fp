import * as assert from "assert";

import { getInitiative } from "./initiative";
import { withDefaultAbilityScores } from "./rpg/abilityScores/withs";

describe("initiative", () => {
  it("should compute initiative from WithAbilityScores", () => {
    const c = withDefaultAbilityScores(18)({});

    assert.equal(getInitiative(c), 14);
  });
});
