import * as assert from "assert";

import { withDefaultAbilityScores } from "./abilityScore";
import { getInitiative } from "./initiative";

describe("initiative", () => {
  it("should compute initiative from WithAbilityScores", () => {
    const c = withDefaultAbilityScores(18)({});

    assert.equal(getInitiative(c), 14);
  });
});
