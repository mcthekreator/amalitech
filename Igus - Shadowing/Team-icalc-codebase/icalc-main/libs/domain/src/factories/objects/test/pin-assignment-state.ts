/* eslint-disable @typescript-eslint/naming-convention */
import type { ConfigurationPinAssignmentState } from '../../../models';
import { mergePartially } from 'merge-partially';
import { icalcTestChainflexStateWithValidChainflexCable } from './chainflex';

export const icalcTestPinAssignmentState: ConfigurationPinAssignmentState = {
  actionModels: {
    '0': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '1': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '2': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '3': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '4': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '5': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '6': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '7': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '8': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '9': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '10': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '11': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '12': { left: { actionSelect: 'none' }, type: 'shield', right: { actionSelect: 'none' } },
  },
  bridges: { left: [], right: [] },
  litze: [],
  base64Image: 'data:image/png;base64,veryLongBase64StringOfScreenshot...',
  chainFlexNumber: icalcTestChainflexStateWithValidChainflexCable.chainflexCable.partNumber,
};
export const createIcalcTestPinAssignmentState = (
  override?: Partial<ConfigurationPinAssignmentState>
): ConfigurationPinAssignmentState => {
  return mergePartially.shallow(icalcTestPinAssignmentState, override);
};
