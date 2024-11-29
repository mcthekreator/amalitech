import type { SingleCableCalculationPresentation } from '../../models';

export type CopyConfigurationToNewCalculationResponseDto = Omit<SingleCableCalculationPresentation, 'snapshot'>;
