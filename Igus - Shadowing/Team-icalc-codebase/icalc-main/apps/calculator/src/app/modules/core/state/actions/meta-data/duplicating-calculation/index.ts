import type { DuplicatingCalculationRequestDto } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[MetaData] DuplicatingCalculation Submitted';
  constructor(public payload: DuplicatingCalculationRequestDto) {}
}
