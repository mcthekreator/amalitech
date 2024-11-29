import type { CopyConfigurationToNewCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] CopyingConfigurationToNewCalculation Succeeded';
  constructor(public payload: CopyConfigurationToNewCalculationResponseDto) {}
}
