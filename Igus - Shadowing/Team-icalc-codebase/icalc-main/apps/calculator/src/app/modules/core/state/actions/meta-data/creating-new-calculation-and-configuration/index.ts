import type { CreateCalculationAndConfigurationRequestDto } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[MetaData] CreatingNewCalculationAndConfiguration Submitted';
  constructor(public payload: CreateCalculationAndConfigurationRequestDto) {}
}
