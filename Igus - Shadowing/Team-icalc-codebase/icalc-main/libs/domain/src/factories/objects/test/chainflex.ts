/* eslint-disable @typescript-eslint/naming-convention */
import type { ConfigurationChainFlexState, ChainflexCable } from '../../../models';
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';

export const innerJacket = {
  de_DE: 'Den Anforderungen in e-ketten angepasste TPE-Mischung',
  en_US: 'no data',
};
export const outerJacket = {
  de_DE: 'TPE',
  en_US: 'no data',
};
export const icalcTestChainflexStateWithValidChainflexCable: ConfigurationChainFlexState = {
  chainflexCable: {
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
    description: {
      de_DE: 'chainflex® TPE Steuer-Ltg. (12x0,14)C',
      en_US: 'chainflex® TPE control cable CF10',
    },
    id: '36ca00f9-b72a-462f-b635-9eafd74a5d59',
    nominalCrossSection: {
      de_DE: '0,14',
      en_US: 'AWG26',
    },
    numberOfCores: '12',
    outerDiameter: { amount: 7.5, unit: 'MILLIMETER' },
    outerJacket,
    innerJacket,
    overallShield: true,
    partNumber: 'CF10.01.12',
    price: { germanListPrice: 1.664, id: '71a29ead-79c2-477f-a074-22e39709be17', partNumber: 'CF10.01.12' },
    shopImageUrl:
      'https://igus.widen.net/content/lbpzzqri6a/jpeg/chainflex_CF10.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=gqh1pb',
    ul: false,
  },
};

export const createIcalcTestChainflexStateWithValidChainflex = (): ConfigurationChainFlexState => {
  return icalcTestChainflexStateWithValidChainflexCable;
};
export const createChainflexCable = (override?: NestedPartial<ChainflexCable>): ChainflexCable => {
  return mergePartially.deep(icalcTestChainflexStateWithValidChainflexCable.chainflexCable, override);
};
