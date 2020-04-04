import { compose } from "./pureFunctions";

export function withProperties<TOutput, TEntry>(
  output: TOutput,
  entry: TEntry
): TOutput & TEntry {
  return Object.assign(entry, output);
}

export function withPropertiesC<TOutput>(output: TOutput) {
  return function<TEntry>(entry: TEntry): TOutput & TEntry {
    return Object.assign(entry, output);
  };
}

export interface WithValue<TValue> {
  value: TValue;
}

export interface WithName {
  name: string;
}

export interface WithDescription {
  description: string;
}

export interface Field<TValue, TName = string> {
  name: TName;
  value: TValue;
}

export const withName = withPropertiesC<WithName>({ name: "" });
export const withDescription = withPropertiesC<WithDescription>({
  description: ""
});
export const withNumberValue = withPropertiesC<WithValue<number>>({ value: 0 });

export const withField = compose(withNumberValue, withName);
const a = withField({});
