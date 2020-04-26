import * as Reader from "fp-ts/lib/Reader";
import { flow } from "fp-ts/lib/function";

import { MergeFn, merge } from "../../property";

import { Configuration } from "../Configuration";

import { Skill, WithSkills } from "./interfaces";
import { getDefaultSkills } from "./morphisms";

export const withSkills = (skills: Skill[]): MergeFn<WithSkills> =>
  merge<WithSkills>({ skills });

export const withDefaultSkills = (
  initialValue = 0
): Reader.Reader<Configuration, MergeFn<WithSkills>> =>
  flow(getDefaultSkills(initialValue), withSkills);
