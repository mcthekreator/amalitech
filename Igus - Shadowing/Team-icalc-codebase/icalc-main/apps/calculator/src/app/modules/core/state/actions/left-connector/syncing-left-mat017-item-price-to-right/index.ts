export class Started {
  public static readonly type = '[LeftConnector] SyncingLeftMat017ItemPriceToRight Started';
  constructor(public payload: { mat017ItemsWithMismatch: string[]; currentConnectorSide: 'rightConnector' }) {}
}
