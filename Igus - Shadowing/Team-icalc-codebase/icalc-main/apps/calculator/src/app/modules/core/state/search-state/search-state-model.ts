import type {
  CalculationSearchResult,
  ConfigurationSearchResult,
  IcalcCalculationOperands,
  IcalcHTTPError,
  IcalcListInformation,
  IcalcMetaData,
} from '@igus/icalc-domain';

export interface FilterCalculationsRequestParams {
  calculationListOperands: IcalcCalculationOperands;
  calculationListInformation: IcalcListInformation;
  calculationListFilter: Partial<IcalcMetaData>;
}

export const defaultConfigurationListInformation = {
  orderDirection: 'asc',
  search: '',
  skip: 0,
  take: 100,
  orderBy: 'matNumber',
} as IcalcListInformation;

export const defaultCalculationListInformation = {
  orderDirection: 'asc',
  search: '',
  skip: 0,
  take: 100,
  orderBy: 'calculationNumber',
} as IcalcListInformation;

export interface SearchStateModel {
  configurationListInformation: IcalcListInformation;
  configurationListFilter: Partial<IcalcMetaData>;
  configurationListOperands: IcalcCalculationOperands;
  configurationTotalCount: number;
  configurationItems: ConfigurationSearchResult[];
  isLoadingConfigurationItems: boolean;
  noConfigurationItemsFound: boolean;
  configurationSearchError: IcalcHTTPError;

  calculationListInformation: IcalcListInformation;
  calculationListFilter: Partial<IcalcMetaData>;
  calculationListOperands: IcalcCalculationOperands;
  calculationTotalCount: number;
  calculationItems: CalculationSearchResult[];
  isLoadingCalculationItems: boolean;
  isLoadingCalculationItem: boolean;
  noCalculationItemsFound: boolean;
  calculationSearchError: IcalcHTTPError;
}
