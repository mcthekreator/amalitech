import type { UpdatingSingleCableCalculationDataPayload } from '../../../process-state/process-state.model';

export class Submitted {
  public static readonly type = '[Results] UpdatingSingleCableCalculationAndConfigurationData Submitted';
  constructor(public payload: UpdatingSingleCableCalculationDataPayload) {}
}
