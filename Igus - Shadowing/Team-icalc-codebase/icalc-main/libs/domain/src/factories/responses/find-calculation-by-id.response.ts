import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { FindCalculationByIdResponseDto } from '../../dtos';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '../objects';

const findCalculationByIdResponse: FindCalculationByIdResponseDto = createCalculationPresentation({
  singleCableCalculations: [
    createSingleCableCalculationPresentation({
      configuration: createConfigurationPresentation(),
    }),
  ],
});

/**
 * createFindCalculationByIdResponse creates a FindCalculationByIdResponseDto
 *
 * @param override pass any needed overrides for the requested FindCalculationByIdResponseDto
 * @returns FindCalculationByIdResponseDto
 */
export const createFindCalculationByIdResponse = (
  override?: NestedPartial<FindCalculationByIdResponseDto>
): FindCalculationByIdResponseDto => {
  return mergePartially.deep(findCalculationByIdResponse, override);
};
