import { add, toString, concat, pipe } from "ramda";
import { Either, left, right, map } from "fp-ts/lib/Either";

/** Either Example */

/**
 *
 * @param entity A entity that may have age.
 */
const getAge = (entity: { age?: number }): Either<string, number> =>
  entity.age !== undefined ? right(entity.age) : left("Entity has no age.");

const fortune = pipe(add(1), toString, concat("If you survive, you will be "));

const zoltar = pipe(getAge, map(fortune), map(console.log));

const p = {};

const r = zoltar(p);

console.log({ r });
