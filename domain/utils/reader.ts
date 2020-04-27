import * as R from "fp-ts/lib/Reader";

type Provider<R> = <A>(r: R.Reader<R, A>) => A;

export const provide = <R>(r: R): Provider<R> => <A>(
  reader: R.Reader<R, A>
): A => reader(r);
