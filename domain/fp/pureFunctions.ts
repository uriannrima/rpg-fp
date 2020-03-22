export const compose = <TEntry = any>(...operations) => (entry: TEntry) =>
  operations.reduceRight(
    (currentValue, currentOperation) => currentOperation(currentValue),
    entry
  );

export const pipe = (...operations) => (entry = {}) =>
  operations.reduce(
    (currentValue, currentOperation) => currentOperation(currentValue),
    entry
  );

export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

export const map = curry((fn, f) => f.map(fn));

export const filter = curry((predicate, array) => array.filter(predicate));

export const join = (fn, parameterIndex = 0) => entry =>
  Array.isArray(entry)
    ? entry.concat(fn(entry[parameterIndex]))
    : [entry, fn(entry)];

/**
 * Element at index N, starting at 0, is passed to the index N + 1 if it's a function, and so forth, until it returns the result.
 * @param array Join array.
 */
export const mergeJoin = (array: any[]) =>
  array.reduce((previous, current) =>
    isFunction(current) ? current(previous) : current
  );

export const executeOn = entry => fn => fn(entry);

export const find = <TElement = any>(
  predicate: (value: TElement, index: number, obj: TElement[]) => unknown
) => (array: TElement[]) => array.find(predicate);

export const forEach = <TElement = any>(
  callbackfn: (value: TElement, index: number, array: TElement[]) => void
) => (array: TElement[]) => array.forEach(callbackfn);

export const partition = curry((predicate, array) =>
  array.reduce(
    (result, element) => {
      result[predicate(element) ? 0 : 1].push(element);
      return result;
    },
    [[], []]
  )
);

export const groupBy = curry((getProperty, array: Array<any>) =>
  array.reduce(
    (groupBy, element) => ({
      ...groupBy,
      [getProperty(element)]: (groupBy[getProperty(element)] || []).concat(
        element
      )
    }),
    {}
  )
);

export const includes = curry((array: any[] = [], value = {}) =>
  array.includes(value)
);

export const debug = curry((tag, entry) => {
  console.log(tag, { entry });
  return entry;
});

export const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

export const reduce = curry((reducerFn, defaultValue, array) => {
  return array.reduce(reducerFn, defaultValue);
});

export const get = path => entry =>
  path.split(".").reduce((current, property) => current[property], entry);

export const isNullOrUndefined = entry =>
  typeof entry === "undefined" || entry === null;

export const isNullOrUndefinedOrEmpty = entry =>
  isNullOrUndefined(entry) || entry.length <= 0;

export const set = <TProperty = any, TEntry = any>(path: string) => (
  value: TProperty
) => (entry: TEntry) =>
  path.split(".").reduce((current, property) => {
    if (isNullOrUndefined(entry)) {
      return entry;
    }

    if (
      typeof current[property] === "object" &&
      !Array.isArray(current[property])
    ) {
      return current[property];
    }

    current[property] = value;
    return entry;
  }, entry);

export function isFunction(fn: any): fn is Function {
  return typeof fn === "function";
}

export const opReduce = curry((operation, acc, curr) => operation(acc, curr));
export const addOperation = curry((a, b) => a + b);
export const minusOperation = curry((a, b) => a - b);
export const multiplyOperation = curry((a, b) => a * b);
export const divideOperation = curry((a, b) => a / b);
export const sumReduce = opReduce(addOperation);
export const identity = <TValue = any>(value: TValue) => value;
export const simpleEquals = curry((a, b) => a === b);

export const encapsulate = propertyName => value => ({ [propertyName]: value });
