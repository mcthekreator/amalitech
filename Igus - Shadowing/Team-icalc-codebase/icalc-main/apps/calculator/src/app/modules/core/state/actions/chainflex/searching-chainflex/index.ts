import type { IcalcListInformation } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[Chainflex] SearchingChainflex Started';
  constructor(public payload: { listInformation: Partial<IcalcListInformation> }) {}
}
