import * as R from "fp-ts/lib/Reader";
import * as RE from "fp-ts/lib/ReaderEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as Ramda from "ramda";
import { flow } from "fp-ts/lib/function";

const f = (b: boolean): string => (b ? "true" : "false");
const g = (n: number): string => f(n > 2);
const h = (s: string): string => g(s.length + 1);

console.log(h("foo"));

/** Required Dependencies */

/** i18n*/
interface Dependencies {
    i18n: {
        true: string;
        false: string;
    };

    lowerBound: number;
}

const instance: Dependencies = {
    i18n: {
        false: "falso",
        true: "verdadeiro",
    },
    lowerBound: 4,
};

/** We must change signature (add deps to all chain) and change the code! */
const f2 = (b: boolean, deps: Dependencies): string =>
    b ? deps.i18n.true : deps.i18n.false;
const g2 = (n: number, deps: Dependencies): string => f2(n > 2, deps);
const h2 = (s: string, deps: Dependencies): string => g2(s.length + 1, deps);
console.log(h2("foo", instance));

/** Dependency as return type... */

/**
 * Even though we have changed the SIGNATURE of the return value of "F" (and because of it, propagated to G and H),
 * We didn't have to make any change to G and H, no need to change nothing on the code.
 * We may explicity tell the return, but we aren't obliged to (see g3 and h3).
 */
const f3 = (b: boolean) => (deps: Dependencies): string =>
    b ? deps.i18n.true : deps.i18n.false;
const g3 = (n: number): (deps: Dependencies) => string => f3(n > 2);
const h3 = (s: string): ((deps: Dependencies) => string) => g3(s.length + 1);

/** Now, almost everything is the same, but we need to pass the dependencies */
h3("foo")(instance);

/** Reader<D, A> => (dependency: D) => A */

/**
 * F3 is of type (dep: A) => B
 * Any "(a: A) => B" where A is a dependency, we can use Reader<A, B>
 * Since F uses Dependencies, to return a string, we say that
 * F4 = Boolean -> Reader<Dependencies, String>
 * Reader<Dependencies,String> => (a: Dependencies) => string;
 */

const f4 = (b: boolean): R.Reader<Dependencies, string> => (deps): string =>
    b ? deps.i18n.true : deps.i18n.false;
const g4 = (n: number): R.Reader<Dependencies, string> => f4(n > 2);
const h4 = (s: string): R.Reader<Dependencies, string> => g4(s.length + 1);

h4("foo")(instance);

/**
 * We now, can inject in between the line...
 */

/**
 * R.map -> Consume, and thats it, the return becomes the product to the other
 * R.chain -> Consume the Reader of A, and the return B becomes Reader<A, B>
 */
const g5 = (n: number): R.Reader<Dependencies, string> =>
    pipe(
        /** Ask for Deps for the next function which will use it */
        R.ask<Dependencies>(),
        /** Chain the function to use the dependecy asked */
        R.chain((deps) => f4(n > deps.lowerBound)),
        a => a,
    );

const h5 = (s: string): R.Reader<Dependencies, string> => g5(s.length + 1);

h5("foo")({ ...instance, lowerBound: 10 }); // False

/**
 * It follows a "interface" style...
 * We have an E.Either<A, B>, and now we have a Reader<C, Either<A,B>>
 * We just need to change from E.map/chain, to RE.map/chain
 */

function f6(s: string | null): E.Either<Error, number> {
    return E.fromNullable(new Error("F6 string is null."))(s?.length);
}
function g6(n: number): boolean {
    return n > 2;
}
function h6(b: boolean): E.Either<Error, Date> {
    return b ? E.right(new Date()) : E.left(new Error());
}

interface DependenciesTwo {
    foo: string;
};

const dep2instance: DependenciesTwo = {
    foo: 'bar'
};

/** 
 * Reader<C,Either<A,B>>
 * Reader<DependenciesTwo, Either<Error, number>> => ReaderEither<DependenciesTwo,Error,number>
 */
function f7(s: string): RE.ReaderEither<DependenciesTwo, Error, number> {
    return (deps): E.Either<Error, number> => {
        return deps.foo === 'bar' ? E.right((s + deps.foo).length) : E.left(new Error('Foo must be bar.'));
    };
}

const result = pipe(E.right('foo'), E.chain(f6), E.map(g6), E.chain(h6))
const result2 = pipe(
    RE.right('foo'),
    RE.chain(a => f7(a)),
    RE.map(b => g6(b)),
    RE.chain(b => {
        // Since H6 returns an Either<Error, Date> and we need a <Reader,Either<Error,Date>>
        // We use "fromEither" to transform it.
        return RE.fromEither(h6(b));
    })
)(dep2instance);

console.log({ result, result2 })


/**
 * Inside our domain now...
 */

enum AbilityScoreType {
    Intelligence = "Intelligence",
    Charisma = "Charisma",
}

type AbilityScoreName = string | AbilityScoreType;

type AbilityScore = {
    name: AbilityScoreName;
    value: number;
};

type AbilityScores = Array<AbilityScore>;

enum SkillType {
    Appraise = "Appraise",
    Bluff = "Bluff",
}

type SkillName = string | SkillType;

type Skill = {
    name: SkillName;
    keyScore: AbilityScoreName;
};

type Skills = Skill[];

const abilityScores: AbilityScores = [
    { name: AbilityScoreType.Intelligence, value: 12 },
];

