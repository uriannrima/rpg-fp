export const applyTo = (target: any) => <Fn extends (...args: any[]) => any>(
  fn: Fn
): ReturnType<Fn> => fn(target);
