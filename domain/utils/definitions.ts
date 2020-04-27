import { Either, fromNullable } from "fp-ts/lib/Either";

export class DefinitionNotFound extends Error {
  constructor(definitionName: any) {
    super();
    this.message = `Definition not found for "${definitionName}".`;
  }
}

export const createGetDefinition = <TDefinition>(
  definitions: TDefinition[]
) => <A>(
  findFn: (definitionToFind: A) => (definition: TDefinition) => boolean
) => (definitionToFind: A): Either<Error, TDefinition> => {
  const definition = definitions.find(findFn(definitionToFind));

  return fromNullable(new DefinitionNotFound(definitionToFind))(definition);
};
