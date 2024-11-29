import type { Calculation, IcalcListResult, FilterCalculationResponseDto } from '@igus/icalc-domain';
import { CalculationStatus, ObjectUtils } from '@igus/icalc-domain';

export const mapToFilterCalculationResponseDto = (
  result: IcalcListResult<Calculation>
): FilterCalculationResponseDto => {
  return {
    ...result,
    data: result.data.map((calc) => ({
      ...ObjectUtils.omitKeys(calc, [
        'status',
        'singleCableCalculations',
        'calculationExcelDownloaded',
        'productionPlanExcelDownloaded',
      ]),
      matNumbers: calc.singleCableCalculations.map(
        (value) => value.configuration?.matNumber || value.snapshot?.configurationData.matNumber
      ),
      isLocked: calc.status === CalculationStatus.locked,
    })),
  };
};
