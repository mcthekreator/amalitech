import type { ProcessManyResult } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] ProcessingCalculation Succeeded';
  constructor(public payload: ProcessManyResult) {}
}
