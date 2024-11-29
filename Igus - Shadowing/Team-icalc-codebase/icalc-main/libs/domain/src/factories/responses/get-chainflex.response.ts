/* eslint-disable @typescript-eslint/naming-convention */
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { IcalcListResult, ChainflexCable } from '../../models';
import { innerJacket, outerJacket } from '../objects';

const getChainflexResponse: IcalcListResult<ChainflexCable> = {
  data: [
    {
      description: {
        de_DE: 'chainflex® TPE Steuer-Ltg. (12x0,14)C',
        en_US: 'chainflex® TPE control cable CF10',
      },
      id: 'bba109af-737b-4420-91e0-8eb274add80f',
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
      outerJacket,
      innerJacket,
      overallShield: true,
      partNumber: 'CF10.01.12',
      price: {
        germanListPrice: 1.62155787,
        id: '3d669e2f-f859-47df-bae1-5525c8e6f0d8',
        partNumber: 'CF10.01.12',
      },
      shopImageUrl:
        'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
      ul: false,
    },
    {
      description: {
        de_DE: 'chainflex® TPE Steuer-Ltg. (18x0,14)C',
        en_US: 'chainflex® TPE control cable CF10',
      },
      id: 'faedf233-88ad-4da7-8e73-d313bd6ce2b9',
      cableStructure: {
        de_DE: '(18x0,14)C',
        en_US: '18 x 26 AWG (0.14)',
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
            color: {
              cssClassName: 'whiteGreen',
              translateKey: 'CORE_DESC_WHGN',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'brownGreen',
              translateKey: 'CORE_DESC_BNGN',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'whiteYellow',
              translateKey: 'CORE_DESC_WHYE',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'yellowBrown',
              translateKey: 'CORE_DESC_YEBN',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'whiteGray',
              translateKey: 'CORE_DESC_WHGY',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'grayBrown',
              translateKey: 'CORE_DESC_GYBN',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            description: 'SH0',
            horizontalOrder: 3,
            shieldedItemCount: 18,
            type: 'shield',
          },
        ],
        validationErrors: [],
      },
      nominalCrossSection: {
        de_DE: '0,14',
        en_US: 'AWG26',
      },
      numberOfCores: '18',
      outerDiameter: {
        amount: 9.5,
        unit: 'MILLIMETER',
      },
      outerJacket,
      innerJacket,
      overallShield: true,
      partNumber: 'CF10.01.18',
      price: {
        germanListPrice: 2.268571429,
        id: '6fede539-bb6a-4443-819f-b91cd62ee84b',
        partNumber: 'CF10.01.18',
      },
      shopImageUrl:
        'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
      ul: false,
    },
    {
      description: {
        de_DE: 'chainflex® TPE Steuer-Ltg. (4x0,25)C',
        en_US: 'chainflex® TPE control cable CF10',
      },
      id: 'd75d2573-89f4-4bab-bba1-0bc78c74c482',
      cableStructure: {
        de_DE: '(4x0,25)C',
        en_US: '4 x 24 AWG (0.25)',
      },
      cableStructureInformation: {
        isValid: true,
        structure: [
          {
            color: {
              cssClassName: 'white',
              translateKey: 'CORE_DESC_WH',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'brown',
              translateKey: 'CORE_DESC_BN',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'green',
              translateKey: 'CORE_DESC_GN',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'yellow',
              translateKey: 'CORE_DESC_YE',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            description: 'SH0',
            horizontalOrder: 3,
            shieldedItemCount: 4,
            type: 'shield',
          },
        ],
        validationErrors: [],
      },
      nominalCrossSection: {
        de_DE: '0,25',
        en_US: 'AWG24',
      },
      numberOfCores: '4',
      outerDiameter: {
        amount: 6.5,
        unit: 'MILLIMETER',
      },
      outerJacket,
      innerJacket,
      overallShield: true,
      partNumber: 'CF10.02.04',
      price: {
        germanListPrice: 0.963428571,
        id: '803c8a63-d503-4984-8f5c-72062359a4b9',
        partNumber: 'CF10.02.04',
      },
      shopImageUrl:
        'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
      ul: false,
    },
    {
      description: {
        de_DE: 'chainflex® TPE Steuer-Ltg. (8x0,25)C',
        en_US: 'chainflex® TPE control cable CF10',
      },
      id: 'ebd5489f-6a24-460b-bb18-2fa83638680a',
      cableStructure: {
        de_DE: '(8x0,25)C',
        en_US: '8 x 24 AWG (0.25)',
      },
      cableStructureInformation: {
        isValid: true,
        structure: [
          {
            color: {
              cssClassName: 'white',
              translateKey: 'CORE_DESC_WH',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'brown',
              translateKey: 'CORE_DESC_BN',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'green',
              translateKey: 'CORE_DESC_GN',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'yellow',
              translateKey: 'CORE_DESC_YE',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'gray',
              translateKey: 'CORE_DESC_GY',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'pink',
              translateKey: 'CORE_DESC_PK',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'blue',
              translateKey: 'CORE_DESC_BU',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'red',
              translateKey: 'CORE_DESC_RD',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            description: 'SH0',
            horizontalOrder: 3,
            shieldedItemCount: 8,
            type: 'shield',
          },
        ],
        validationErrors: [],
      },
      nominalCrossSection: {
        de_DE: '0,25',
        en_US: 'AWG24',
      },
      numberOfCores: '8',
      outerDiameter: {
        amount: 8,
        unit: 'MILLIMETER',
      },
      outerJacket,
      innerJacket,
      overallShield: true,
      partNumber: 'CF10.02.08',
      price: {
        germanListPrice: 1.41745583,
        id: '4d2fc8c1-4eb7-41d5-8743-91e13d515039',
        partNumber: 'CF10.02.08',
      },
      shopImageUrl:
        'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
      ul: false,
    },
    {
      description: {
        de_DE: 'chainflex® TPE Steuer-Ltg. (12x0,25)C',
        en_US: 'chainflex® TPE control cable CF10',
      },
      id: '0081dfab-3ff7-4347-921e-5ee41d0c021e',
      cableStructure: {
        de_DE: '(12x0,25)C',
        en_US: '12 x 24 AWG (0.25)',
      },
      cableStructureInformation: {
        isValid: true,
        structure: [
          {
            color: {
              cssClassName: 'white',
              translateKey: 'CORE_DESC_WH',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'brown',
              translateKey: 'CORE_DESC_BN',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'green',
              translateKey: 'CORE_DESC_GN',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'yellow',
              translateKey: 'CORE_DESC_YE',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'gray',
              translateKey: 'CORE_DESC_GY',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'pink',
              translateKey: 'CORE_DESC_PK',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'blue',
              translateKey: 'CORE_DESC_BU',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'red',
              translateKey: 'CORE_DESC_RD',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'black',
              translateKey: 'CORE_DESC_BK',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'violet',
              translateKey: 'CORE_DESC_VT',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'grayPink',
              translateKey: 'CORE_DESC_GYPK',
            },
            thickness: 0.25,
            type: 'core',
          },
          {
            color: {
              cssClassName: 'redBlue',
              translateKey: 'CORE_DESC_RDBU',
            },
            thickness: 0.25,
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
        de_DE: '0,25',
        en_US: 'AWG24',
      },
      numberOfCores: '12',
      outerDiameter: {
        amount: 9.5,
        unit: 'MILLIMETER',
      },
      outerJacket,
      innerJacket,
      overallShield: true,
      partNumber: 'CF10.02.12',
      price: {
        germanListPrice: 2.054496951,
        id: '69481b25-4397-48e1-8be9-3dcc086fd977',
        partNumber: 'CF10.02.12',
      },
      shopImageUrl:
        'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
      ul: false,
    },
  ],
  listParameter: {
    orderBy: 'partNumber',
    orderDirection: 'asc',
    search: '',
    skip: 0,
    take: 100,
  },
  totalCount: 5,
};

/**
 * createGetChainflexResponse creates a IcalcListResult<ChainflexCable>
 *
 * @param override pass any needed overrides for the requested IcalcListResult<ChainflexCable>
 * @returns IcalcListResult<ChainflexCable>
 */
export const createGetChainflexResponse = (
  override?: NestedPartial<IcalcListResult<ChainflexCable>>
): IcalcListResult<ChainflexCable> => {
  return mergePartially.deep(getChainflexResponse, override);
};
