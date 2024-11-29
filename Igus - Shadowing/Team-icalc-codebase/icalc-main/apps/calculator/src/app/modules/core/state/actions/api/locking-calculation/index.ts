export class Succeeded {
  public static readonly type = '[Api] LockingCalculation Succeeded';
  constructor(public payload: { singleCableCalculationId: string }) {}
}
