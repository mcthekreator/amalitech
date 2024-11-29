import type { CustomerTypeEnum, ExcelProcessResult, FileDownloadOptions, IcalcLocale } from '../../models';

export interface CreateExcelCalculationFileRequestDto {
  calculationId: string;
  customerType: string;
  customerTypeEnum: CustomerTypeEnum;
  processResults: ExcelProcessResult[];
  singleCableCalculationIds: string[];
  locale: IcalcLocale;
  fileDownloadOptions: FileDownloadOptions;
}

export interface CreateExcelProductionPlanFileRequestDto {
  singleCableCalculationIds: string[];
  locale: string;
  fileDownloadOptions: FileDownloadOptions;
}
