/* eslint-disable @typescript-eslint/naming-convention */
import { mergePartially } from 'merge-partially';
import { type ConfigurationReference, type ProcessResult } from '../../models';

const processResult: ProcessResult = {
  chainflex: {
    description: {
      de_DE: 'chainflex® TPE Steuer-Ltg. (12x0,14)C',
      en_US: 'chainflex® TPE control cable CF10',
    },
    id: '36ca00f9-b72a-462f-b635-9eafd74a5d59',
    cableStructure: {
      de_DE: '(12x0,14)C',
      en_US: '12 x 26 AWG (0.14)',
    },
    cableStructureInformation: {
      isValid: true,
      structure: [
        {
          color: {
            cssClassName: 'white',
            translateKey: 'CORE_DESC_WH',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'brown',
            translateKey: 'CORE_DESC_BN',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'green',
            translateKey: 'CORE_DESC_GN',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'yellow',
            translateKey: 'CORE_DESC_YE',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'gray',
            translateKey: 'CORE_DESC_GY',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'pink',
            translateKey: 'CORE_DESC_PK',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'blue',
            translateKey: 'CORE_DESC_BU',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'red',
            translateKey: 'CORE_DESC_RD',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'black',
            translateKey: 'CORE_DESC_BK',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'violet',
            translateKey: 'CORE_DESC_VT',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'grayPink',
            translateKey: 'CORE_DESC_GYPK',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          color: {
            cssClassName: 'redBlue',
            translateKey: 'CORE_DESC_RDBU',
          },
          thickness: 0.14,
          type: 'core',
        },
        {
          description: 'SH0',
          horizontalOrder: 3,
          shieldedItemCount: 12,
          type: 'shield',
        },
      ],
      validationErrors: [],
    },
    nominalCrossSection: {
      de_DE: '0,14',
      en_US: 'AWG26',
    },
    numberOfCores: '12',
    outerDiameter: {
      amount: 7.5,
      unit: 'MILLIMETER',
    },
    outerJacket: {
      de_DE: 'TPE',
      en_US: 'no data',
    },
    innerJacket: {
      de_DE: 'Den Anforderungen in e-ketten angepasste TPE-Mischung',
      en_US: 'no data',
    },
    overallShield: true,
    partNumber: 'CF10.01.12',
    price: {
      germanListPrice: 1.62,
      id: '71a29ead-79c2-477f-a074-22e39709be17',
      partNumber: 'CF10.01.12',
    },
    sellingPrice: 1.62,
    sellingPricePerUnit: 1.62,
    shopImageUrl:
      'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
    ul: false,
  },
  batchSize: 1,
  discounts: {
    chainflexDiscount: 1,
    mat017ItemDiscount: 1.18496,
    workStepDiscount: 1.058,
  },
  chainflexLength: 1,
  leftMat017ItemList: [
    {
      id: 'e5e77c19-456a-4370-a328-b3eab8b5be6f',
      matNumber: 'MAT0177743',
      quantity: 1,
      sellingPrice: 1.14,
      sellingPricePerUnit: 1.14,
      amountDividedByPriceUnit: 1.14,
    },
  ],
  lumpSum: 29.61,
  configurationReference: {
    isValid: true,
    configurationId: 'c9b39293-84b4-48c3-a6dc-5cbd50d6ac03',
    matNumber: 'integration-MAT001',
  } as ConfigurationReference,
  quantitiesWithoutOverrides: {
    auftragsmanagement: 1,
    consignment: 1,
    crimp: 0,
    cutOver20MM: 0,
    cutUnder20MM: 1,
    drillingSealInsert: 0,
    einkaufDispo: 1,
    labeling: 0,
    package: 1,
    projektierung: 1,
    sendTestReport: 0,
    shieldHandling: 0,
    skinning: 1,
    strip: 1,
    test: 1,
    testFieldPrep: 1,
    transportStock: 1,
  },
  rightMat017ItemList: [],
  workSteps: [
    {
      name: 'projektierung',
      price: 5.63,
      quantity: 1,
      sellingPrice: 5.63,
      sellingPricePerUnit: 5.63,
    },
    {
      name: 'auftragsmanagement',
      price: 3.38,
      quantity: 1,
      sellingPrice: 3.38,
      sellingPricePerUnit: 3.38,
    },
    {
      name: 'einkaufDispo',
      price: 2.25,
      quantity: 1,
      sellingPrice: 2.25,
      sellingPricePerUnit: 2.25,
    },
    {
      name: 'transportStock',
      price: 2.25,
      quantity: 1,
      sellingPrice: 2.25,
      sellingPricePerUnit: 2.25,
    },
    {
      name: 'consignment',
      price: 0.11,
      quantity: 1,
      sellingPrice: 0.11,
      sellingPricePerUnit: 0.11,
    },
    {
      name: 'strip',
      price: 2.81,
      quantity: 1,
      sellingPrice: 2.81,
      sellingPricePerUnit: 2.81,
    },
    {
      name: 'shieldHandling',
      price: 3.38,
      quantity: 0,
      sellingPrice: 0,
      sellingPricePerUnit: 3.38,
    },
    {
      name: 'skinning',
      price: 0.28,
      quantity: 1,
      sellingPrice: 0.28,
      sellingPricePerUnit: 0.28,
    },
    {
      name: 'crimp',
      price: 0.56,
      quantity: 0,
      sellingPrice: 0,
      sellingPricePerUnit: 0.56,
    },
    {
      name: 'labeling',
      price: 2.25,
      quantity: 0,
      sellingPrice: 0,
      sellingPricePerUnit: 2.25,
    },
    {
      name: 'drillingSealInsert',
      price: 45,
      quantity: 0,
      sellingPrice: 0,
      sellingPricePerUnit: 45,
    },
    {
      name: 'test',
      price: 5.63,
      quantity: 1,
      sellingPrice: 5.63,
      sellingPricePerUnit: 5.63,
    },
    {
      name: 'sendTestReport',
      price: 1.13,
      quantity: 0,
      sellingPrice: 0,
      sellingPricePerUnit: 1.13,
    },
    {
      name: 'cutUnder20MM',
      price: 1.69,
      quantity: 1,
      sellingPrice: 1.69,
      sellingPricePerUnit: 1.69,
    },
    {
      name: 'cutOver20MM',
      price: 2.25,
      quantity: 0,
      sellingPrice: 0,
      sellingPricePerUnit: 2.25,
    },
    {
      name: 'testFieldPrep',
      price: 1.69,
      quantity: 1,
      sellingPrice: 1.69,
      sellingPricePerUnit: 1.69,
    },
    {
      name: 'package',
      price: 1.13,
      quantity: 1,
      sellingPrice: 1.13,
      sellingPricePerUnit: 1.13,
    },
  ],
};

export const createProcessResult = (override?: Partial<ProcessResult>): Partial<ProcessResult> => {
  return mergePartially.shallow(processResult, override);
};
