import type { SingleCableCalculationPresentation } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] SelectingCalculation Succeeded';
  constructor(public payload: SingleCableCalculationPresentation) {}
}
