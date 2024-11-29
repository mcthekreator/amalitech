import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { SaveSingleCableCalculationResponseDto } from '../../dtos';
import type { IcalcUser } from '../../models';
import { createCalculationPresentation, createConfigurationPresentation } from '../objects';

const saveSingleCableCalculationResponse: SaveSingleCableCalculationResponseDto = {
  singleCableCalculation: {
    id: 'a1c3dee0-a7d6-4e75-8cf4-cc975dfa84fb',
    calculationId: '46a6eb45-3cf0-4a60-bac0-c4828f69a4f2',
    configurationId: 'c9b39293-84b4-48c3-a6dc-5cbd50d6ac03',
    snapshotId: undefined,
    commercialWorkStepOverrides: {},
    calculationFactor: undefined,
    batchSize: 1,
    chainflexLength: 1,
    assignmentDate: new Date(),
    assignedBy: {} as IcalcUser,
    configuration: createConfigurationPresentation(),
    snapshot: undefined,
    calculation: createCalculationPresentation(),
  },
  calculationConfigurationStatus: {
    hasApprovalBeenRevoked: false,
  },
};

/**
 * createSaveSingleCableCalculationResponse creates a SaveSingleCableCalculationResponseDto
 *
 * @param override pass any needed overrides for the requested SaveSingleCableCalculationResponseDto
 * @returns SaveSingleCableCalculationResponseDto
 */
export const createSaveSingleCableCalculationResponse = (
  override?: NestedPartial<SaveSingleCableCalculationResponseDto>
): SaveSingleCableCalculationResponseDto => {
  return mergePartially.deep(saveSingleCableCalculationResponse, override);
};