const getAbilityScore = (
    scoreName: AbilityScoreName
): E.Either<Error, AbilityScore> => {
    const score = Ramda.find<AbilityScore>((score) => score.name == scoreName)(
        abilityScores
    );
    return E.fromNullable(new Error(`Score "${scoreName}" not found.`))(score);
};

const getAbilityScoreWithReader = (
    scoreName: AbilityScoreName
): R.Reader<Enviroment, E.Either<Error, AbilityScore>> => (
    environment: Enviroment
): E.Either<Error, AbilityScore> => {
        const score = Ramda.find<AbilityScore>((score) => score.name == scoreName)(
            environment.abilityScores
        );
        return E.fromNullable(new Error(`Score "${scoreName}" not found.`))(score);
    };

const skills: Skills = [
    { name: SkillType.Appraise, keyScore: AbilityScoreType.Intelligence },
    { name: SkillType.Bluff, keyScore: AbilityScoreType.Charisma },
];

const getKeyScore = ({ keyScore }: { keyScore: AbilityScoreName }): string => keyScore;

const getSkill = (skillName: SkillName): E.Either<Error, Skill> => {
    const skill = Ramda.find<Skill>((skill) => skill.name === skillName)(skills);
    return E.fromNullable(new Error(`Skill "${skillName}" not found.`))(skill);
};

interface Enviroment {
    skills: Skills;
    abilityScores: AbilityScores;
}

/**
 * Now we have an enviroment variable injected in our getSkill
 * Which is used to get the skills without dealing with the "global" definition...
 */
const getSkillWithReader = (
    skillName: SkillName
): R.Reader<Enviroment, E.Either<Error, Skill>> => (
    enviroment
): E.Either<Error, Skill> => {
        const skill = Ramda.find<Skill>((skill) => skill.name === skillName)(
            enviroment.skills
        );
        return E.fromNullable(new Error(`Skill "${skillName}" not found.`))(skill);
    };

const getSkillAbilityScore = flow(
    getSkill,
    E.map(getKeyScore),
    // If we map again, we'll have an Either<Error, Either<Error, AbilityScore>>
    // To avoid it, we use chain, or flatMap, since both has the same left as Error
    // And we end up with a Either<Error,AbilityScore>
    E.chain(getAbilityScore)
);

/**
 * Now we may inject the Enviroment at the end
 * We need to map using Reader
 * And keep maping Either
 * So we use ReaderEither map/chain
 */
const getSkillAbilityScoreWithScoreReader = flow(
    /** 
     * String -> Either Error Skill
     * (s:String) => Either<Error, Skill>
     */
    getSkill,
    /** 
     * Makes the previous one an:
     * Either Error Skill => Reader A Either Error Skill or
     * Either<Error,Skill> => Reader<unknown, Either<Error, Skill> or
     * Either<Error,Skill> => ReaderEither<unknown, Error, Skill> 
     * Wich is valid to be mapped using RE.map/RE.chain
     */
    RE.fromEither,
    /**
     * Now we map it normally, using ReadEither intead of simple Either.
     */
    RE.map(getKeyScore),
    // If we map again, we'll have an Either<Error, Either<Error, AbilityScore>>
    // To avoid it, we use chain, or flatMap, since both has the same left as Error
    // And we end up with a Either<Error,AbilityScore>
    // In this case, ReaderEither<Environment, Error, AbilityScore>
    RE.chain(getAbilityScoreWithReader),
);

const getSkillAbilityScoreWithScoreAndSkillReader = flow(
    getSkillWithReader,
    RE.map(getKeyScore),
    RE.chain(getAbilityScoreWithReader),
);

const as1 = getSkillAbilityScore(SkillType.Appraise); // Right({ name: Intelligence, value:12 })
const as2 = getSkillAbilityScore("No Skill"); // Left(Skill "No Skill" not found.)
const as3 = getSkillAbilityScore(SkillType.Bluff); // Left(Score "Charisma" not found.)

const eInstance: Enviroment = {
    abilityScores: [
        ...abilityScores,
        { name: AbilityScoreType.Charisma, value: 12 },
    ],
    skills: [
        ...skills,
        { keyScore: AbilityScoreType.Intelligence, name: "No Skill" },
    ],
};

type Provider<R> = <A>(r: R.Reader<R, A>) => A;

const provide = <R>(r: R): Provider<R> => <A>(reader: R.Reader<R, A>): A => reader(r);

const as4 = getSkillAbilityScoreWithScoreReader(SkillType.Bluff)(eInstance); // Right({ name: Charisma, value:12 })

/** 
 * Since we are not reading skills from the enviroment, we can't find No Skill 
 * Even though it is inside our enviroment, but the function doesn't use it...
 */
const as5 = getSkillAbilityScoreWithScoreReader("No Skill")(eInstance); // Left(Skill "No Skill" not found.)

/** 
 * Now get skills inside is using the environment... 
 */
const as6 = getSkillAbilityScoreWithScoreAndSkillReader("No Skill")(eInstance); // Right({ name: Intelligence, value:12 })

/**
 * We may use the provider interface to pass the enviroment without having to stick an (instance) at the end
 */
const provider = provide<Enviroment>(eInstance);

const as7 = provider(getSkillAbilityScoreWithScoreAndSkillReader("No Skill"));

console.log({ as1, as2, as3, as4, as5, as6, as7 });
