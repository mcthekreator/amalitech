import type { ConfigurationPresentation, IcalcListResult } from '../../models';

export interface ConfigurationSearchResult
  extends Omit<ConfigurationPresentation, 'singleCableCalculations' | 'state' | 'snapshots'> {
  calculationNumbers: string[];
}

export type FilterConfigurationResponseDto = IcalcListResult<ConfigurationSearchResult>;
