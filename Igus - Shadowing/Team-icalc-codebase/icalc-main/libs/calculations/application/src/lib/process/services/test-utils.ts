import type {
  Calculation,
  CalculationConfigurationStatus,
  ConfigurationStatus,
  Configuration,
  SingleCableCalculation,
} from '@igus/icalc-domain';
import { ProcessService } from './process.service';
import type { CalculationDataAccessService } from '@igus/icalc-calculations-infrastructure';
import type { ConfigurationService } from '@igus/icalc-configurations-application';
import type { StatusService } from '../../single-cable-calculation';

/**
 * mockProcessService
 *
 * @param queryCalculationByIdReturn existing calculation
 * @param findConfigurationByIdReturn configuration test object
 * @param findCalculationConfigurationStatusByIdsReturn calculationConfigurationStatus test object
 * @param status status of configuration
 * @returns mocked ProcessService instance
 */
export const mockProcessService = (
  queryCalculationByIdReturn: Calculation | null,
  findConfigurationByIdReturn: Configuration | null,
  findCalculationConfigurationStatusByIdsReturn: CalculationConfigurationStatus,
  status?: ConfigurationStatus | string
): ProcessService => {
  if (status) {
    findCalculationConfigurationStatusByIdsReturn = {
      ...findCalculationConfigurationStatusByIdsReturn,
      status,
    } as CalculationConfigurationStatus;
  }
  return new ProcessService(
    {
      queryCalculationById: () => Promise.resolve(queryCalculationByIdReturn),
    } as unknown as CalculationDataAccessService,
    { findConfigurationById: () => Promise.resolve(findConfigurationByIdReturn) } as unknown as ConfigurationService,
    {
      findCalculationConfigurationStatusByIds: () => Promise.resolve(findCalculationConfigurationStatusByIdsReturn),
    } as unknown as StatusService
  );
};

export const overwriteConfigurationInSCC = (
  scc: SingleCableCalculation,
  configuration: Configuration
): SingleCableCalculation => {
  scc.configuration = configuration;
  return scc;
};
