import type {
  ActionModels,
  Calculation,
  ChainflexCable,
  ConfigurationSnapshot,
  CustomerTypeEnum,
  IcalcBridge,
  IcalcLibrary,
  Litze,
  SingleCableCalculation,
  SingleCableCalculationPresentation,
} from '../../models';
import type { WorkStepType } from '../../models/result/work-step.model';
import { WorkStepSet } from '../../models/result/work-step.model';
import type {
  Mat017Item,
  Mat017ItemOverrides,
  Mat017ItemRequiredOverrides,
  Mat017ItemStatus,
  Mat017ItemWithWidenData,
  RedactedMat017ItemWithWidenData,
} from '../../models/mat017-item';

export const WORK_STEP_QUANTITIES_RELATED_TO_META_DATA = [
  'projektierung',
  'auftragsmanagement',
  'einkaufDispo',
  'transportStock',
] as WorkStepType[];

export const WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS = [
  'testFieldPrep',
  'consignment',
  'labeling',
] as WorkStepType[];

export const WORK_STEP_QUANTITIES_RELATED_TO_CHAINFLEX = [
  'cutUnder20MM',
  'cutOver20MM',
  'strip',
  'shieldHandling',
  'stripShieldHandling',
  'stripInnerJacket',
  'stripOuterJacket',
  'shieldHandlingInnerShield',
  'shieldHandlingOuterShield',
  'assembly',
  'skinning',
  'crimp',
  'test',
] as WorkStepType[];

export const WORK_STEP_QUANTITIES_RELATED_TO_PIN_ASSIGNMENT = [
  'strip',
  'shieldHandling',
  'stripShieldHandling',
  'stripInnerJacket',
  'stripOuterJacket',
  'shieldHandlingInnerShield',
  'shieldHandlingOuterShield',
  'assembly',
  'skinning',
  'crimp',
  'test',
] as WorkStepType[];

export const defaultConfigurationState: Partial<ConfigurationState> = {
  workStepSet: WorkStepSet.standard,
};

export type WorkStepPrices<T extends string | number | symbol> = {
  [key in T]: { [customerType in CustomerTypeEnum]: number };
};

export type WorkStepOverrides = { [key in WorkStepType]?: number };

export interface UpdatedConfigurationResult {
  configurationId: string;
  matNumber: string;
  connectorState: ConfigurationConnectorStatePresentation;
  hasRemovedOverrides: boolean;
  removedOverrides: WorkStepType[];
  workStepOverrides: WorkStepOverrides;
  calculationConfigurationStatus?: CalculationConfigurationApprovalStatus;
}

export interface ConfigurationState {
  chainFlexState: ConfigurationChainFlexState;
  connectorState: ConfigurationConnectorState;
  libraryState: IcalcLibrary;
  pinAssignmentState: ConfigurationPinAssignmentState;
  workStepOverrides: WorkStepOverrides;
  workStepSet: WorkStepSet;
}
export interface ConfigurationPinAssignmentState {
  actionModels: ActionModels;
  bridges: { left: IcalcBridge[]; right: IcalcBridge[] };
  litze: Litze[];
  base64Image: string;
  chainFlexNumber: string;
}

export interface ConfigurationChainFlexState {
  chainflexCable: ChainflexCable;
}

export interface OneSideOfConfigurationConnector {
  mat017ItemListWithWidenData: RedactedMat017ItemWithWidenData[];
  addedMat017Items: { [id: string]: number };
}

export interface ConfigurationConnectorState {
  leftConnector: OneSideOfConfigurationConnector;
  rightConnector: OneSideOfConfigurationConnector;
}

export type ConfigurationSnapshotData = Omit<Configuration, 'singleCableCalculations'>;

export interface ConfigurationSnapshotPresentationData
  extends Omit<Configuration, 'singleCableCalculations' | 'checked' | 'state'> {
  state: ConfigurationStatePresentation;
}

export interface Configuration {
  id: string;
  matNumber: string;
  creationDate: Date;
  modificationDate: Date;
  createdBy: string;
  modifiedBy: string;
  partNumber: string;
  state: ConfigurationState;
  singleCableCalculations?: SingleCableCalculation[];
  isCopyOfConfigurationId?: string;
  snapshots?: ConfigurationSnapshot[];
  labelingLeft?: string;
  labelingRight?: string;
  description?: string;
}

export interface SaveConfigurationData {
  id: string;
  labelingLeft?: string;
  labelingRight?: string;
  description?: string;
  partNumber?: string;
  state?: Partial<ConfigurationStatePresentation>;
}

export interface SaveSnapshotData {
  id: string;
  libraryState: IcalcLibrary;
  connectorState: ConfigurationConnectorStatePresentation;
}

export interface SaveMat904Result {
  mat904: Configuration;
  calculationConfigurationStatus: {
    hasApprovalBeenRevoked: boolean;
  };
}

