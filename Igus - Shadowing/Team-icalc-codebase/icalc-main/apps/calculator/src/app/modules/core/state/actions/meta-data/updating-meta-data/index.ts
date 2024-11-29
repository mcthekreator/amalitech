import type { MetaDataViewModel } from '../../../process-state/process-state.model';

export class Started {
  public static readonly type = '[MetaData] UpdatingMetaData Started';
  constructor(public payload: MetaDataViewModel) {}
}
