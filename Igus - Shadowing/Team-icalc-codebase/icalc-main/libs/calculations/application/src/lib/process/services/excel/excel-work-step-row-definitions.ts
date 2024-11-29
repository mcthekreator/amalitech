import type * as ExcelJS from 'exceljs';
import type { WorkStepName } from '@igus/icalc-domain';
import { WorkStepSet } from '@igus/icalc-domain';
import getWorkStepName from './get-work-step-article-template-description';
import {
  getDiscountStyleAndFormat,
  getPriceCellStyleAndFormat,
  getWorkStepNameStyleAndFormat,
  getWorkStepQuantityCalculationFactorStyleAndFormat,
} from './static-cell-styles';

export const calcFactorAndRiskFactorRow = 45;
export const configurationBatchSizeAndPosIndexRow = 47;
export const configurationDescriptionRow = 48;
export const quoteNumberRow = 3;
export const customerRow = 4;
export const configurationMatNumberAndTotalRow = 50;
export const configurationInfoOp2Row = 51;
export const configurationGesamtRow = 73;
export const configurationEndBorderRow = 74;

export interface StandardWorkStepStartingRows {
  projektierung: number;
  auftragsmanagement: number;
  einkaufDispo: number;
  transportStock: number;
  consignment: number;
  strip: number;
  skinning: number;
  crimp: number;
  shieldHandling: number;
  labeling: number;
  drillingSealInsert: number;
  test: number;
  sendTestReport: number;
  cutUnder20MM: number;
  cutOver20MM: number;
  testFieldPrep: number;
  package: number;
}

const standardWorkStepStartingRows: StandardWorkStepStartingRows = {
  projektierung: 55,
  auftragsmanagement: 56,
  einkaufDispo: 57,
  transportStock: 58,
  consignment: 59,
  strip: 60,
  shieldHandling: 61,
  skinning: 62,
  crimp: 63,
  labeling: 64,
  drillingSealInsert: 65,
  test: 66,
  sendTestReport: 67,
  cutUnder20MM: 68,
  cutOver20MM: 69,
  testFieldPrep: 70,
  package: 71,
};

export interface DriveCliqOrEthernetWorkStepSetStartingRows {
  projektierung: number;
  auftragsmanagement: number;
  einkaufDispo: number;
  transportStock: number;
  consignment: number;
  assembly: number;
  stripShieldHandling: number;
  labeling: number;
  drillingSealInsert: number;
  test: number;
  sendTestReport: number;
  cutUnder20MM: number;
  cutOver20MM: number;
  testFieldPrep: number;
  package: number;
}

const driveCliqOrEthernetWorkStepStartingRows: DriveCliqOrEthernetWorkStepSetStartingRows = {
  projektierung: 55,
  auftragsmanagement: 56,
  einkaufDispo: 57,
  transportStock: 58,
  consignment: 59,
  stripShieldHandling: 60,
  assembly: 61,
  labeling: 62,
  drillingSealInsert: 63,
  test: 64,
  sendTestReport: 65,
  cutUnder20MM: 66,
  cutOver20MM: 67,
  testFieldPrep: 68,
  package: 69,
};

export interface MachineLineWorkStepSetStartingRows {
  projektierung: number;
  auftragsmanagement: number;
  einkaufDispo: number;
  transportStock: number;
  consignment: number;
  stripOuterJacket: number;
  stripInnerJacket: number;
  shieldHandlingOuterShield: number;
  shieldHandlingInnerShield: number;
  skinning: number;
  crimp: number;
  labeling: number;
  drillingSealInsert: number;
  test: number;
  sendTestReport: number;
  cutUnder20MM: number;
  cutOver20MM: number;
  testFieldPrep: number;
  package: number;
}

const machineLineWorkStepStartingRows: MachineLineWorkStepSetStartingRows = {
  projektierung: 55,
  auftragsmanagement: 56,
  einkaufDispo: 57,
  transportStock: 58,
  consignment: 59,
  stripOuterJacket: 60,
  stripInnerJacket: 61,
  shieldHandlingOuterShield: 62,
  shieldHandlingInnerShield: 63,
  skinning: 64,
  crimp: 65,
  labeling: 66,
  drillingSealInsert: 67,
  test: 68,
  sendTestReport: 69,
  cutUnder20MM: 70,
  cutOver20MM: 71,
  testFieldPrep: 72,
  package: 73,
};