export interface CalculationConfigurationStatus {
  calculationId: string;
  calculation?: Calculation;
  configurationId: string;
  configuration?: Configuration;
  status: ConfigurationStatus;
  modificationDate: Date;
  modifiedBy: string;
}

export type CalculationConfigurationPresentationStatus = Omit<
  CalculationConfigurationStatus,
  'configuration' | 'calculation'
>;

export interface CalculationConfigurationApprovalStatus {
  hasApprovalBeenRevoked: boolean;
}

export interface CalculationConfigurationApprovalStatusReset extends CalculationConfigurationApprovalStatus {
  configurationId: string;
  hasApprovalBeenRevoked: boolean;
}

export type CalculationConfigurationApprovalStatusByConfigurationId = Map<
  string,
  CalculationConfigurationApprovalStatus
>;

export enum ConfigurationStatus {
  approved = 'APPROVED',
  notApproved = 'NOT_APPROVED',
}

export type SelectedConfiguration = Omit<ConfigurationPresentation, 'singleCableCalculations' | 'snapshots'>;

export interface ConfigurationPresentation
  extends Omit<Configuration, 'singleCableCalculations' | 'snapshots' | 'state'> {
  singleCableCalculations?: SingleCableCalculationPresentation[];
  state: ConfigurationStatePresentation;
}

export interface UpdateConfigurationResponseDto {
  description: string;
  modificationDate: Date;
  modifiedBy: string;
}

export interface OneSideOfConfigurationConnectorPresentation {
  mat017ItemListWithWidenData: Mat017ItemWithWidenData[];
  addedMat017Items: { [id: string]: number };
}
export interface ConfigurationConnectorStatePresentation {
  leftConnector: OneSideOfConfigurationConnectorPresentation;
  rightConnector: OneSideOfConfigurationConnectorPresentation;
}

export type ConnectorSide = keyof ConfigurationConnectorState;
export interface ConfigurationStatePresentation extends Omit<ConfigurationState, 'connectorState'> {
  connectorState: ConfigurationConnectorStatePresentation;
}

export type Mat017ItemOverridesChangesMap = Map<string, Partial<Mat017ItemOverrides>>;
export type Mat017ItemsBaseDataMap = Map<string, Mat017Item>;

export interface Mat017ItemOverridesUpdaterResult {
  mat017ItemListWithWidenData: RedactedMat017ItemWithWidenData[];
  mat017ItemOverridesChanges: Mat017ItemOverridesChangesMap;
}

export type UsedMat017Items = {
  usedInLibrary: Map<string, boolean>;
  usedInPinAssignment: Map<string, boolean>;
};

export interface Mat017ItemChange {
  matNumber: string;
  itemDescription1: string | null;
  itemDescription2: string | null;
  itemStatus: Mat017ItemStatus;
  usedInSketch: boolean;
  usedInPinAssignment: boolean;
  currentOverrides: Mat017ItemRequiredOverrides;
  newOverrides: Partial<Mat017ItemRequiredOverrides>;
}

export interface ConfigurationWithChangedMat017ItemOverrides {
  id: string;
  matNumber: string;
  mat017ItemsChanges: Mat017ItemChange[];
}

export interface Mat017ItemChangesInConfigurations {
  hasAmountDividedByPriceUnitChanged: boolean;
  hasInvalidOrRemovedItems: boolean;
  configurations: ConfigurationWithChangedMat017ItemOverrides[];
}

export type CompositeMat017ItemReturnType<T> = T extends ConfigurationPresentation
  ? Mat017ItemWithWidenData[]
  : RedactedMat017ItemWithWidenData[];

export type UpdateMat017ItemsOverridesResult = {
  updatedConfigurations: Configuration[];
  configurationsWithChangedMat017ItemGroups: string[];
  configurationsWithRemovedOverrides?: ConfigurationsWithRemovedOverridesMap;
};

export type ConfigurationsWithRemovedOverridesMap = Map<string, Array<WorkStepType>>;
export type ConfigurationsWithRemovedMat017ItemsMap = Map<string, boolean>;

export interface OneConfigurationWithRemovedMat017Items {
  configuration: Configuration;
  hasRemovedOverrides: boolean;
  hasRemovedMat017Items: boolean;
}
export type ConfigurationsWithRemovedMat017Items = {
  updatedConfigurations: OneConfigurationWithRemovedMat017Items[];
  configurationsWithRemovedMat017ItemsMap: ConfigurationsWithRemovedMat017ItemsMap;
  configurationsWithRemovedOverrides: ConfigurationsWithRemovedOverridesMap;
};

export type RemoveOverridesFromConfigurationResult = {
  workStepOverrides: WorkStepOverrides;
  removedOverrides: WorkStepType[];
};

export type RemoveMat017ItemsFromOneSideOfConnectorInConfigurationResult = {
  configuration: Configuration;
  removedFromAddedMat017Items: string[];
  removedOverrides: WorkStepType[];
};
