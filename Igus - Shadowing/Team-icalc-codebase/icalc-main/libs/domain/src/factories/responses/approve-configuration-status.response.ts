import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { CalculationConfigurationPresentationStatus, CalculationConfigurationStatus } from '../../models';
import { ConfigurationStatus } from '../../models';
import { createTestUserFullName } from '../objects';

const approveConfigurationStatusResponse: CalculationConfigurationPresentationStatus = {
  calculationId: '46a6eb45-3cf0-4a60-bac0-c4828f69a4f2',
  configurationId: 'c9b39293-84b4-48c3-a6dc-5cbd50d6ac03',
  modificationDate: new Date(),
  modifiedBy: createTestUserFullName(),
  status: ConfigurationStatus.approved,
};

/**
 * createApproveConfigurationStatusResponse creates a CalculationConfigurationStatus
 *
 * @param override pass any needed overrides for the requested CalculationConfigurationStatus
 * @returns CalculationConfigurationStatus
 */
export const createApproveConfigurationStatusResponse = (
  override?: NestedPartial<CalculationConfigurationStatus>
): CalculationConfigurationStatus => {
  return mergePartially.deep(approveConfigurationStatusResponse, override) as CalculationConfigurationStatus;
};
