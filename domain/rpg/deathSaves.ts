import { Creator } from "../fp/base";
import { compose } from "../fp/pureFunctions";
import { withProperty } from "./property";

export interface DeathSaves {
  successes: number;
  failures: number;
}

export const createDeathSaves: Creator<DeathSaves> = compose(
  withProperty("successes", 0),
  withProperty("failures", 0)
);

export interface WithDeathSaves {
  deathSaves: DeathSaves;
}

export const withDeathSaves = withProperty("deathSaves", createDeathSaves());
