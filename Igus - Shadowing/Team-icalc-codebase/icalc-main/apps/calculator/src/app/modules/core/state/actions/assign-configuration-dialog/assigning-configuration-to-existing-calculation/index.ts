import type { SingleCableCalculationBaseData } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[AssignConfigurationDialog] AssigningConfigurationToExistingCalculation Submitted';

  constructor(
    public payload: {
      reProcess?: boolean;
      configurationId?: string;
      singleCableCalculationBaseData?: SingleCableCalculationBaseData;
    }
  ) {}
}
