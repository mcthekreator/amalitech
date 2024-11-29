import type { UpdateCalculationRequestDto } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[Results] UpdatingCalculationData Submitted';
  constructor(public payload: UpdateCalculationRequestDto) {}
}
