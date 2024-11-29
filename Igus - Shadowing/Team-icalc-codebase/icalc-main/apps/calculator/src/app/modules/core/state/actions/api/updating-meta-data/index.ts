import type { UpdatingMetaDataPayload } from '../../../process-state/process-state.model';

export class Succeeded {
  public static readonly type = '[Api] UpdatingMetaData Succeeded';
  constructor(public payload: UpdatingMetaDataPayload) {}
}
