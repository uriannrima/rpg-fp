import * as ReaderEither from "fp-ts/lib/ReaderEither";
import * as Either from "fp-ts/lib/Either";
import * as Ramda from "ramda";

import { getName } from "../../interfaces/WithName";
import { DefinitionNotFound } from "../../utils/definitions";
import {
  WithAbilityScores,
  getAbilityScores,
  getAbilityScore,
} from "../../abilityScore";

import { Configuration } from "../Configuration";

import { SkillName } from "./types";
import { WithSkills, Skill, SkillDefinition } from "./interfaces";
import { SkillNotFound } from "./errors";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";
import { getKeyAbilityScore } from "../../interfaces/WithKeyAbilityScore";
import { getValue } from "../../interfaces/WithValue";
import { getModifier } from "../../utils/number";

export const getSkills = ({ skills }: WithSkills): Skill[] => skills;

export const getSkillDefinition = (
  skillName: SkillName
): ReaderEither.ReaderEither<Configuration, Error, SkillDefinition> => (
  configuration: Configuration
): Either.Either<Error, SkillDefinition> => {
  return Either.fromNullable(new DefinitionNotFound(skillName))(
    Ramda.find<SkillDefinition>(Ramda.pipe(getName, Ramda.equals(skillName)))(
      configuration.definitions.skills
    )
  );
};

export const findSkill = (skillName: SkillName) => ({
  skills,
}: WithSkills): Either.Either<Error, Skill> =>
  Either.fromNullable(new SkillNotFound(skillName))(
    skills.find(Ramda.compose(Ramda.equals(skillName), getName))
  );

export const getSkillDC = (skillName: SkillName) => (
  c: WithAbilityScores
): ReaderEither.ReaderEither<Configuration, Error, number> =>
  pipe(
    getSkillDefinition(skillName),
    ReaderEither.map(
      flow(
        getKeyAbilityScore,
        (abilityScoreName) =>
          Ramda.pipe(getAbilityScores, getAbilityScore(abilityScoreName)),
        Ramda.applyTo(c),
        getValue,
        getModifier,
        Ramda.add(10)
      )
    )
  );
