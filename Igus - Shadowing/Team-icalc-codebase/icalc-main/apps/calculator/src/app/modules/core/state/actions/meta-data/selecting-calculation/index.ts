export class Started {
  public static readonly type = '[MetaData] SelectingCalculation Started';
  constructor(public payload: { singleCableCalculationId: string }) {}
}
