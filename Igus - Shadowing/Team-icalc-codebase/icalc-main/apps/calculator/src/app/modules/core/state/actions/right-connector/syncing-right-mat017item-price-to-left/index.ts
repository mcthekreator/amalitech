export class Started {
  public static readonly type = '[RightConnector] SyncingRightMat017ItemPriceToLeft Started';
  constructor(public payload: { mat017ItemsWithMismatch: string[]; currentConnectorSide: 'leftConnector' }) {}
}
