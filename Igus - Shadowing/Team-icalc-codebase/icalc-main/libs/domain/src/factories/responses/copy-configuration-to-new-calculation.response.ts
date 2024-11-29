import { mergePartially } from 'merge-partially';
import type { CopyConfigurationToNewCalculationResponseDto } from '../../dtos';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '../objects';

const copyConfigurationToNewCalculationResponse: CopyConfigurationToNewCalculationResponseDto =
  createSingleCableCalculationPresentation({
    calculation: createCalculationPresentation(),
    configuration: createConfigurationPresentation(),
  });

/**
 * createCopyConfigurationToNewCalculationResponse creates a CopyConfigurationToNewCalculationResponseDto
 *
 * @param override pass any needed overrides for the requested CopyConfigurationToNewCalculationResponseDto
 * @returns CopyConfigurationToNewCalculationResponseDto
 */
export const createCopyConfigurationToNewCalculationResponse = (
  override?: Partial<CopyConfigurationToNewCalculationResponseDto>
): CopyConfigurationToNewCalculationResponseDto => {
  return mergePartially.shallow(copyConfigurationToNewCalculationResponse, override);
};
