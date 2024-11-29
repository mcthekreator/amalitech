import type { WorkStepQuantities } from '@igus/icalc-domain';
import { ObjectUtils, chainflexRelatedWorkStepNames, defaultCommercialWorkStepNames } from '@igus/icalc-domain';

export const omitCommercialWorkSteps = (workStepOverrides: WorkStepQuantities): WorkStepQuantities => {
  return { ...ObjectUtils.omitKeys(workStepOverrides, [...defaultCommercialWorkStepNames]) };
};

export const removeChainflexRelatedOverrides = (overrides: WorkStepQuantities): WorkStepQuantities => {
  return { ...ObjectUtils.omitKeys(overrides, [...chainflexRelatedWorkStepNames]) };
};
