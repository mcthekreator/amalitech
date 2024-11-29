export class Submitted {
  public static readonly type = '[Results] UpdatingChainflexPrices Submitted';
  constructor(public payload: string[]) {}
}
