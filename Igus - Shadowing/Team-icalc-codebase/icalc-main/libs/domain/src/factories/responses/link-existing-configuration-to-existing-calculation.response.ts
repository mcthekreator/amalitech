import { mergePartially } from 'merge-partially';
import type { AssignConfigurationToExistingCalculationResponseDto } from '../../dtos';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createConfigurationState,
  createSingleCableCalculationPresentation,
} from '../objects';

const assignConfigurationToExistingCalculationResponse: AssignConfigurationToExistingCalculationResponseDto =
  createSingleCableCalculationPresentation({
    calculation: createCalculationPresentation({
      singleCableCalculations: [
        createSingleCableCalculationPresentation({
          configuration: createConfigurationPresentation(),
        }),
        createSingleCableCalculationPresentation({
          configuration: createConfigurationPresentation(),
        }),
      ],
    }),
    commercialWorkStepOverrides: {
      einkaufDispo: 5,
      projektierung: 5,
      auftragsmanagement: 5,
    },
    configuration: createConfigurationPresentation({
      state: createConfigurationState({
        workStepOverrides: {
          test: 8,
          crimp: 5,
          strip: 2,
          labeling: 6,
          skinning: 4,
          sendTestReport: 9,
          shieldHandling: 3,
          drillingSealInsert: 7,
        },
      }),
    }),
  });

/**
 * createAssignConfigurationToExistingCalculationResponse creates a AssignConfigurationToExistingCalculationResponseDto
 *
 * @param override pass any needed overrides for the requested AssignConfigurationToExistingCalculationResponseDto
 * @returns AssignConfigurationToExistingCalculationResponseDto
 */
export const createAssignConfigurationToExistingCalculationResponse = (
  override?: Partial<AssignConfigurationToExistingCalculationResponseDto>
): AssignConfigurationToExistingCalculationResponseDto => {
  return mergePartially.shallow(assignConfigurationToExistingCalculationResponse, override);
};
