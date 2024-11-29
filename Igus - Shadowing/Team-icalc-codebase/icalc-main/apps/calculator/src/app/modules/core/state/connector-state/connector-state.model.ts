import type {
  Mat017ItemSearchResult,
  IcalcListInformation,
  Favorites,
  Mat017ItemWithWidenData,
  Mat017ItemListFilter,
  ConnectorSide,
  Mat017ItemCreationData,
} from '@igus/icalc-domain';

import { ArrayUtils } from '@igus/icalc-domain';

export interface ConnectorStateModel {
  leftConnector: IcalcConnector;
  rightConnector: IcalcConnector;
}

export interface IcalcConnector {
  items: Mat017ItemWithWidenData[];
  mat017ItemListWithWidenData: Mat017ItemWithWidenData[];
  listResponseInformation: IcalcListResponseInformation;
  isLoading: boolean;
  addedMat017Items: { [id: string]: number };
  checkedMat017Items: { [id: string]: boolean };
  selectedTab: 'recommendations' | 'mat017ItemListWithWidenData';
  totalCount: number;
  listInformation: IcalcListInformation;
  filterInformation: Mat017ItemListFilter;
  favorites: Favorites[];
  favoritesLoaded: boolean;
  favoritesIsLoading: boolean;
}

export interface IcalcListResponseInformation {
  text: string;
  severity: 'warning' | 'error' | 'info';
}

export interface MatSuggestionLine {
  cfId: string;
  connectorSide: string;
  score: number;
  source: string;
  matId: string;
  bez1: string;
  bez2: string;
  gruppe: string;
  liefArtNum: string;
  ekPrice: string;
  priceUnit: string;
  quantityUnit: string;
  ekPriceProEinheit: string;
  quantity: number;
  green: boolean;
}

export interface MatLine {
  matId: string;
  bez1: string;
  bez2: string;
  gruppe: string;
  liefArtNum: string;
  ekPrice: string;
  priceUnit: string;
  quantityUnit: string;
  ekPriceProEinheit: string;
  quantity: number;
}

export interface CreatingMat017ItemsSubmittedPayload {
  mat017ItemsToCreate: Mat017ItemCreationData[];
  which: ConnectorSide;
}

export const createMat017ItemWithWidenDataStatus = (
  currentConnector: IcalcConnector,
  mat017Item: Mat017ItemSearchResult,
  which: ConnectorSide
): string => {
  return ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
    currentConnector.mat017ItemListWithWidenData
  ).findIndex((mat017ItemListWithWidenDataItem) => mat017Item.matNumber === mat017ItemListWithWidenDataItem.matNumber) >
    -1
    ? which === 'leftConnector'
      ? 'left'
      : 'right'
    : '';
};
