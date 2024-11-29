import type { CreateNewConfigurationForExistingCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] CreatingNewConfigurationForExistingCalculation Succeeded';
  constructor(public payload: CreateNewConfigurationForExistingCalculationResponseDto) {}
}
