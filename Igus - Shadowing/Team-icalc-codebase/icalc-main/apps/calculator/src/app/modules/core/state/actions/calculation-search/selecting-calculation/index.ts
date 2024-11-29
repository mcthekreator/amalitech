export class Started {
  public static readonly type = '[CalculationSearch] SelectingCalculation Started';
  constructor(public payload: { calculationId: string }) {}
}
