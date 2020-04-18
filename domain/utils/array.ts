export const filter = <T, S extends T>(
  callbackfn: (value: T) => value is S
) => (array: T[]): S[] => array.filter(callbackfn);
