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
import { getKeyAbilityScore } from "../../interfaces/WithKeyAbilityScore";
import { getValue } from "../../interfaces/WithValue";
import { getModifier } from "../../utils/number";
import {
  WithProficiencyBonus,
  getProficiencyBonus,
} from "../../interfaces/WithProficiencyBonus";
import { getHasProficiency } from "../../interfaces/WithHasProficiency";

type SkillCharacter = WithAbilityScores & WithSkills & WithProficiencyBonus;

export const getSkills = ({ skills }: WithSkills): Skill[] => skills;

export const findSkillDefinition = (
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

export const getSkillModifier = (skillName: SkillName) => (
  character: SkillCharacter
): Either.Either<Error, number> =>
  pipe(
    findSkill(skillName),
    Ramda.applyTo(character),
    Either.map((skill) =>
      pipe(
        getKeyAbilityScore(skill),
        (abilityScoreName) =>
          Ramda.pipe(getAbilityScores, getAbilityScore(abilityScoreName)),
        Ramda.applyTo(character),
        getValue,
        getModifier,
        Ramda.ifElse(
          Ramda.always(getHasProficiency(skill)),
          Ramda.add(getProficiencyBonus(character)),
          Ramda.identity
        )
      )
    )
  );

export const getSkillDC = (skillName: SkillName) => (
  character: SkillCharacter
): Either.Either<Error, number> =>
  pipe(
    getSkillModifier(skillName),
    Ramda.applyTo(character),
    Either.map(Ramda.add(10))
  );
