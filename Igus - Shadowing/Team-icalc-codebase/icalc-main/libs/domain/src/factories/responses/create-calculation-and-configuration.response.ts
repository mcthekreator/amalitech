import { mergePartially } from 'merge-partially';
import type { CreateCalculationAndConfigurationResponseDto } from '../../dtos';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '../objects';

const createCalculationAndConfigurationResponse: CreateCalculationAndConfigurationResponseDto =
  createSingleCableCalculationPresentation({
    calculation: createCalculationPresentation(),
    configuration: createConfigurationPresentation(),
  });

/**
 * createCreateCalculationAndConfigurationResponse creates a CreateCalculationAndConfigurationResponseDto
 *
 * @param override pass any needed overrides for the requested CreateCalculationAndConfigurationResponseDto
 * @returns CreateCalculationAndConfigurationResponseDto
 */
export const createCreateCalculationAndConfigurationResponse = (
  override?: Partial<CreateCalculationAndConfigurationResponseDto>
): CreateCalculationAndConfigurationResponseDto => {
  return mergePartially.shallow(createCalculationAndConfigurationResponse, override);
};
