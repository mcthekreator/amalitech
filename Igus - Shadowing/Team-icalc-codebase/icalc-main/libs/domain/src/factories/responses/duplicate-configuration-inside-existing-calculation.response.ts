import type { CopyConfigurationToExistingCalculationResponseDto } from '../../dtos';

import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '../objects';

const copyConfigurationToExistingCalculationResponse: CopyConfigurationToExistingCalculationResponseDto =
  createSingleCableCalculationPresentation({
    calculation: createCalculationPresentation({
      singleCableCalculations: [
        createSingleCableCalculationPresentation({ configuration: createConfigurationPresentation() }),
      ],
    }),
    configuration: createConfigurationPresentation(),
  });

/**
 * createCopyConfigurationToExistingCalculationResponse creates a CopyConfigurationToExistingCalculationResponseDto
 *
 * @returns CopyConfigurationToExistingCalculationResponseDto
 */
export const createCopyConfigurationToExistingCalculationResponse =
  (): CopyConfigurationToExistingCalculationResponseDto => {
    return copyConfigurationToExistingCalculationResponse;
  };
