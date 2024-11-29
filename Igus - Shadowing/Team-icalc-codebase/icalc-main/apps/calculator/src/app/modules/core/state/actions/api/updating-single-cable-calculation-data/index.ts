import type { UpdateCalculationWithSCC } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingSingleCableCalculationData Succeeded';
  constructor(public payload: UpdateCalculationWithSCC) {}
}
