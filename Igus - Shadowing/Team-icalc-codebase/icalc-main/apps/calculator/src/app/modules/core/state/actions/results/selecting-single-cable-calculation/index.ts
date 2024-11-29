export class Started {
  public static readonly type = '[Results] SelectingSingleCableCalculation Started';
  constructor(public payload: { singleCableCalculationId: string }) {}
}
