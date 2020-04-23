import * as R from "fp-ts/lib/Reader"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable";
import * as Ramda from 'ramda';
import { flow } from "fp-ts/lib/function";

const f = (b: boolean) => (b ? 'true' : 'false')
const g = (n: number) => f(n > 2);
const h = (s: string) => g(s.length + 1);

console.log(h('foo'));

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
        false: 'falso',
        true: 'verdadeiro'
    },
    lowerBound: 4,
}

/** We must change signature (add deps to all chain) and change the code! */
const f2 = (b: boolean, deps: Dependencies): string => (b ? deps.i18n.true : deps.i18n.false);
const g2 = (n: number, deps: Dependencies): string => f2(n > 2, deps);
const h2 = (s: string, deps: Dependencies): string => g2(s.length + 1, deps);
console.log(h2('foo', instance));

/** Dependency as return type... */

/** 
 * Even though we have changed the SIGNATURE of the return value of "F" (and because of it, propagated to G and H),
 * We didn't have to make any change to G and H, no need to change nothing on the code.
 * We may explicity tell the return, but we aren't obliged to (see g3 and h3).
 */
const f3 = (b: boolean) => (deps: Dependencies): string => (b ? deps.i18n.true : deps.i18n.false);
const g3 = (n: number) => f3(n > 2);
const h3 = (s: string): (deps: Dependencies) => string => g3(s.length + 1);

/** Now, almost everything is the same, but we need to pass the dependencies */
h3('foo')(instance);

/** Reader<D, A> => (dependency: D) => A */

/** 
 * F3 is of type (dep: A) => B
 * Any "(a: A) => B" where A is a dependency, we can use Reader<A, B>
 * Since F uses Dependencies, to return a string, we say that
 * F4 = Boolean -> Reader<Dependencies, String>
 * Reader<Dependencies,String> => (a: Dependencies) => string;
 */

const f4 = (b: boolean): R.Reader<Dependencies, string> => (deps): string => (b ? deps.i18n.true : deps.i18n.false);
const g4 = (n: number): R.Reader<Dependencies, string> => f4(n > 2);
const h4 = (s: string): R.Reader<Dependencies, string> => g4(s.length + 1);

h4('foo')(instance)

/**
 * We now, can inject in between the line...
 */

/**
 * R.map -> Consume, and thats it, the return becomes the product to the other
 * R.chain -> Consume the Reader of A, and the return B becomes Reader<A, B>
 */
const g5 = (n: number): R.Reader<Dependencies, string> => pipe(
    /** Ask for Deps for the next function which will use it */
    R.ask<Dependencies>(),
    /** Chain the function to use the dependecy asked */
    R.chain(deps => f4(n > deps.lowerBound))
)

const h5 = (s: string) => g5(s.length + 1);

h5('foo')({ ...instance, lowerBound: 10 }); // False

enum AbilityScoreType {
    Intelligence = 'Intelligence',
    Charisma = 'Charisma'
}

type AbilityScoreName = string | AbilityScoreType;

type AbilityScore = {
    name: AbilityScoreName;
    value: number;
}

type AbilityScores = Array<AbilityScore>

enum SkillType {
    Appraise = 'Appraise',
    Bluff = 'Bluff'
}

type SkillName = string | SkillType;

type Skill = {
    name: SkillName;
    keyScore: AbilityScoreName;
}

type Skills = Skill[];

const abilityScores: AbilityScores = [
    { name: AbilityScoreType.Intelligence, value: 12 }
];

const getAbilityScore = (scoreName: AbilityScoreName): E.Either<Error, AbilityScore> => {
    const score = Ramda.find<AbilityScore>(score => score.name == scoreName)(abilityScores);
    return E.fromNullable(new Error(`Score "${scoreName}" not found.`))(score);
}

const skills: Skills = [
    { name: SkillType.Appraise, keyScore: AbilityScoreType.Intelligence },
    { name: SkillType.Bluff, keyScore: AbilityScoreType.Charisma },
];

const getKeyScore = ({ keyScore }: { keyScore: AbilityScoreName }) => keyScore;

const getSkill = (skillName: SkillName): E.Either<Error, Skill> => {
    const skill = Ramda.find<Skill>(skill => skill.name == skillName)(skills);
    return E.fromNullable(new Error(`Skill "${skillName}" not found.`))(skill);
}

const getSkillAbilityScore = flow(
    getSkill,
    E.map(getKeyScore),
    // If we map again, we'll have an Either<Error, Either<Error, AbilityScore>>
    // To avoid it, we use chain, or flatMap, since both has the same left as Error
    // And we end up with a Either<Error,AbilityScore>
    E.chain(getAbilityScore)
);

const as1 = getSkillAbilityScore(SkillType.Appraise);
const as2 = getSkillAbilityScore('No Skill'); // Skill "No Skill" not found.
const as3 = getSkillAbilityScore(SkillType.Bluff); // Score "Charisma" not found.

console.log(
    { as1, as2, as3 }
);