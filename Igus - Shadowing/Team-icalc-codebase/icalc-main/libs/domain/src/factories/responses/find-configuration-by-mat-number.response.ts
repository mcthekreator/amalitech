/* eslint-disable @typescript-eslint/naming-convention */
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { ConfigurationPresentation } from '../../models';
import { createConfigurationPresentation } from '../objects';

const findConfigurationByMatNumberResponse: ConfigurationPresentation = createConfigurationPresentation();

/**
 * createFindConfigurationByMatNumberResponse creates a ConfigurationPresentation
 *
 * @param override pass any needed overrides for the requested ConfigurationPresentation
 * @returns ConfigurationPresentation
 */
export const createFindConfigurationByMatNumberResponse = (
  override?: NestedPartial<ConfigurationPresentation>
): ConfigurationPresentation => {
  return mergePartially.deep(findConfigurationByMatNumberResponse, override);
};
