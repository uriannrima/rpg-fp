export const createOnDefaultError = (errorHandler: (e: Error) => void) => <
  TValue
>(
  returnValue: TValue
) => (e: Error): TValue => {
  errorHandler(e);
  return returnValue;
};

export const onDefaultError = createOnDefaultError(console.error);
