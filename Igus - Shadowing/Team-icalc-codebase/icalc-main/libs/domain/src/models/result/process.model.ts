import type {
  ChainflexCable,
  IcalcMetaData,
  IcalcValidationError,
  WorkStepType,
  ProcessedMat017Item,
  Mat017ItemChange,
  ConfigurationWithChangedMat017ItemOverrides,
} from '../../models';

export interface DiscountsBasedOnRiskFactors {
  chainflexDiscount: number;
  mat017ItemDiscount: number;
  workStepDiscount: number;
}

export interface PreparedExcelFileData<T> {
  data: T;
  fileName: string;
}

export interface ChainflexPriceDeviation {
  sccId: string;
  configurationMatNumber: string;
  partNumber: string;
  chainflexLength: number;
  batchSize: number;
  oldCFPrice?: number;
  newCFPrice?: number;
  priceUpdateable?: boolean;
  priceAvailable?: boolean;
}

export interface ConfigurationWithMat017ItemsChanges
  extends Omit<ConfigurationWithChangedMat017ItemOverrides, 'mat017ItemsChanges'> {
  assignments: number;
  mat017ItemsChanges: Mat017ItemsChange[];
}

export interface Mat017ItemsChange extends Omit<Mat017ItemChange, 'currentOverrides' | 'newOverrides'> {
  newPrice: number;
  oldPrice: number;
  mat017ItemGroup: string;
}

export interface ChainflexPriceDeviationContainer {
  configurationMatNumber: string;
  chainflexPriceDeviations: ChainflexPriceDeviation[];
}

export interface ExcelProcessResult {
  configurationReference: ConfigurationReference;
  workSteps: ProcessResultWorkStepItem[];
}

export interface ConfigurationReference {
  configurationId: string;
  matNumber: string;
  description: string;
  isValid: boolean;
  validationErrors: IcalcValidationError[];
  sccId: string;
}

// RESULT
export interface ProcessResult {
  configurationReference: ConfigurationReference;
  batchSize: number;
  chainflexLength: number;
  discounts: DiscountsBasedOnRiskFactors;
  metaData?: IcalcMetaData;
  chainflex?: ChainflexCable;
  leftMat017ItemList?: ProcessedMat017Item[];
  rightMat017ItemList?: ProcessedMat017Item[];
  workSteps?: ProcessResultWorkStepItem[];
  quantitiesWithoutOverrides?: { [key in WorkStepType]?: number };
  lumpSum?: number;
}

export interface ProcessManyResult {
  calculationTotalPrice: number;
  processResults: ProcessResult[];
  allResultsValid: boolean;
}

export interface ProcessResultWorkStepItem {
  name: WorkStepType;
  price: number;
  quantity: number;
  sellingPricePerUnit?: number; // price multiplied by calculation factor
  sellingPrice?: number; // sellingPricePerUnit multiplied by amount
}

export interface IcalcHTTPError {
  headers: {
    normalizedNames: unknown;
    lazyUpdate: boolean;
  };
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string[];
    stack: string;
  };
}
export type ExcelFormatType = 'xls' | 'xlsx' | 'pdf';

export enum FileFormatEnum {
  xls = 'xls',
  xlsx = 'xlsx',
  pdf = 'pdf',
}

export enum FileVersionEnum {
  full = 'full',
  partial = 'partial',
}

export enum CalculationLockActionEnum {
  productionPlanExcelDownloaded = 'productionPlanExcelDownloaded',
  calculationExcelDownloaded = 'calculationExcelDownloaded',
}

export enum FileDownloadButtonsActionEnum {
  fullXLSX = 'fullXLSX',
  fullXLS = 'fullXLS',
  fullPDF = 'fullPDF',
  partialPDF = 'partialPDF',
}

export interface FileDownloadOptions {
  format: FileFormatEnum;
  version: FileVersionEnum;
}

export const fileDownloadOptions: { [key: string]: FileDownloadOptions } = {
  [FileDownloadButtonsActionEnum.fullXLSX]: {
    format: FileFormatEnum.xlsx,
    version: FileVersionEnum.full,
  },

  [FileDownloadButtonsActionEnum.fullXLS]: {
    format: FileFormatEnum.xls,
    version: FileVersionEnum.full,
  },
  [FileDownloadButtonsActionEnum.fullPDF]: {
    format: FileFormatEnum.pdf,
    version: FileVersionEnum.full,
  },
  [FileDownloadButtonsActionEnum.partialPDF]: {
    format: FileFormatEnum.pdf,
    version: FileVersionEnum.partial,
  },
};
