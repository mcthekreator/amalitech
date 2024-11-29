import type { ChainflexCable } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[Chainflex] LeavingChainflexPage Started';
  constructor(public payload: { chainflexCableLength: number; chainflexCable: ChainflexCable }) {}
}
