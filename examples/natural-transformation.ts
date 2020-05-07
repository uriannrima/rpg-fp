
import * as O from "fp-ts/lib/Option"
import * as IO from "fp-ts/lib/IO";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import * as RT from "fp-ts/lib/ReaderTask";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { Monad } from "fp-ts/lib/Monad";

const idToMaybe = <T>(x: T) => O.option.of(x);
const maybe1 = idToMaybe(1);

const idToIO = <T>(x: T) => IO.io.of(x);
const oneIO = idToIO(1);

export const eitherToTask = <E, A>(e: E.Either<E, A>): T.Task<A> => (): Promise<A> => E.fold((e: E) => Promise.reject(e), (a: A) => Promise.resolve(a))(e);
const taskOf2 = eitherToTask(E.either.of(2));

/**
 * Synchronous to asynchronous
 * IO => Sync Effectful Computation
 * T.Task => Async Computation
 * IO -> T.Task => Async Effectful Computation
 * But still pure, because the person that invoke taskOf3 has to execute it, as an IO
 */
const ioToTask = <T>(x: IO.IO<T>): T.Task<T> => (): Promise<T> => Promise.resolve(x());
const taskOf3 = ioToTask(IO.io.of(3));

const maybeToTask = <A>(a: O.Option<A>): T.Task<A> => (): Promise<A> => O.fold(() => Promise.reject(), (a: A) => Promise.resolve(a))(a);
const taskOfName = maybeToTask(O.option.of("Richard"));

const arrayToMaybe = <T>(a: T[]): O.Option<T> => O.fromNullable(a[0]);
const maybeFirst = arrayToMaybe([]);


console.log(
    maybe1,
    oneIO, oneIO(),
    taskOf2, taskOf2().then(console.log),
    taskOf3, taskOf3().then(console.log),
    taskOfName, taskOfName().then(console.log),
    maybeFirst,
);

/**
 * https://mostly-adequate.gitbooks.io/mostly-adequate-guide/ch11.html#a-broader-definition
 */

// getValue :: Selector -> T.Task Error (Maybe String)
declare function getValue(selector: string): T.Task<E.Either<Error, O.Option<string>>>;

type Comment = {
    author: string;
}

type ValidationError = Error;

// postComment :: String -> T.Task Error Comment
declare function postComment(s: string): T.Task<E.Either<Error, Comment>>;

// validate :: String -> E.Either ValidationError String
declare function validate(s: string): E.Either<ValidationError, string>;

/** Hell in function... */
const saveCommentWithHell = () => {
    const fromValidate = T.map((e: E.Either<Error, O.Option<string>>) => {
        return E.map((o: O.Option<string>) => {
            return O.map((comment: string) => {
                return validate(comment);
            })(o);
        })(e);
    })(getValue("#comment"));

    return T.map((e: E.Either<Error, O.Option<E.Either<Error, string>>>) => {
        return E.map((o: O.Option<E.Either<Error, string>>) => {
            return O.map((e: E.Either<Error, string>) => {
                return E.map((comment: string) => {
                    return postComment(comment);
                })(e);
            })(o);
        })(e);
    })(fromValidate);
}

const saveCommentWithComments = () => {
    pipe(
        getValue("#comment"),
        /**
         * Remember, chain is a map inside (map is always inside the value) then a join... so:
         * Task¹<Either²<Option³>> -> Task¹<Task²<Option³>> -> Task¹²<Option³>
         */
        T.chain(eitherToTask),
        /** 
         * Again:
         * Task<Option<string>> -> Task<Task<string>> -> Task<string>
         */
        T.chain(maybeToTask),
        T.map(validate),
        /**
         * Task<Either<Error,string>> -> Task<Task<string>> -> Task<string>
         */
        T.chain(eitherToTask),
        /**
         * Task<Task<Either<Error,Comment>>>
         */
        // T.map(postComment),
        /**
         * Task<Either<Error,Comment>>
         */
        T.chain(postComment),
    );
}

/**
 * On mostly-adequate-guide Task are TaskEither from FP-TS
 * Because of that we need two chains to remove the Either, 
 * because we are using Task and Either as separate monads.
 */
const saveComment = () => {
    pipe(
        getValue("#comment"),
        T.chain(eitherToTask),
        T.chain(maybeToTask),
        T.map(validate),
        T.chain(eitherToTask),
        T.chain(postComment),
    );
}