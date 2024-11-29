import type { CreateCalculationAndConfigurationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] CreatingNewCalculationAndConfiguration Succeeded';
  constructor(public payload: CreateCalculationAndConfigurationResponseDto) {}
}
