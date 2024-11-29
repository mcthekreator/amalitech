import type { ChainflexCable, IcalcListResult } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] SearchingChainflex Succeeded';
  constructor(public payload: IcalcListResult<ChainflexCable>) {}
}
