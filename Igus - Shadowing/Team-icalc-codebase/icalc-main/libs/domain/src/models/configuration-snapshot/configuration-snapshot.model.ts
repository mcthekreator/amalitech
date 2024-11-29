import type { Configuration, ConfigurationSnapshotData, ConfigurationSnapshotPresentationData } from '../configuration';
import type { WorkStepPricesValuesByWorkStepSet } from '../result/work-step.model';
import type { SingleCableCalculation, SingleCableCalculationPresentation } from '../single-cable-calculation';
import type { PublicIcalcUser } from '../user';

export interface ConfigurationSnapshot {
  id: string;
  isSnapshotOf: string;
  workStepPrices: WorkStepPricesValuesByWorkStepSet;
  configurationMatNumber: string;
  configurationData: ConfigurationSnapshotData;
  creationDate: Date;
  modificationDate: Date;
  createdBy: PublicIcalcUser;
  modifiedBy: PublicIcalcUser;
  singleCableCalculation?: SingleCableCalculation;
  configurations?: Configuration;
}

export interface ConfigurationSnapshotPresentation
  extends Omit<ConfigurationSnapshot, 'singleCableCalculation' | 'configurationData'> {
  configurationData: ConfigurationSnapshotPresentationData;
  singleCableCalculation?: SingleCableCalculationPresentation;
  singleCableCalculations?: SingleCableCalculationPresentation[];
}

export type SelectedConfigurationSnapshot = ConfigurationSnapshotPresentation;
