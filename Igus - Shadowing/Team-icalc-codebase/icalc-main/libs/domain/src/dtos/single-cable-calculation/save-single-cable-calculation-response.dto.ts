import type { CalculationPresentation, SingleCableCalculationPresentation } from '../../models';

export type CalculationResponseDto = Omit<CalculationPresentation, 'singleCableCalculations'>;

export interface SavedSingleCableCalculation extends Omit<SingleCableCalculationPresentation, 'calculation'> {
  calculation: CalculationResponseDto;
}

export interface SaveSingleCableCalculationResponseDto {
  singleCableCalculation: SavedSingleCableCalculation;
  calculationConfigurationStatus: { hasApprovalBeenRevoked: boolean };
}

export interface RemoveChainflexDataResponseDto {
  savedSingleCableCalculations: SaveSingleCableCalculationResponseDto[];
}
