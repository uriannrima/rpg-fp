// Write a function that adds two possibly null numbers together using `Maybe` and `ap`.

import * as O from "fp-ts/lib/Option";
import { add } from "ramda";
import { IO, io } from "fp-ts/lib/IO";

// safeAdd :: Maybe number -> Maybe number -> Maybe number
const safeAdd = (ma: O.Option<number>) => (
  mb: O.Option<number>
): O.Option<number> => {
  // const maybeAdd = O.option.of(add);
  // const ap: <A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B>
  // const maybeAddB = O.ap(mb)(maybeAdd);
  //
  // return O.ap(ma)(maybeAddB);
  // return O.ap(ma)(O.ap(mb)(O.option.of(add)));
  //
  // Apply1<"Option">.ap: <A, B>(fab: O.Option<(a: A) => B>, fa: O.Option<A>) => O.Option<B>
  // const maybeAddB = O.option.ap(maybeAdd, mb);
  //
  // return O.option.ap(O.option.ap(O.option.of(add), mb), ma);
  // return O.option.ap(maybeAddB, ma);

  return O.option.ap(O.option.ap(O.option.of(add), mb), ma);
};

interface Player {
  id: number;
  name: string;
}

const localStorage: { [key: string]: Player } = {
  player1: { id: 1, name: "Albert" },
  player2: { id: 2, name: "Theresa" },
};

// getFromCache :: String -> IO User
const getFromCache: (x: string) => IO<Player> = (
  x: string
): IO<Player> => (): Player => localStorage[x];

// game :: User -> User -> String
const game: (p1: Player) => (p2: Player) => string = (p1: Player) => (
  p2: Player
): string => `${p1.name} vs ${p2.name}`;

// startGame :: IO String
const startGame: IO<string> = io.ap(
  io.ap(io.of(game), getFromCache("player1")),
  getFromCache("player2")
);

console.log(startGame());
