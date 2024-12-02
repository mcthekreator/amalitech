import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import { Mat017ItemStatus } from '../../models';
import type { Mat017ItemSearchResult, IcalcListResult } from '../../models';

const getMat017ItemResponse: IcalcListResult<Mat017ItemSearchResult> = {
  data: [
    {
      amountDividedByPriceUnit: 1.34,
      id: 'e5e77c19-456a-4370-a328-b3eab8b5be6f',
      itemDescription1: 'TestDescription 1',
      itemDescription2: 'TestDescription 2',
      mat017ItemGroup: 'RC-K3',
      matNumber: 'MAT0170815',
      score: 26,
      supplierItemNumber: 'TestSupplierItemNumber',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.03,
      id: '5871aae5-242c-4822-ab0a-9a5586172149',
      itemDescription1: 'Kabelmarkierer',
      itemDescription2: 'für Thermotransferdrucker KMT-07332V-9',
      mat017ItemGroup: 'RC-K8',
      matNumber: 'MAT0172105',
      score: 45,
      supplierItemNumber: 'KRT2-SP-032x73/18-WE',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.49,
      id: '9fa7cb17-ad04-48c5-bded-6f6d9440fee3',
      itemDescription1: 'Einsatz, Buchse SUB-D',
      itemDescription2: 'löt, HD 15polig',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT0173031',
      score: 29,
      supplierItemNumber: 'CT09-15S',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 1.14,
      id: 'e5e77c19-456a-4370-a328-b3eab8b5be6f',
      itemDescription1: 'Gehäuse, SUB-D',
      itemDescription2: 'metallisiert, 9pol. 31,8*31,2mm',
      mat017ItemGroup: 'RC-K3',
      matNumber: 'MAT0177743',
      score: 26,
      supplierItemNumber: 'FKH1A',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.42,
      id: '0b9a0fe6-7f90-4e42-b740-c71f0748011f',
      itemDescription1: 'siehe MAT0170182',
      itemDescription2: 'löt, 15 pol. Gr.2, HD',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT01712102',
      score: 26,
      supplierItemNumber: 'CT09-15P',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 1.38,
      id: '3ab6b75d-720b-40db-b369-1e770c19c478',
      itemDescription1: 'Gehäuse, SUB-D',
      itemDescription2: 'Metall, gerade, 9pol',
      mat017ItemGroup: 'RC-K3',
      matNumber: 'MAT0170191',
      score: 17,
      supplierItemNumber: 'FMK1G',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 1.63,
      id: 'e0d39ed5-9246-4571-b30f-80b44973953d',
      itemDescription1: 'Gehäuse, SUB-D',
      itemDescription2: 'Metall, gerade,15pol',
      mat017ItemGroup: 'RC-K3',
      matNumber: 'MAT0170172',
      score: 16,
      supplierItemNumber: 'FMK2G',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.39,
      id: '83021032-9e28-4453-99ac-ae45eb2843b1',
      itemDescription1: 'Einsatz, Stift SUB-D',
      itemDescription2: 'löt, 15 pol. Gr.1, HD',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT0170182',
      score: 15,
      supplierItemNumber: 'CT0915P',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.42,
      id: '77d422bd-df00-47fd-813f-446d80f8304c',
      itemDescription1: 'siehe MAT0173031',
      itemDescription2: 'löt, 15 pol. Gr.1 , HD',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT01712106',
      score: 13,
      supplierItemNumber: 'CT09-15S',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.11,
      id: '72b6aa31-a3e6-42a1-8197-6e0b873bd499',
      itemDescription1: 'Rändelschraube',
      itemDescription2: 'FRS 1/5, UNC 4-40, Ges.L=44mm',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT0172621',
      score: 13,
      supplierItemNumber: 'FRS 1/5',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 1.09,
      id: '3608cd43-0846-4f65-826a-4d6ccd18ed7f',
      itemDescription1: 'siehe MAT0177743',
      itemDescription2: 'Kunststoffhaube metallisiert, Schraubver',
      mat017ItemGroup: 'RC-K3',
      matNumber: 'MAT01712037',
      score: 13,
      supplierItemNumber: 'FKH1A',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.38,
      id: '5e317a47-1b44-4d78-8b74-21508894c4b2',
      itemDescription1: 'Einsatz, Stift SUB-D',
      itemDescription2: 'crimp, 15 pol. Gr.2',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT0170640',
      score: 12,
      supplierItemNumber: 'FL15P7-K120',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.04,
      id: '72efb4f2-18e8-46a3-abf2-a51fe5799927',
      itemDescription1: 'Bandware Kontakt, Stift',
      itemDescription2: '0,08-0,22mm²(AWG24-28),0,8µ,Au, VPE10000',
      mat017ItemGroup: 'RC-K6',
      matNumber: 'MAT01718034',
      score: 10,
      supplierItemNumber: 'P7LR26-K176-V2',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.2,
      id: 'e979b536-cac9-4048-87e3-fc3398652e02',
      itemDescription1: 'Rändelschraube',
      itemDescription2: '4-40 UNC 22,5mm',
      mat017ItemGroup: 'RC-K11',
      matNumber: 'MAT01712227',
      score: 9,
      supplierItemNumber: 'FRS1/5-K364',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.59,
      id: '9ffec994-2e63-40bd-8e22-edd9839f5e58',
      itemDescription1: 'Einsatz, Stift SUB-D',
      itemDescription2: 'löt, 9pol',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT0170183',
      score: 9,
      supplierItemNumber: 'F09P0G2-2090',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.1,
      id: '8f5ac964-962d-4cad-bc96-47defc35bd4c',
      itemDescription1: 'Einlegemutter 4-40',
      itemDescription2: 'F52M122M100+S',
      mat017ItemGroup: 'RC-K11',
      matNumber: 'MAT01717181',
      score: 7,
      supplierItemNumber: 'F52M122M100+S',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.38,
      id: 'df30f5dd-035e-4256-8084-c3719be29e5f',
      itemDescription1: 'Einsatz, Buchse SUB-D',
      itemDescription2: 'crimp, 15 pol. Gr.2',
      mat017ItemGroup: 'RC-K5',
      matNumber: 'MAT0170639',
      score: 6,
      supplierItemNumber: 'FL15S7-K121',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 8.35,
      id: '610b0c2e-002f-4e68-80a6-9736b9be58ed',
      itemDescription1: 'Stecker, Rundverbinder',
      itemDescription2: 'Buchse, 12pol. ÜWM',
      mat017ItemGroup: 'RC-K2',
      matNumber: 'MAT0178198',
      score: 6,
      supplierItemNumber: 'HR10A-10P-12S(73)',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 0.25,
      id: 'ae7c6cf3-6f9d-482d-8f30-bdf915b94222',
      itemDescription1: 'Sechskantbolzen',
      itemDescription2: '4-40 UNC Mutter, 12,7mm Gewinde 4-40 UNC',
      mat017ItemGroup: 'RC-K11',
      matNumber: 'MAT01717453',
      score: 5,
      supplierItemNumber: 'F-GSCH1/5-K130SN',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
    {
      amountDividedByPriceUnit: 4.1,
      id: 'f26962d2-5012-4971-981b-7a8160b6267d',
      itemDescription1: 'Steckverbinder',
      itemDescription2: '14pol  MCVW1,5/14-ST-3,81',
      mat017ItemGroup: 'RC-K11',
      matNumber: 'MAT01716578',
      score: 5,
      supplierItemNumber: '1827091',
      supplierId: 'TestSupplierId',
      itemStatus: Mat017ItemStatus.active,
    },
  ],
  listParameter: {},
  totalCount: 20,
};

/**
 * createGetMat017Response creates a IcalcListResult<Mat017Item>
 *
 * @param override pass any needed overrides for the requested IcalcListResult<Mat017Item>
 * @returns IcalcListResult<Mat017Item>
 */
export const createGetMat017Response = (
  override?: NestedPartial<IcalcListResult<Mat017ItemSearchResult>>
): IcalcListResult<Mat017ItemSearchResult> => {
  return mergePartially.deep(getMat017ItemResponse, override);
};
