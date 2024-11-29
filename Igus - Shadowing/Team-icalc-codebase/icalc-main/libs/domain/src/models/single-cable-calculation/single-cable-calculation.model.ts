import type { Calculation, CalculationPresentation } from '../calculation';
import type { ChainflexPrice } from '../chainflex';
import type {
  CalculationConfigurationApprovalStatus,
  Configuration,
  ConfigurationConnectorStatePresentation,
  ConfigurationPresentation,
} from '../configuration';
import type {
  ConfigurationSnapshot,
  ConfigurationSnapshotPresentation,
} from '../configuration-snapshot/configuration-snapshot.model';
import type { IcalcUser } from '../user/user.model';

export interface SelectedSingleCableCalculation
  extends Omit<SingleCableCalculationPresentation, 'configuration' | 'calculation' | 'assignedBy' | 'snapshot'> {
  assignedBy: string;
}
export interface SaveSingleCableCalculationResult {
  singleCableCalculation: SingleCableCalculation;
  calculationConfigurationStatus: {
    hasApprovalBeenRevoked: boolean;
  };
}

export interface SingleCableCalculationPriceUpdateReference {
  singleCableCalculationId: string;
  configurationId?: string;
  priceDeviationDetected?: boolean;
  priceObjectUpdated?: boolean;
  oldPriceObject?: ChainflexPrice;
  newPriceObject?: ChainflexPrice;
  priceAvailable?: boolean;
  partNumber?: string;
  incomplete?: boolean;
}

export interface CheckForNewChainflexPricesResult {
  chainflexPricesHaveChanged: boolean;
  chainflexesAndPricesAvailable: boolean;
  singleCableCalculationPriceUpdateReferences: SingleCableCalculationPriceUpdateReference[];
}

export interface UpdateChainflexPricesResult {
  singleCableCalculationPriceUpdateReferences: SingleCableCalculationPriceUpdateReference[];
}

export interface UpdateMat017ItemPricesResult {
  configurations: ConfigurationWithUpdatedMat017ItemPrices[];
}

export interface ConfigurationWithUpdatedMat017ItemPrices {
  configurationId: string;
  matNumber: string;
  connectorState: ConfigurationConnectorStatePresentation;
  calculationConfigurationStatus: CalculationConfigurationApprovalStatus;
}

export interface RemoveChainflexDataResult {
  savedSingleCableCalculations: SaveSingleCableCalculationResult[];
}

export interface SingleCableCalculationBaseData {
  batchSize: number;
  chainflexLength: number;
}

export interface SelectedSCCCalculationFactorAndConfigurationDescription {
  calculationFactor: number;
  description: string;
}

export interface CommercialWorkStepOverrides {
  projektierung?: number;
  auftragsmanagement?: number;
  einkaufDispo?: number;
  transportStock?: number;
}

export interface SingleCableCalculation extends SingleCableCalculationBaseData {
  id: string;
  calculationFactor?: number;
  configuration?: Configuration;
  calculation: Calculation;
  assignedBy: IcalcUser;
  assignmentDate: Date;
  commercialWorkStepOverrides: CommercialWorkStepOverrides;
  snapshot?: ConfigurationSnapshot;
  calculationId?: string;
  configurationId?: string;
  snapshotId?: string;
}

export interface SCCWithNewConfiguration extends Partial<SingleCableCalculationBaseData> {
  matNumber?: string;
  labelingLeft?: string;
  labelingRight?: string;
  description?: string;
}

export interface SingleCableCalculationPresentation
  extends Omit<SingleCableCalculation, 'calculation' | 'configuration' | 'snapshot'> {
  calculation?: CalculationPresentation;
  configuration?: ConfigurationPresentation;
  snapshot?: ConfigurationSnapshotPresentation;
  matNumber?: string;
  calculationNumber?: string;
}
