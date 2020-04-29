import { array } from 'fp-ts/lib/Array';
import { task, taskSeq } from 'fp-ts/lib/Task';

const names = [
    'Gcanti',
    'AlexRex',
    'Uriann',
    'Ptah',
    'Destruct',
];

const waitAndSayName = (label: string) => (name: string) => (): Promise<string> => new Promise((resolve) => {
    console.log(`Start ${label} ${name}`);
    console.time(`${label}-${name}`);
    setTimeout(() => {
        console.timeEnd(`${label}-${name}`);
        resolve(name);
    }, Math.random() * 1000);
});


// parallel
/** Will execute all at the same time */
const parallelExecution = array.traverse(task)(names, waitAndSayName("Parallel"));

// sequential
/** Will start the next only after the first one resolved */
const sequentialExecution = array.traverse(taskSeq)(names, waitAndSayName("Sequential"));

parallelExecution().then(console.log);
sequentialExecution().then(console.log);
