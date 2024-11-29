import type { ConfigurationPresentation } from '../../models';

export type FindConfigurationResponseDto = Omit<
  ConfigurationPresentation,
  'singleCableCalculations' | 'state' | 'snapshots'
>;
