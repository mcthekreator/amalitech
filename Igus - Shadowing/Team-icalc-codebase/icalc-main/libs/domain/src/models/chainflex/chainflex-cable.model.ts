import type { CableStructureInformation, ChainflexPrice } from '../../models';

export type LocalizedStrings = Record<IcalcLocale, string>;

export type IcalcLocale = 'de_DE' | 'en_US';
export type OuterDiameterUnit = 'MILLIMETER' | 'no data';
export type CableStructure = LocalizedStrings;
export interface ChainflexCable {
  id: string;
  partNumber: string;
  description: LocalizedStrings;
  overallShield: boolean;
  outerJacket: LocalizedStrings;
  innerJacket: LocalizedStrings;
  numberOfCores: string;
  nominalCrossSection: LocalizedStrings;
  outerDiameter: OuterDiameter;
  cableStructure: CableStructure;
  shopImageUrl: string;
  ul: boolean;
  price: ChainflexPrice;
  cableStructureInformation: CableStructureInformation;
  // properties which can be filled by a calculation
  sellingPricePerUnit?: number; // price multiplied by calculation factor
  sellingPrice?: number; // sellingPricePerUnit multiplied by amount
}

export interface OuterDiameter {
  amount: number;
  unit: OuterDiameterUnit;
}
