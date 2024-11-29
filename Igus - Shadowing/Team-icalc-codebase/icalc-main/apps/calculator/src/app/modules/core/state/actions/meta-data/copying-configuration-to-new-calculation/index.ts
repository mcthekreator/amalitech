import type { CopyConfigurationToNewCalculationDto } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[MetaData] CopyingConfigurationToNewCalculation Submitted';
  constructor(public payload: CopyConfigurationToNewCalculationDto) {}
}
