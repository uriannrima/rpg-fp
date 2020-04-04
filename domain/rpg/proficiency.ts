import { pipe } from "ramda";
import { Creator } from "../fp/base";
import { asObject } from "../fp/property";

interface WithType {
  type: string;
}

export const withType = asObject<WithType>({ type: "" });

interface WithSubType {
  subType: string;
}

export const withSubType = asObject<WithSubType>({ subType: "" });

interface Proficiency extends WithType, WithSubType {}

export const createProficiency: Creator<Proficiency> = pipe(
  withType,
  withSubType
);

export interface WithProficiencies {
  proficiencies: Proficiency[];
}

export const withProficiencies = pipe(
  asObject<WithProficiencies>({ proficiencies: [] })
);
