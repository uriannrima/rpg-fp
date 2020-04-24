import { merge } from "../property";

export type Name = string;

export interface WithName {
  name: Name;
}

export const withName = merge<WithName>({ name: "" });
export const getName = ({ name }: WithName): string => name;
