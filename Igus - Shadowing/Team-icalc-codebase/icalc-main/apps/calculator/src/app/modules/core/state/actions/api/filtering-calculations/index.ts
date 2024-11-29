import type { FilterCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] FilteringCalculations Succeeded';
  constructor(public payload: FilterCalculationResponseDto) {}
}

export class Failed {
  public static readonly type = '[Api] FilteringCalculations Failed';
  constructor(public payload: FilterCalculationResponseDto) {}
}
