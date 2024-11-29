import type { SortDirection } from '@angular/material/sort';
export interface IcalcListResult<T> {
  data: T[];
  totalCount: number;
  listParameter: Partial<IcalcListInformation>;
}

export interface IcalcListInformation {
  search: string;
  take: number;
  skip: number;
  orderBy: string;
  orderDirection: SortDirection;
}

export const normalizeListInformation = (
  listInformation: IcalcListInformation | Partial<IcalcListInformation>
): IcalcListInformation | Partial<IcalcListInformation> => ({
  ...listInformation,
  skip: +(listInformation as IcalcListInformation)?.skip || 0,
  take: +(listInformation as IcalcListInformation)?.take || 50,
});

export const defaultIcalcListInformation: Partial<IcalcListInformation> = {
  orderDirection: 'desc',
  search: '',
  skip: 0,
  take: 100,
};

export interface ChainFlexParameter {
  partNumber: string;
  items: string[];
}

export interface Mat017ItemListFilter {
  showZeroMatches: boolean;
  showOnlyManuallyCreated: boolean;
}

export interface Mat017ItemListParameter
  extends Partial<IcalcListInformation>,
    ChainFlexParameter,
    Mat017ItemListFilter {}
