import type { SelectingConfigurationFromConfigurationSearchPayload } from '../../../process-state/process-state.model';

export class Started {
  public static readonly type = '[ConfigurationSearch] SelectingConfiguration Started';
  constructor(public payload: SelectingConfigurationFromConfigurationSearchPayload) {}
}
