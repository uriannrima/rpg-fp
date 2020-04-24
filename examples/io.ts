import * as IO from "fp-ts/lib/IO";

/**
 * Anything that does a SYNCHRONOUS computation that have a SIDE EFFECT is considered an IO.
 * 
 * By side-effect, or IO, you may consider anything that interacts with the enviroment.
 * Read a file, ouput to screen, fetch an api, read from database...
 * All of those are IO (some Task, but ignore that).
 * But most important... an SUCCESSFUL effect, it won't have a failure.
 * To have a failure, we must use Either<Error, A>, and for an Effect that may fail
 * we use IOEither
 * 
 * IO<A> => Computation that has side effect
 * Either<E,A> => Computation that may fail, but pure
 * IOEither<E,A> => Computation that has side effect and may fail
 */


/**
 * Log is a an effectful computation, because will output something.
 */

// log :: * -> Void
const log = (...args: any[]): void => console.log(...args);

//                 \/ here is the "magic"
// safeLog :: * -> () -> IO Void
const safeLog = (...args: any[]): IO.IO<void> => (): void => console.log(...args);

// We called it, but nothing goes into the output, because we are creating a IO... 
// The resulted IO that must be run to get the output 
const execute = safeLog('Hello');

// After calling this one, that we have an ouput...
execute();

// But, how do we do something, if we will run it only in the future?
// The answer, we MAP/CHAIN over it.

// Random will give us a number when we execute it.
// random :: () -> IO number
const random: IO.IO<number> = () => Math.random();

// numberToBoolean :: number -> boolean
const numberToBoolean = (n: number): boolean => n < 0.5;

// By mapping over random (that give us an number when executed), 
// We can operate on that number when we receive it
// This way, randomBoolean is still an IO, now a IO<Boolean>
// And when we invoke it, it will generate the random number,
// Pass it through numberToBoolean and give us a boolean.
const randomBoolean = IO.io.map(random, numberToBoolean);

// Lets use a non safe here...
log(randomBoolean()); // True or False

// We could keep "stacking" our effects
// randomBooleanWithLog :: () -> () -> IO IO boolean
const randomBooleanWithLog = IO.io.map(randomBoolean, safeLog);

// But with map, we have not two layers of IO to invoke
randomBooleanWithLog()(); // True or False... see the 2 () ();

// To avoid it, we chain it (which works like a map and a join, removing one layer of IO)
// randomBooleanWithLog2 :: () -> IO boolean
const randomBooleanWithLog2 = IO.io.chain(randomBoolean, safeLog);

// Other way is to flatten the IO IO boolean to IO boolean
const randomBooleanWithLog3 = IO.flatten(randomBooleanWithLog);

randomBooleanWithLog2(); // True or False
randomBooleanWithLog3(); // True or False