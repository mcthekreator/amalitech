import type { FetchingImagesFromWidenPayload } from '../../../process-state/process-state.model';

export class Succeeded {
  public static readonly type = '[Api] FetchingImagesFromWiden Succeeded';
  constructor(public payload: FetchingImagesFromWidenPayload) {}
}
