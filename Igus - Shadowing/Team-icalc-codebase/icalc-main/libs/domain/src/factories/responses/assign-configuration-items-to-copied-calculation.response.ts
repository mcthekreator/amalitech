import { mergePartially } from 'merge-partially';
import type { AssignConfigurationItemsToCopiedCalculationResponseDto } from '../../dtos';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '../objects';

export const assignConfigurationItemsToCopiedCalculationResponse: AssignConfigurationItemsToCopiedCalculationResponseDto =
  createSingleCableCalculationPresentation({
    configuration: createConfigurationPresentation(),
    calculation: createCalculationPresentation(),
  });

/**
 * createAssignConfigurationItemsToCopiedCalculationResponse creates a AssignConfigurationItemsToCopiedCalculationResponseDto
 *
 * @param override pass any needed overrides for the requested AssignConfigurationItemsToCopiedCalculationResponseDto
 * @returns AssignConfigurationItemsToCopiedCalculationResponseDto
 */
export const createAssignConfigurationItemsToCopiedCalculationResponse = (
  override?: Partial<AssignConfigurationItemsToCopiedCalculationResponseDto>
): AssignConfigurationItemsToCopiedCalculationResponseDto => {
  return mergePartially.shallow(assignConfigurationItemsToCopiedCalculationResponse, override);
};
