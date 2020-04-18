export const applyTo = (target: any) => <Fn extends (...args: any[]) => any>(
  fn: Fn
): ReturnType<Fn> => fn(target);

export const trace = (label: string) => (x: any): any => {
  console.log(label, x.toString());
  return x;
};
