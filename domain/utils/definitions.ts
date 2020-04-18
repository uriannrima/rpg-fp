import { pipe } from "ramda";
import { right, left, Either } from "fp-ts/lib/Either";

type Map<A, B, C> = (a: A) => (b: B) => C;

export const createGetDefinition = <TDefinition>(
  definitions: TDefinition[]
) => <A>(
  findFn: (definitionToFind: A) => (definition: TDefinition) => boolean
) => (definitionToFind: A): Either<Error, TDefinition> => {
  const definition = definitions.find(findFn(definitionToFind));

  return definition
    ? right(definition)
    : left(new Error(`Definition not found for "${definitionToFind}".`));
};
