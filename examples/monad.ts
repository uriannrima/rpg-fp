/** https://mostly-adequate.gitbooks.io/mostly-adequate-guide/ch09.html# */

import * as IO from "fp-ts/lib/IO";
import { flow } from "fp-ts/lib/function";
import * as Ramda from "ramda";

// getFile :: IO String
const getFile = IO.of('/home/mostly-adequate/ch09.md');

// pureLog :: String -> IO()
const pureLog = (str: string): IO.IO<void> => (): void => console.log(str);

// pureLogMap :: IO String -> IO IO(), we nested, so we would use chain
const pureLogMap = IO.map(pureLog);

// pureLogChain :: IO String -> IO()
const pureLogChain = IO.chain(pureLog);

// getBasename :: String -> String
const getBasename = (filePath: string): string => Ramda.pipe(Ramda.split('/'), Ramda.last)(filePath);

// getBasenameIO :: IO String -> IO String
const getBasenameIO = IO.map(getBasename);

// logFilename :: IO ()
const logFilename = flow(
    getBasenameIO,
    pureLogChain,
)(getFile);
// ↑↑↑↑↑↑ We put getFile here because it is a IO String
// If we put it inside of the flow, getFile will be executed, and will return a string 
// since IO A -> A ~ IO String -> String when executed
// But executing it is a side effect, that we don't want. So we just want to pass to the next function
// getBasenameIO expects a IO String, so it works perfectly. 
// pureLogChain also expectes a IO String, so it also works.