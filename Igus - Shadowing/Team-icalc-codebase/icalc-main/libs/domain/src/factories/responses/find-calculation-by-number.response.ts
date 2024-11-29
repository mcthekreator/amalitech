import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { Calculation } from '../../models';
import { createCalculation, createSingleCableCalculation } from '../objects';

const findCalculationByNumberResponse: Calculation = createCalculation({
  singleCableCalculations: [createSingleCableCalculation()],
});

/**
 * createFindCalculationByNumberResponse creates a Calculation
 *
 * @param override pass any needed overrides for the requested Calculation
 * @returns Calculation
 */
export const createFindCalculationByNumberResponse = (override?: NestedPartial<Calculation>): Calculation => {
  return mergePartially.deep(findCalculationByNumberResponse, override);
};
