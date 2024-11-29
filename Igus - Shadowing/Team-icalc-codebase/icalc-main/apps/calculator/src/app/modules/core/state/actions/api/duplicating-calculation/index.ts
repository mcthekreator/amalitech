import type { SingleCableCalculationPresentation } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] DuplicatingCalculation Succeeded';
  constructor(public payload: SingleCableCalculationPresentation) {}
}
