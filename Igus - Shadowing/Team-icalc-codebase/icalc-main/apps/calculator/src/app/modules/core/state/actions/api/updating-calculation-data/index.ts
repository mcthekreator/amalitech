import type { UpdateCalculationWithSCC } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingCalculationData Succeeded';
  constructor(public payload: UpdateCalculationWithSCC) {}
}
