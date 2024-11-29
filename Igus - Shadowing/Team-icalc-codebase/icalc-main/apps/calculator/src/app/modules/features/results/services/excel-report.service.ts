import { Injectable } from '@angular/core';
import type {
  PreparedExcelFileData,
  CreateExcelProductionPlanFileRequestDto,
  IcalcLocale,
  CreateExcelCalculationFileRequestDto,
  FileDownloadOptions,
} from '@igus/icalc-domain';
import { TranslateService } from '@ngx-translate/core';
import { ProcessDataForExcelExport } from '../../../core/state/process-state/process-state.model';

@Injectable({
  providedIn: 'root',
})
export class ExcelReportService {
  public locale: IcalcLocale;
  constructor(private readonly translate: TranslateService) {
    this.locale = 'de_DE';
  }

  public prepareExcelCalculationAndFileName(
    { selectedCalculationItem, processResults, relatedSingleCableCalculations }: ProcessDataForExcelExport,
    fileDownloadOptions: FileDownloadOptions
  ): PreparedExcelFileData<CreateExcelCalculationFileRequestDto> {
    const fileName = `${selectedCalculationItem?.calculationNumber}.${fileDownloadOptions.format}`;

    const data: CreateExcelCalculationFileRequestDto = {
      calculationId: selectedCalculationItem.id,
      customerType:
        selectedCalculationItem?.customerType === 'betriebsMittler'
          ? this.translate.instant('icalc.meta_data.CUSTOMER-BETRIEBSMITTLER')
          : this.translate.instant('icalc.meta_data.CUSTOMER-SERIAL-CUSTOMER'),
      customerTypeEnum: selectedCalculationItem.customerType,
      processResults: processResults.map(({ configurationReference, workSteps }) => ({
        configurationReference,
        workSteps,
      })),
      singleCableCalculationIds: relatedSingleCableCalculations.map((scc) => scc.id),
      locale: this.locale,
      fileDownloadOptions,
    };

    return { data, fileName };
  }

  public async prepareCreateExcelProductionPlanFileDtoAndFileName(
    { selectedCalculationItem, relatedSingleCableCalculations }: ProcessDataForExcelExport,
    fileDownloadOptions: FileDownloadOptions
  ): Promise<PreparedExcelFileData<CreateExcelProductionPlanFileRequestDto>> {
    const fileName = `${selectedCalculationItem?.calculationNumber}_${this.translate.instant(
      'icalc.results.mat-plans'
    )}_${fileDownloadOptions.format.toUpperCase()}.zip`;

    const singleCableCalculationIds = relatedSingleCableCalculations.map((scc) => scc.id);

    const data: CreateExcelProductionPlanFileRequestDto = {
      singleCableCalculationIds,
      locale: this.locale,
      fileDownloadOptions,
    };

    return { data, fileName };
  }
}
