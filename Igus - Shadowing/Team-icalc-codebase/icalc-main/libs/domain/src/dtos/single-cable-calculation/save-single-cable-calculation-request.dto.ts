import type { SaveConfigurationData, IcalcLibrary, CommercialWorkStepOverrides } from '../../models';

export interface SaveSnapshotRequestData {
  id: string;
  libraryState: IcalcLibrary;
}

export interface SaveSingleCableCalculationRequestData {
  id: string;
  calculationFactor: number;
  batchSize: number;
  chainflexLength: number;
  assignedBy: string;
  assignmentDate: Date;
  commercialWorkStepOverrides: CommercialWorkStepOverrides;
  configuration?: SaveConfigurationData;
  snapshot?: SaveSnapshotRequestData;
}
