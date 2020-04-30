/**
 * Sequence, is a way of changing the container type, but not the content type:
 * Maybe<Task<A>> -> Task<Maybe<A>>
 */

import * as O from "fp-ts/lib/Option";
import * as IO from "fp-ts/lib/IO";
import { task, Task } from "fp-ts/lib/Task";
import { flow } from "fp-ts/lib/function";

// maybeOfTask :: Maybe Task String
const maybeOfTask = O.option.of(task.of("Word"));

// Left (option) sequences on the Right (task)
// taskOfMaybe :: Task Maybe String
const taskOfMaybe = O.option.sequence(task)(maybeOfTask);

// We've changed the container, but no the value...

/**
 * Traverse is a way to change the container type, and the value type while doing it...
 * OuterType<InnerType<A>> -> (InnerType<A> -> InnerType<B>) -> InnerType<OuterType<B>>
 */

// maybeOfTask :: Task String -> Task Number
// We could simplify and make point-free, but to make it more visible...
const taskA2TaskB = (a: Task<string>): Task<number> =>
  task.map(a, (aValue) => aValue.length);

// taskOfMaybeOfNumber :: Task Maybe Number
const taskOfMaybeOfNumber = O.option.traverse(task)(maybeOfTask, taskA2TaskB);

/////////////////////////////////////////////////////////////////////////////

// $ :: String -> IO Element
declare function $(s: string): IO.IO<Element>;

// getAttribute :: String -> Element -> Maybe String
declare function getAttribute(s: string): (e: Element) => O.Option<string>;

const getControlNodeWithComments = flow(
  $, // IO Element
  IO.map(getAttribute("aria-controls")), // IO¹ Maybe² String³
  /**
   * Looking into the value, we have a String*, and I want a Element*
   * $ gives me that... but, by mapping an option, I would have:
   * IO¹ Maybe² (IO Element)³
   * We would have our Element, but another IO.
   *
   * Since I have two IOs (¹ and ³) separated by a Maybe (²),
   * I could SEQUENCE (² and ³) to have an IO¹ IO³ Maybe² Element³
   * So that I could join the IOs and have IO Maybe Element.
   *
   * But as I have $ that gives me an IO Element from a String (String -> IO Element)
   * I could use TREVERSE to change the value (String -> IO Element) giving me:
   * IO¹ Maybe² String³ ~> IO¹ Maybe² (IO Element)³
   * But also swap the Containers:
   * IO¹ IO³ Maybe² Element³
   * So after that I could join them...
   */
  // IO.map(O.map($)), We wont do that...
  IO.map((o) => {
    // Traverse O -> IO, String -> IO Element
    return O.option.traverse(IO.io)(o, $);
  }),
  /**
   * Now that we have an IO IO Maybe Element
   * We flatten them
   */
  IO.flatten
  // Remember, M.map + M.flatten = M.chain
);

const getControlNode = flow(
  $,
  IO.map(getAttribute("aria-controls")),
  IO.chain((o) => O.option.traverse(IO.io)(o, $))
);
