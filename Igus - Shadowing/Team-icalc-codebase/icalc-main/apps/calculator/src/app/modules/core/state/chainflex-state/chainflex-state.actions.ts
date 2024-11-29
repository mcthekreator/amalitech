import type { ChainflexCable } from '@igus/icalc-domain';

export class SetChainflexCable {
  public static readonly type = '[SetChainflexCable] sets the chainflex cable for this order';
  constructor(public chainflexCable: ChainflexCable) {}
}

export class SetDefaultListInformation {
  public static readonly type = '[SetDefaultListInformation] sets the default list information in the chainflex state';
}
