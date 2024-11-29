export interface IerpSearchParams {
  pageNumber: number;
  pageSize: number;
}

export interface IerpPaginatedResult<T> extends IerpSearchParams {
  data: T[];
  previousPage?: string;
  nextPage?: string;
}

export type UnitId = 'Stk' | 'M';

export interface IerpMat017ItemUsage {
  partNumber: string;
  bomId: string;
  matNumber: string;
}

export interface IerpMat017ItemPrice {
  matNumber: string;
  quantityAmount: number;
  priceUnit: number;
  amount: number;
  supplierItemNumber: string;
  supplierId: string;
  supplierName: string;
  discountPercentage1: number;
}

export interface IerpMat017Item {
  matNumber: string;
  itemDescription1De: string;
  itemDescription2De: string;
  itemDescription1En: string;
  itemDescription2En: string;
  mat017ItemGroup: string;
  unitId: UnitId;
  prices: IerpMat017ItemPrice[];
}

export const getDefaultPurchasingPrice = (ierpMat017Item: IerpMat017Item): IerpMat017ItemPrice | undefined => {
  // The price with quantityAmount of 0 is considered the default price. There are also so called staggered prices
  // which are characterized by higher quantityAmounts.
  return ierpMat017Item.prices.find((p) => p.quantityAmount === 0);
};
