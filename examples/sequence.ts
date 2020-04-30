import { Task, task } from "fp-ts/lib/Task";
import { array } from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { either } from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";
import { Either } from "fp-ts/lib/Either";
import { TaskEither, taskEither } from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";

// arrayOfTask :: Array Task String
const arrayOfTask: Array<Task<string>> = [task.of("A"), task.of("B")];

// Array.sequence(Task <- applicative)(arrayOfTask) -> Task Array String
const taskOfArray = array.sequence(task)(arrayOfTask);

taskOfArray().then(console.log);

// arrayOfMaybe :: Array Maybe String
// Models an array that each element may have or not a value
const arrayOfMaybe: Array<O.Option<string>> = [
  O.option.of("Luciano"),
  O.option.zero(),
];

// Models an array that or all have value or none.
// "All or nothing"
const maybeOfArray = array.sequence(O.option)(arrayOfMaybe);

// [{ _tag: 'Some', value: 'Luciano' }, { _tag: 'None' }]
arrayOfMaybe.map((v) => console.log(v));
// Won't map, since we have a "None", our maybe also becomes "None"
O.option.map(maybeOfArray, console.log);

// eitherOfIO :: Either IO String
const eitherOfIO = either.of(IO.io.of("buckle my shoe"));

// ioOfEither :: IO Either String
const ioOfEither = either.sequence(IO.io)(eitherOfIO);

either.map(ioOfEither(), console.log);

// arrayOfEither :: Array Either Error String
const arrayOfEither: Array<Either<Error, string>> = [
  either.of("A string"),
  either.throwError(new Error("Example of error")),
];

// eitherOfArray : Either Error Array String
// Again, all or nothing, but with an error
const eitherOfArray = array.sequence(either)(arrayOfEither);

// [{ _tag: 'Right', right: 'A string' }, {  _tag: 'Left',  left: Error: Example of error }]
arrayOfEither.map((v) => console.log(v));
// Won't map, since we have an Left inside our array
either.map(eitherOfArray, console.log);

// Either Error TaskEither Error A
// Could represent a client side validation
// Because we will check, get an error or not, and after that we receive or task
const clientSideCheckBeforeFetch: Either<
  Error,
  TaskEither<Error, string>
> = either.of(taskEither.of("response"));

// { _tag: 'Right', right: 'response' }
either.map(
  clientSideCheckBeforeFetch,
  // If everything is OK, we fetch.
  (task) => task().then(console.log).catch(console.error)
);

// TaskEither Error Either Error A
// Could represent a fetch that may fail,
// And a response that may have failed in the server side
const serverSideFetchWithPossibleError: TaskEither<
  Error,
  Either<Error, string>
> = taskEither.of(either.of("response"));

taskEither.map(
  // Fetch
  serverSideFetchWithPossibleError,
  // If fetch was OK (no problem on network or 404...), we check the inner either from server
  (e) =>
    // Fetch was OK, but the server may have responded with an error
    // So we have another either, and we map
    either.map(e, console.log)
);

// getAttribute :: String -> Element -> Maybe String
declare function getAttribute(s: string): (e: Element) => O.Option<string>;

// $ :: String -> IO Element
declare function $(s: string): IO.IO<Element>;

// getControlNode :: String -> IO Option IO Node
const getControlNodeNested = flow(
  // Get an element
  $,
  // Get aria-controls to find the selector of his control
  IO.map(getAttribute("aria-controls")),
  IO.map(O.map($))
);

// getControlNode :: String ->
// We have: IO Option IO Node ->
// We want: IO Option Node, so:
// IO (Option IO)¹ Node => We have to swap those two
// (IO IO)² Option Node => So we can join those two
// IO Option Node => Like so
const getControlNode = flow(
  $,
  IO.map(getAttribute("aria-controls")),
  IO.map(O.map($)),
  IO.map((a) => {
    // a :: Option IO Node
    // Option.Sequence(IO)(A)
    // Left sequence on Right applicative
    // a :: IO Option Node
    const _a = O.option.sequence(IO.io)(a);
    return _a;
  }),
  // IO IO Option Node -> IO Option Node
  IO.flatten
);

const getControlNode2 = flow(
  $,
  IO.map(getAttribute("aria-controls")),
  IO.map(O.map($)),
  // A map and a join? Is a chain.
  IO.chain(O.option.sequence(IO.io))
);

const getControlNode3 = flow(
  $,
  IO.map(getAttribute("aria-controls")),
  // Option.traverse(Aplicative IO) => (oa: Option<string>, (a: string) => IO<Element>) => IO<Option<Element>>
  // Option<string>
  //  ~> give a function that accepts string and returns an instance of the Applicative (in this case IO)
  //  ~> (string -> IO<Element>)
  //  ~> Option IO Element ~> IO Option Element
  IO.chain((a) => O.option.traverse(IO.io)(a, $))
  // Don't know how to make this one better...
  // IO.chain((a) => {
  //   // Option<A>
  //   return O.option.traverse(IO.io)(a, $);
  // })
);
