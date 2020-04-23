import { flow } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import { map } from 'fp-ts/lib/Reader'
import * as E from 'fp-ts/lib/Either'

const len = (s: string): number => s.length
const double = (n: number): number => n * 2
const gt2 = (n: number): boolean => n > 2

// (s: String) -> Boolean;
const composition = flow(len, double, gt2)

// equivalent to

// Reader<String, Boolean> => String -> Boolean
const reader = pipe(len, map(double), map(gt2))

type User = {
    name: string;
    age: number;
}

const getUser = (userName: string): E.Either<Error, User> =>
    userName === null ?
        E.left(new Error('User not found.')) :
        E.right<Error, User>({
            name: userName,
            age: 1
        });

const getUserAge = (userName: string) => E.map((user: User) => user.age)(getUser(userName));

const getUserAgeFlow = flow(
    getUser,
    E.map(u => u.age)
)

const getUserAgePipe = (userName: string) => pipe(
    getUser(userName),
    E.map(u => u.age),
);