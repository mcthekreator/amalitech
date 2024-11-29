/* eslint-disable @typescript-eslint/naming-convention */
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { ConfigurationState, ConfigurationStatePresentation } from '../../models';
import { WorkStepSet } from '../../models';
import { icalcTestChainflexStateWithValidChainflexCable } from './test/chainflex';
import { icalcTestPinAssignmentState } from './test/pin-assignment-state';
import { libraryState } from './test/library-state';
import { createIcalcTestConnectorState, createIcalcTestConnectorStatePresentation } from './test/connector-state';

const exampleConfigurationState: ConfigurationState = {
  chainFlexState: icalcTestChainflexStateWithValidChainflexCable,
  connectorState: createIcalcTestConnectorState(),
  libraryState,
  pinAssignmentState: icalcTestPinAssignmentState,
  workStepSet: WorkStepSet.standard,
  workStepOverrides: {
    consignment: 2,
    crimp: 4,
    sendTestReport: 1,
  },
};

const exampleConfigurationPresentationState: ConfigurationStatePresentation = {
  chainFlexState: icalcTestChainflexStateWithValidChainflexCable,
  connectorState: createIcalcTestConnectorStatePresentation(),
  libraryState,
  pinAssignmentState: icalcTestPinAssignmentState,
  workStepSet: WorkStepSet.standard,
  workStepOverrides: {
    consignment: 2,
    crimp: 4,
    sendTestReport: 1,
  },
};

/**
 * createConfigurationState creates a ConfigurationState (default = valid chainflex cable)
 *
 * @param override pass any needed overrides for the requested ConfigurationState
 * @returns ConfigurationState
 */
export const createConfigurationState = (override?: NestedPartial<ConfigurationState>): ConfigurationState => {
  return mergePartially.deep(exampleConfigurationState, override);
};
export const createConfigurationStatePresentation = (
  override?: NestedPartial<ConfigurationStatePresentation>
): ConfigurationStatePresentation => {
  return mergePartially.deep(exampleConfigurationPresentationState, override);
};
