import type {
  CopyConfigurationToExistingCalculationRequestDto,
  CopyConfigurationToExistingCalculationResponseDto,
} from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] CopyingConfigurationToExistingCalculation Succeeded';
  constructor(public payload: CopyConfigurationToExistingCalculationResponseDto) {}
}

export class Validated {
  public static readonly type = '[Api] CopyingConfigurationToExistingCalculation Validated';
  constructor(public payload: CopyConfigurationToExistingCalculationRequestDto) {}
}

export class ValidationFailed {
  public static readonly type = '[Api] CopyingConfigurationToExistingCalculation ValidationFailed';
}

export class Failed {
  public static readonly type = '[Api] CopyingConfigurationToExistingCalculation Failed';
}
