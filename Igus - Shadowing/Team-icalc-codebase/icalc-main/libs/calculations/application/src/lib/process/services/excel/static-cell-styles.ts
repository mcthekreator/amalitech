import type * as ExcelJS from 'exceljs';
import { WorkStepName } from '@igus/icalc-domain';

export const defaultFont: Partial<ExcelJS.Font> = { size: 8, name: 'Arial', family: 2 };
export const translationArticleFont: Partial<ExcelJS.Font> = { size: 8, name: 'Arial', color: { argb: 'FFC5C5C5' } };
const defaultAlignment: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle' };
// Gathered number formatting from original template
const defaultNumFmt = '_-* #,##0.00 [$€-1]_-;-* #,##0.00 [$€-1]_-;_-* "-"?? [$€-1]_-';
const defaultFill: ExcelJS.Fill = { type: 'pattern', pattern: 'none' };
const borderDotted: Partial<ExcelJS.Border> = { style: 'dotted', color: { argb: 'FF000000' } };

const getBorderByWorkStepName = (key: WorkStepName): Partial<ExcelJS.Borders> => {
  switch (key) {
    case WorkStepName.projektierung:
      return { top: borderDotted };
    case WorkStepName.transportStock:
      return { bottom: borderDotted };
    default:
      return {};
  }
};

export const configurationGesamtCellStyleAndFormat: Partial<ExcelJS.Style> = {
  font: defaultFont,
  numFmt: defaultNumFmt,
  border: { top: { style: 'thin', color: { argb: 'FF000000' } } },
};

export const getPriceCellStyleAndFormat = (key: WorkStepName): Partial<ExcelJS.Style> => {
  return {
    font: defaultFont,
    numFmt: defaultNumFmt,
    border: getBorderByWorkStepName(key),
    fill: defaultFill,
    alignment: defaultAlignment,
  };
};

export const getWorkStepQuantityCalculationFactorStyleAndFormat = (key: WorkStepName): Partial<ExcelJS.Style> => {
  return {
    font: defaultFont,
    border: getBorderByWorkStepName(key),
    fill: defaultFill,
    alignment: defaultAlignment,
  };
};

export const getWorkStepNameStyleAndFormat = (key: WorkStepName): Partial<ExcelJS.Style> => {
  return {
    font: defaultFont,
    border: getBorderByWorkStepName(key),
    fill: defaultFill,
    alignment: { horizontal: 'left', vertical: 'middle' },
  };
};

export const getDiscountStyleAndFormat = (key: WorkStepName): Partial<ExcelJS.Style> => {
  return {
    numFmt: '0.000',
    font: defaultFont,
    border: getBorderByWorkStepName(key),
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
    },
    alignment: defaultAlignment,
  };
};
