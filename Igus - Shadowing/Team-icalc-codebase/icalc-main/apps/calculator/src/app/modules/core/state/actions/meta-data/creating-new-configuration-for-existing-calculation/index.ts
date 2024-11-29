import type { CreateNewConfigurationForExistingCalculationRequestDto } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[MetaData] CreatingNewConfigurationForExistingCalculation Submitted';
  constructor(public payload: CreateNewConfigurationForExistingCalculationRequestDto) {}
}
