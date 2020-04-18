export type KeyMap<TEnum extends string | number, TValue> = {
  [key in TEnum]: TValue;
};
