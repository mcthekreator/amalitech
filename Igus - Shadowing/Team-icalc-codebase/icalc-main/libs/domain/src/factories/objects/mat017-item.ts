import { mergePartially } from 'merge-partially';
import type { Mat017Item } from '../../models';
import { Mat017ItemStatus } from '../../models';
import { ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '../../constants';

const defaultMat017ItemMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-MAT017-Default`;

const defaultMat017Item: Mat017Item = {
  id: 'uuid',
  supplierId: 'TestSupplierId',
  priceUnit: 100,
  amount: 10,
  itemStatus: Mat017ItemStatus.active,
  matNumber: defaultMat017ItemMatNumber,
  mat017ItemGroup: 'RC-K0815',
  itemDescription1: 'Schüttware Kontakt,Stift',
  itemDescription2: 'Crimp,1mm,Signal',
  supplierItemNumber: 'exampleSupplierItemNumber',
  amountDividedByPriceUnit: 0.1,
  manuallyCreated: false,
};

export const createMat017Item = (override?: Partial<Mat017Item>): Mat017Item => {
  return mergePartially.deep(defaultMat017Item, override);
};
