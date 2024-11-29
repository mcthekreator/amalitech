import { mergePartially } from 'merge-partially';
import type { UpdateMat017ItemsOverridesInConfigurationsResponseDto } from '../../dtos';
import { createConfigurationPresentation } from '../objects';
import type { UpdatedConfigurationResult } from '../../models';

const mockConfiguration = createConfigurationPresentation();

const defaultUpdateMat017ItemsOverridesInConfigurationsResponse: UpdatedConfigurationResult = {
  configurationId: mockConfiguration.id,
  matNumber: mockConfiguration.matNumber,
  connectorState: mockConfiguration.state.connectorState,
  removedOverrides: [],
  hasRemovedOverrides: false,
  calculationConfigurationStatus: {
    hasApprovalBeenRevoked: false,
  },
  workStepOverrides: {},
};

/**
 * Creates an UpdateMat017ItemsOverridesInConfigurationsResponseDto.
 *
 * @param override - Pass any needed overrides for the requested UpdateMat017ItemsOverridesInConfigurationsResponseDto.
 * @returns - An array of UpdatedConfigurationResult.
 */
export const createUpdateMat017ItemsOverridesResponse = (
  override?: Partial<UpdatedConfigurationResult> | Partial<UpdatedConfigurationResult>[]
): UpdateMat017ItemsOverridesInConfigurationsResponseDto => {
  if (Array.isArray(override)) {
    return override.map((overrideItem) =>
      mergePartially.shallow(defaultUpdateMat017ItemsOverridesInConfigurationsResponse, overrideItem)
    );
  }

  return [mergePartially.shallow(defaultUpdateMat017ItemsOverridesInConfigurationsResponse, override)];
};
