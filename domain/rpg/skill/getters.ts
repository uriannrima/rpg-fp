import * as Ramda from "ramda";

import * as ReaderEither from "fp-ts/lib/ReaderEither";
import * as Either from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import * as AbilityScore from "../../abilityScore";
import * as WithProficiencyBonus from "../../interfaces/WithProficiencyBonus";
import { getName } from "../../interfaces/WithName";
import { DefinitionNotFound } from "../../utils/definitions";
import { Configuration } from "../Configuration";
import { getKeyAbilityScore } from "../../interfaces/WithKeyAbilityScore";
import { getValue } from "../../interfaces/WithValue";
import { getModifier } from "../../utils/number";
import { getHasProficiency } from "../../interfaces/WithHasProficiency";

import * as Interfaces from "./interfaces";
import { SkillName } from "./types";
import { SkillNotFound } from "./errors";

type SkillCharacter = AbilityScore.WithAbilityScores &
  Interfaces.WithSkills &
  WithProficiencyBonus.WithProficiencyBonus;

export const getSkills = ({
  skills,
}: Interfaces.WithSkills): Interfaces.Skill[] => skills;

export const findSkillDefinition = (
  skillName: SkillName
): ReaderEither.ReaderEither<
  Configuration,
  Error,
  Interfaces.SkillDefinition
> => (
  configuration: Configuration
): Either.Either<Error, Interfaces.SkillDefinition> => {
  return Either.fromNullable(new DefinitionNotFound(skillName))(
    Ramda.find<Interfaces.SkillDefinition>(
      Ramda.pipe(getName, Ramda.equals(skillName))
    )(configuration.definitions.skills)
  );
};

export const findSkill = (skillName: SkillName) => ({
  skills,
}: Interfaces.WithSkills): Either.Either<Error, Interfaces.Skill> =>
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
          Ramda.pipe(
            AbilityScore.getAbilityScores,
            AbilityScore.getAbilityScore(abilityScoreName)
          ),
        Ramda.applyTo(character),
        getValue,
        getModifier,
        Ramda.ifElse(
          Ramda.always(getHasProficiency(skill)),
          Ramda.add(WithProficiencyBonus.getProficiencyBonus(character)),
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
