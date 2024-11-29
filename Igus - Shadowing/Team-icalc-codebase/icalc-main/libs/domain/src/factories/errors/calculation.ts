export const createCalculationDoesNotExistErrorMessage = (calculationId: string): string => {
  return `Calculation with calculation number ${calculationId} does not exist.`;
};

export const createLockedCalculationCannotBeModifiedErrorMessage = (calculationId: string): string => {
  return `Calculation with id ${calculationId} is locked and cannot be modified.`;
};
