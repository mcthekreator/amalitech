import type { WorkStepPrices } from '../configuration';
import type { CommercialWorkStepOverrides } from '../single-cable-calculation';

export interface WorkStepQuantitiesWithOverrides {
  quantitiesWithoutOverrides: { [key in WorkStepType]?: number };
  quantitiesWithOverrides: { [key in WorkStepType]?: number } & WorkStepQuantities & CommercialWorkStepOverrides;
}

export type CommercialWorkStepType = 'projektierung' | 'auftragsmanagement' | 'einkaufDispo' | 'transportStock';

export type TechnicalWorkStepType =
  | 'consignment'
  | 'stripOuterJacket'
  | 'stripInnerJacket'
  | 'shieldHandlingOuterShield'
  | 'shieldHandlingInnerShield'
  | 'stripShieldHandling'
  | 'assembly'
  | 'strip'
  | 'shieldHandling'
  | 'skinning'
  | 'crimp'
  | 'labeling'
  | 'drillingSealInsert'
  | 'test'
  | 'sendTestReport'
  | 'cutUnder20MM'
  | 'cutOver20MM'
  | 'testFieldPrep'
  | 'package';

export type WorkStepType = CommercialWorkStepType | TechnicalWorkStepType;

export enum WorkStepSet {
  standard = 'standard',
  driveCliq = 'driveCliq',
  machineLine = 'machineLine',
  ethernet = 'ethernet',
}

export const isWorkStepSet = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return Object.values(WorkStepSet).includes(value as WorkStepSet);
  }
  return false;
};

export enum WorkStepCategory {
  commercial = 'commercial',
  technical = 'technical',
}

export enum WorkStepName {
  projektierung = 'projektierung', // Projektierung
  auftragsmanagement = 'auftragsmanagement', // Auftragsmanagement
  einkaufDispo = 'einkaufDispo', // Einkauf / Dispo
  transportStock = 'transportStock', // Interner Transport / Lagerung
  consignment = 'consignment', // Kommissionierung
  stripOuterJacket = 'stripOuterJacket', // Abmanteln Aussenmantel
  stripInnerJacket = 'stripInnerJacket', // Abmanteln Innenmantel
  shieldHandlingOuterShield = 'shieldHandlingOuterShield', // Schirmbehandlung Aussenschirm
  shieldHandlingInnerShield = 'shieldHandlingInnerShield', // Schirmbehandlung Innenschirm
  stripShieldHandling = 'stripShieldHandling', // Abmanteln /Schirmbehandlung
  assembly = 'assembly', // Anschluss / Montage
  strip = 'strip', // Abmanteln
  shieldHandling = 'shieldHandling', // Schirmbehandlung
  skinning = 'skinning', // Abisolieren
  crimp = 'crimp', // Anschluß Crimp
  labeling = 'labeling', // Beschriftung
  drillingSealInsert = 'drillingSealInsert', // Bohren Dichteinsatz
  test = 'test', // Funktionsprüfung
  sendTestReport = 'sendTestReport', // Prüfprotokolle mitverschicken
  cutUnder20MM = 'cutUnder20MM', // Schnittkosten für Leitungen bis 20mm
  cutOver20MM = 'cutOver20MM', // Schnittkosten für Leitungen ab 20mm
  testFieldPrep = 'testFieldPrep', // Prüffeld-Vorbereitung
  package = 'package', // Verpackung
}

/**
 * WorkStepQuantity contains quantities for each step of a calculation
 */

export interface WorkStepQuantities {
  projektierung?: number;
  auftragsmanagement?: number;
  einkaufDispo?: number;
  transportStock?: number;
  consignment?: number;
  stripOuterJacket?: number;
  stripInnerJacket?: number;
  shieldHandlingOuterShield?: number;
  shieldHandlingInnerShield?: number;
  stripShieldHandling?: number;
  assembly?: number;
  strip?: number;
  shieldHandling?: number;
  skinning?: number;
  crimp?: number;
  labeling?: number;
  drillingSealInsert?: number;
  test?: number;
  sendTestReport?: number;
  cutUnder20MM?: number;
  cutOver20MM?: number;
  testFieldPrep?: number;
  package?: number;
}

export const chainflexRelatedWorkStepNames = [
  'cutUnder20MM',
  'cutOver20MM',
  'strip',
  'shieldHandling',
  'skinning',
  'crimp',
  'test',
] as const;

export const defaultCommercialWorkStepNames = [
  'projektierung',
  'auftragsmanagement',
  'einkaufDispo',
  'transportStock',
] as const;

export const isCommercialWorkStepType = (step: WorkStepType): boolean => {
  return (
    step === 'projektierung' || step === 'auftragsmanagement' || step === 'einkaufDispo' || step === 'transportStock'
  );
};

export type CommercialWorkStepNames = (typeof defaultCommercialWorkStepNames)[number];

/**
 * defaultWorkSteps
 * -  defines an array of all possible work step items contained in a calculation
 * -  all work step items that depend on a customerType for the calculation of their price
 *    are given the price value for "serialCustomer" as a default
 * -  some of them have fixed values for quantity because they are required the same for every calculation
 */
export const defaultStandardWorkStepNames = [
  ...defaultCommercialWorkStepNames,
  'consignment',
  'strip',
  'shieldHandling',
  'skinning',
  'crimp',
  'labeling',
  'drillingSealInsert',
  'test',
  'sendTestReport',
  'cutUnder20MM',
  'cutOver20MM',
  'testFieldPrep',
  'package',
] as const;

export type StandardWorkStepNames = (typeof defaultStandardWorkStepNames)[number];

export const defaultDriveCliqWorkStepNames = [
  ...defaultCommercialWorkStepNames,
  'consignment',
  'stripShieldHandling',
  'assembly',
  'labeling',
  'drillingSealInsert',
  'test',
  'sendTestReport',
  'cutUnder20MM',
  'cutOver20MM',
  'testFieldPrep',
  'package',
] as const;

export type DriveCliqWorkStepNames = (typeof defaultDriveCliqWorkStepNames)[number];

export const defaultEthernetWorkStepNames = [
  ...defaultCommercialWorkStepNames,
  'consignment',
  'stripShieldHandling',
  'assembly',
  'labeling',
  'drillingSealInsert',
  'test',
  'sendTestReport',
  'cutUnder20MM',
  'cutOver20MM',
  'testFieldPrep',
  'package',
] as const;

export type EthernetWorkStepNames = (typeof defaultEthernetWorkStepNames)[number];

export const defaultMachineLineWorkStepNames = [
  ...defaultCommercialWorkStepNames,
  'consignment',
  'stripOuterJacket',
  'stripInnerJacket',
  'shieldHandlingOuterShield',
  'shieldHandlingInnerShield',
  'skinning',
  'crimp',
  'labeling',
  'drillingSealInsert',
  'test',
  'sendTestReport',
  'cutUnder20MM',
  'cutOver20MM',
  'testFieldPrep',
  'package',
] as const;

export type MachineLineWorkStepNames = (typeof defaultMachineLineWorkStepNames)[number];

export type CombinedWorkStepSetNames =
  | StandardWorkStepNames
  | DriveCliqWorkStepNames
  | MachineLineWorkStepNames
  | EthernetWorkStepNames;

export type WorkStepPricesValuesByWorkStepSet =
  | WorkStepPrices<StandardWorkStepNames>
  | WorkStepPrices<DriveCliqWorkStepNames>
  | WorkStepPrices<MachineLineWorkStepNames>
  | WorkStepPrices<EthernetWorkStepNames>;
