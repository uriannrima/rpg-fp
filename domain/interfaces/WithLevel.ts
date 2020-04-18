import { merge } from "../property";

export interface WithLevel {
  level: number;
}

export const withLevel = merge<WithLevel>({ level: 1 });

export const getLevel = ({ level }: WithLevel): number => level;
