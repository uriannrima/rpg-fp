import { merge } from "../property";

export interface WithName {
  name: string;
}

export const withName = merge<WithName>({ name: "" });
export const getName = ({ name }: WithName): string => name;
