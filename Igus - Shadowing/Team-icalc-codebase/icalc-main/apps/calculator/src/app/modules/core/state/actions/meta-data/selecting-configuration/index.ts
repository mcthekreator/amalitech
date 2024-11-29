export class Started {
  public static readonly type = '[MetaData] SelectingConfiguration Started';
  constructor(public payload: { singleCableCalculationId: string }) {}
}
