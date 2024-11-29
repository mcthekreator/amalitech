import type { IcalcCalculationOperands, IcalcListInformation, IcalcMetaData } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[CalculationSearch] FilteringCalculations Submitted';
  constructor(
    public payload: {
      calculationListFilter?: Partial<IcalcMetaData>;
      calculationListOperands?: IcalcCalculationOperands;
      listInformation?: Partial<IcalcListInformation>;
    }
  ) {}
}
