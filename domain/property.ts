export const merge = <TMerge>(merge: TMerge) => <TEntry>(
  entry: TEntry
): TEntry & TMerge => Object.assign({}, merge, entry);

export type MergeFn<TMerge> = <TEntry>(entry: TEntry) => TEntry & TMerge;
