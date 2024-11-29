import type { ChainflexCable } from '@igus/icalc-domain';

export class Chosen {
  public static readonly type = '[Chainflex] ChoosingChainflexCable Chosen';
  constructor(public payload: { chainflexCable: ChainflexCable }) {}
}
