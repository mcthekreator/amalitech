export interface CreateMat017ItemManuallyRequestDto {
  matNumber: string;
  mat017ItemGroup: string;
  itemDescription1: string;
  itemDescription2?: string;
  supplierItemNumber: string;
  amount: number;
  priceUnit: PriceUnitCharCode;
}

export type CreateMat017ItemsManuallyRequestDto = CreateMat017ItemManuallyRequestDto[];

export type PriceUnitCharCode = 'S' | 'M' | 'H' | 'T';

export interface FindMat017ItemByMatNumberRequestDto {
  matNumber: string;
}
