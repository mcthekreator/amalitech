import type { Mat017ItemWithWidenData } from '@igus/icalc-domain';

interface FetchingImageFromWidenSucceededPayload {
  update: Partial<Mat017ItemWithWidenData>;
  matNumber: string;
}

export class Succeeded {
  public static readonly type = '[Api] FetchingImageFromWiden Succeeded';
  constructor(public payload: FetchingImageFromWidenSucceededPayload) {}
}
