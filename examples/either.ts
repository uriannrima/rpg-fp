import { add, toString, concat, pipe, compose, append } from "ramda";
import { Either, left, right, map, either, fold } from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";

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

/**  https://mostly-adequate.gitbooks.io/mostly-adequate-guide/ch08.html# */
interface User {
  id: number;
  name: string;
  active: boolean;
}

// validateName :: User -> Either String ()
const validateName = compose(
  (name) => (name.length > 3 ? right(null) : left("Name is too short.")),
  (u: User) => u.name
);

// showWelcome :: User -> String
const showWelcome = compose(concat("Welcome "), (u: User) => u.name);

const save = (user): IO.IO<User> => (): User => ({ ...user, saved: true });

const validateUser = (validate: (user: User) => Either<string, null>) => (
  user: User
): Either<string, User> => map((_) => user)(validate(user));

// register :: User -> IO String
const register = compose(
  fold(
    // String -> IO String
    IO.of,
    // User
    compose(
      // User -> String BECOMES IO User -> IO String
      IO.map(showWelcome),
      // User -> IO User
      save
    )
  ),
  // Either String User
  validateUser(validateName)
);

const albert: User = {
  id: 2,
  name: "Albert",
  active: true,
};

const doAction = register(albert);
console.log(doAction());
