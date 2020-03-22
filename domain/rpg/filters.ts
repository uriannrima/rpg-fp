import { find, simpleEquals, get, compose } from "../fp/pureFunctions";

export const findByProperty = <TElement, TProperty = string>(
  propertyName: string
) => (searchElement: TProperty) =>
  find<TElement>(compose(simpleEquals(searchElement), get(propertyName)));

export const findByName = findByProperty("name");