export interface StandardWorkStepCellDefinition<T> {
  projektierung: Partial<T>;
  auftragsmanagement: Partial<T>;
  einkaufDispo: Partial<T>;
  transportStock: Partial<T>;
  consignment: Partial<T>;
  strip: Partial<T>;
  shieldHandling: Partial<T>;
  skinning: Partial<T>;
  crimp: Partial<T>;
  labeling: Partial<T>;
  drillingSealInsert: Partial<T>;
  test: Partial<T>;
  sendTestReport: Partial<T>;
  cutUnder20MM: Partial<T>;
  cutOver20MM: Partial<T>;
  testFieldPrep: Partial<T>;
  package: Partial<T>;
}

type StandardWorkStepDefinitionWithoutStripAndShieldHandling<T> = Omit<
  StandardWorkStepCellDefinition<T>,
  'strip' | 'shieldHandling'
>;

export interface DriveCLiqOrEthernetWorkStepDefinition<T>
  extends StandardWorkStepDefinitionWithoutStripAndShieldHandling<T> {
  assembly: Partial<T>;
  stripShieldHandling: Partial<T>;
}

export interface MachineLineCliqWorkStepDefinition<T>
  extends StandardWorkStepDefinitionWithoutStripAndShieldHandling<T> {
  stripOuterJacket: Partial<T>;
  stripInnerJacket: Partial<T>;
  shieldHandlingOuterShield: Partial<T>;
  shieldHandlingInnerShield: Partial<T>;
}

export interface ExcelWorkStepRowDefinitions<Style, Value, Rows> {
  workStepNameStyles: Style;
  workStepQuantityStyles: Style;
  workStepCalculationFactorStyles: Style;
  workStepPriceStyles: Style;
  workStepDiscountStyles: Style;
  workStepName: Value;
  workStepPricePerPositionStyles: Style;
  workStepPriceAllPositionsStyles: Style;
  workStepStartingRows: Rows;
}

export const buildWorkStepRowDefinitions = <Style, Value, Rows>(
  sheet: ExcelJS.Worksheet,
  workStepSet: WorkStepSet
): ExcelWorkStepRowDefinitions<Partial<Style>, Partial<Value>, Partial<Rows>> => {
  // workSteps: get cell style templates
  let workStepStartingRows = {};

  switch (workStepSet) {
    case WorkStepSet.driveCliq:
      workStepStartingRows = driveCliqOrEthernetWorkStepStartingRows;
      break;
    case WorkStepSet.ethernet:
      workStepStartingRows = driveCliqOrEthernetWorkStepStartingRows;
      break;
    case WorkStepSet.machineLine:
      workStepStartingRows = machineLineWorkStepStartingRows;
      break;
    default:
      workStepStartingRows = standardWorkStepStartingRows;
      break;
  }

  const workStepNameStyles: Partial<Style> = {};
  const workStepPriceStyles: Partial<Style> = {};
  const workStepQuantityStyles: Partial<Style> = {};
  const workStepDiscountStyles: Partial<Style> = {};
  const workStepCalculationFactorStyles: Partial<Style> = {};
  const workStepPricePerPositionStyles: Partial<Style> = {};
  const workStepPriceAllPositionsStyles: Partial<Style> = {};
  const workStepName: Partial<Value> = {};

  Object.keys(workStepStartingRows).map((key: WorkStepName) => {
    // Cell format and style definition for price columns
    workStepPricePerPositionStyles[key] = getPriceCellStyleAndFormat(key);
    workStepPriceAllPositionsStyles[key] = getPriceCellStyleAndFormat(key);
    workStepNameStyles[key] = getWorkStepNameStyleAndFormat(key);
    workStepQuantityStyles[key] = getWorkStepQuantityCalculationFactorStyleAndFormat(key);
    workStepCalculationFactorStyles[key] = getWorkStepQuantityCalculationFactorStyleAndFormat(key);
    workStepPriceStyles[key] = getPriceCellStyleAndFormat(key);
    workStepDiscountStyles[key] = getDiscountStyleAndFormat(key);
    workStepName[key] = getWorkStepName(key);
  });

  return {
    workStepNameStyles,
    workStepQuantityStyles,
    workStepCalculationFactorStyles,
    workStepDiscountStyles,
    workStepPriceStyles,
    workStepName,
    workStepPricePerPositionStyles,
    workStepPriceAllPositionsStyles,
    workStepStartingRows,
  };
};
