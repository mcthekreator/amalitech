import type { CopyConfigurationToExistingCalculationRequestDto } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type =
    '[CopyConfigurationToExistingCalculationDialog] CopyingConfigurationToExistingCalculation Submitted';

  constructor(public payload: CopyConfigurationToExistingCalculationRequestDto) {}
}
