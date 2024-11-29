import type { ExportingExcelFileSucceededPayload } from '../../../process-state/process-state.model';

export class Succeeded {
  public static readonly type = '[Api] ExportingExcelFile Succeeded';
  constructor(public payload: ExportingExcelFileSucceededPayload) {}
}
