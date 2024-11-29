import type { WidenTitleTag, WidenUploadImage } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[Library] AddingWidenImage Started';
  constructor(public payload: WidenUploadImage) {}
}

export class Succeeded {
  public static readonly type = '[Library] AddingWidenImage Succeeded';
  constructor(public payload: { matNumber: string; titleTag: WidenTitleTag }) {}
}
