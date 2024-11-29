import type { IcalcCalculationOperands, IcalcListInformation, IcalcMetaData } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[ConfigurationSearch] FilteringConfigurations Submitted';
  constructor(
    public payload: {
      configurationListFilter?: Partial<IcalcMetaData>;
      configurationListOperands?: IcalcCalculationOperands;
      listInformation?: Partial<IcalcListInformation>;
    }
  ) {}
}
