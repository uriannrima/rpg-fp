import * as Ramda from "ramda";
import * as E from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";

/**  https://mostly-adequate.gitbooks.io/mostly-adequate-guide/ch08.html# */
interface User {
  id: number;
  name: string;
  active: boolean;
}

// validateName :: User -> Either String ()
const validateName = Ramda.compose(
  (name) => (name.length > 3 ? E.right(null) : E.left("Name is too short.")),
  (u: User) => u.name
);

// showWelcome :: User -> String
const showWelcome = Ramda.compose(
  Ramda.concat("Welcome "),
  (u: User) => u.name
);

const save = (user): IO.IO<User> => (): User => ({ ...user, saved: true });

const validateUser = (validate: (user: User) => E.Either<string, null>) => (
  user: User
): E.Either<string, User> => E.map((_) => user)(validate(user));

// register :: User -> IO String
const register = Ramda.compose(
  E.fold(
    // String -> IO String
    IO.of,
    // User
    Ramda.compose(
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
