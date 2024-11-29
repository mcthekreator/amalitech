import type {
  CalculationConfigurationApprovalStatusByConfigurationId,
  Configuration,
  ConfigurationsWithRemovedOverridesMap,
  Mat017ItemsBaseDataMap,
  SingleCableCalculation,
  SingleCableCalculationPresentation,
} from '../../models';

// ConnectorActionButtonsAction
export enum ConnectorActionButtonsAction {
  createMat017Items,
  selectConnectorSets,
  copyData,
}

// ConfigurationActionButtonsAction
export enum ConfigurationActionButtonsAction {
  removeConf,
  assignConf,
  startConf,
}

export enum CalculationStatus {
  inProgress = 'IN_PROGRESS',
  locked = 'LOCKED',
}

export enum CustomerTypeEnum {
  serialCustomer = 'serialCustomer',
  betriebsMittler = 'betriebsMittler',
}

export type RiskFactors = {
  defaultChainflexRiskFactor: number;
  defaultMat017ItemRiskFactor: number;
  defaultMat017ItemAndWorkStepRiskFactor: number;
};

export interface Calculation {
  id: string;
  calculationNumber: string;
  calculationFactor: number;
  customerType: CustomerTypeEnum;
  customer: string;
  quoteNumber: string;
  creationDate: Date;
  createdBy: string;
  modificationDate: Date;
  modifiedBy: string;
  productionPlanExcelDownloaded: boolean;
  calculationExcelDownloaded: boolean;
  singleCableCalculations: SingleCableCalculation[];
  status?: CalculationStatus;
  lockingDate?: Date;
  lockedBy?: string;
  mat017ItemRiskFactor?: number;
  mat017ItemAndWorkStepRiskFactor?: number;
}

export interface CalculationPresentation extends Omit<Calculation, 'status' | 'singleCableCalculations'> {
  isLocked: boolean;
  singleCableCalculations?: SingleCableCalculationPresentation[];
}

export type SelectedCalculation = Omit<CalculationPresentation, 'singleCableCalculations'>;

export interface UpdateCalculationData {
  id: string;
  calculationFactor?: number;
  batchSize?: number;
  chainflexLength?: number;
}

export interface UpdateCalculationWithSCC extends Partial<Omit<CalculationPresentation, 'singleCableCalculations'>> {
  singleCableCalculation?: UpdateCalculationData;
}

export interface CalculationOrderByColumns {
  calculationNumber: string;
  matNumber: string;
  labelingLeft: string;
  labelingRight: string;
  batchSize: string;
  calculationFactor: string;
  customerType: string;
  creationDate: string;
  createdBy: string;
  modificationDate: string;
  modifiedBy: string;
  lockingDate: string;
  lockedBy: string;
}

export enum Mat017ItemOverridesEnum {
  mat017ItemGroup = 'mat017ItemGroup',
  amountDividedByPriceUnit = 'amountDividedByPriceUnit',
}

export interface RemoveMat017ItemsInManyConfigurationsResult {
  configurations: Configuration[];
  mat017ItemBaseDataMap: Mat017ItemsBaseDataMap;
  resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId;
  configurationsWithRemovedOverrides: ConfigurationsWithRemovedOverridesMap;
}
