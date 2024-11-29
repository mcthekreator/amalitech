import type { UpdateChainflexPricesResult } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingChainflexPrices Succeeded';
  constructor(public payload: UpdateChainflexPricesResult) {}
}
