import type { ChainflexCable } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[Chainflex] EnteringChainflexPage Started';
}

export class Entered {
  public static readonly type = '[Chainflex] EnteringChainflexPage Entered';
  constructor(public payload: ChainflexCable | null) {}
}
