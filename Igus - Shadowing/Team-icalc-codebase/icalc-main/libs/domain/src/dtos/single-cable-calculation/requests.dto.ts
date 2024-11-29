import type {
  CommercialWorkStepOverrides,
  ConfigurationConnectorStatePresentation,
  IcalcLibrary,
  SaveConfigurationData,
} from '../../models';

export interface SaveSnapshotRequestData {
  id: string;
  libraryState: IcalcLibrary;
  connectorState: ConfigurationConnectorStatePresentation;
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

export interface RemoveChainflexDataRequestDto {
  singleCableCalculationIds: string[];
}

export interface UpdateChainflexPricesRequestDto {
  singleCableCalculationIds: string[];
}

export interface CheckForNewChainflexPricesRequestDto {
  singleCableCalculationIds: string[];
}
