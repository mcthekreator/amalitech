import type { CheckForNewChainflexPricesResult } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] CheckingForNewChainflexPrices Succeeded';
  constructor(public payload: CheckForNewChainflexPricesResult) {}
}
