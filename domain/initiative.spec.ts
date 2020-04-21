import { expect } from "chai";

import { withDefaultAbilityScores } from "./abilityScore";
import { getInitiative } from "./initiative";

describe("initiative", () => {
  it("should compute initiative from WithAbilityScores", () => {
    const c = withDefaultAbilityScores(18)({});

    expect(getInitiative(c)).to.equal(14);
  });
});
