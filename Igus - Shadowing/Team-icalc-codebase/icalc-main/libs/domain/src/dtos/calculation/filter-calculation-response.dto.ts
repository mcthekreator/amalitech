import type { CalculationPresentation, IcalcListResult } from '../../models';

export interface CalculationSearchResult
  extends Omit<
    CalculationPresentation,
    'singleCableCalculations' | 'calculationExcelDownloaded' | 'productionPlanExcelDownloaded'
  > {
  matNumbers: string[];
}

export type FilterCalculationResponseDto = IcalcListResult<CalculationSearchResult>;
