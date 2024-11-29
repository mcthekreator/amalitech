import type { IerpMat017Item, UnitId } from '../../models';
import { mergePartially } from 'merge-partially';

const ierpPrice = {
  matNumber: 'testMat017Number',
  quantityAmount: 0,
  priceUnit: 0,
  amount: 2,
  supplierItemNumber: 'testSupplierItemNumber',
  supplierId: 'testSupplierId',
  supplierName: 'testSupplierName',
  discountPercentage1: 1,
};

const defaultIerpMat017Item = {
  matNumber: ierpPrice.matNumber,
  itemDescription1De: 'testItemDescription1De',
  itemDescription2De: 'testItemDescription2De',
  itemDescription1En: 'testItemDescription1En',
  itemDescription2En: 'testItemDescription2En',
  mat017ItemGroup: 'testItemGroup',
  unitId: 'M' as UnitId,
  prices: [
    {
      ...ierpPrice,
    },
    {
      ...ierpPrice,
      quantityAmount: 100,
      priceUnit: 10,
      amount: 4,
    },
  ],
};

export const createIerpMat017Item = (override?: Partial<IerpMat017Item>): IerpMat017Item => {
  return mergePartially.deep(defaultIerpMat017Item, override);
};
