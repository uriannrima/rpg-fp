import { curry, compose, isFunction } from "../fp/pureFunctions";

// export const withProperty = <TProperty>(
//   propertyName = "",
//   defaultValue: TProperty
// ) => (entity = {}) => ({
//   [propertyName]: isFunction(defaultValue)
//     ? () => defaultValue(entity)
//     : defaultValue,
//   ...entity
// });

export const withProperty = <TProperty>(
  propertyName = "",
  defaultValue: TProperty
) => (entity = {}) => {
  if (entity[propertyName] === undefined) {
    entity[propertyName] = isFunction(defaultValue)
      ? () => defaultValue(entity)
      : defaultValue;
  }

  return entity;
};

export const withCollectionOf = curry(
  (propertyName = "", elementFactoryFn, length = 0, entity = {}) =>
    withProperty(propertyName, Array.from({ length }, elementFactoryFn))(entity)
);

export interface WithValue<TValue = number> {
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

export const withValue = withProperty("value", 0);
export const withName = withProperty("name", "");
export const withDescription = withProperty("description", "");
export const withField = compose(withValue, withName);
