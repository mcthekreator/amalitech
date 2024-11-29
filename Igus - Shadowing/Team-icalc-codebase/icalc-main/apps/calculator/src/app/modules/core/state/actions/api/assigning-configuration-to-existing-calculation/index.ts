import type { AssignConfigurationToExistingCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] AssigningConfigurationToExistingCalculation Succeeded';
  constructor(public payload: AssignConfigurationToExistingCalculationResponseDto) {}
}
