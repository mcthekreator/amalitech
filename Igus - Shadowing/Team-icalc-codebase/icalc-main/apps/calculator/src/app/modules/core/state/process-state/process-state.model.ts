import type {
  IcalcHTTPError,
  ProcessResult,
  WorkStepType,
  CalculationPresentation,
  SingleCableCalculationPresentation,
  ConfigurationSnapshotPresentation,
  ConfigurationPresentation,
  WorkStepName,
  CustomerTypeEnum,
  SaveSingleCableCalculationResponseDto,
  UpdateCalculationWithSCC,
  CreateExcelProductionPlanFileRequestDto,
  CheckForNewChainflexPricesResult,
  CreateExcelCalculationFileRequestDto,
  ProcessedMat017Item,
  Mat017ItemChangesInConfigurations,
  CalculationLockActionEnum,
  WidenData,
  ConfigurationConnectorStatePresentation,
} from '@igus/icalc-domain';

export interface UpdatingMetaDataPayload extends SaveSingleCableCalculationResponseDto {
  updatedCalculation: UpdateCalculationWithSCC;
}

export interface RemovingAllOverridesPayload {
  configurationId: string;
  singleCableCalculationId: string;
}

export interface SelectedCalculationRow {
  customer: string;
}

export interface SelectedConfigurationRow {
  id: string;
  matNumber: string;
  labelingLeft: string;
  labelingRight: string;
  description: string;
}

export type SelectingConfigurationFromConfigurationSearchPayload = {
  configurationId: string;
};

export interface SubmittingWorkStepsFormPayload {
  configurationId: string;
  overrides: { [key in WorkStepName]?: number };
  sccId?: string;
}

export interface UpdatingSingleCableCalculationDataPayload {
  calculationFactor?: number;
  description?: string;
}

export interface ExportingExcelFileSucceededPayload {
  productionPlanExcelDownloaded?: boolean;
  calculationExcelDownloaded?: boolean;
}

export interface ExcelRequestParams {
  apiPath: string;
  data: CreateExcelCalculationFileRequestDto | CreateExcelProductionPlanFileRequestDto;
  fileName: string;
  dispatchFlagUpdate?: CalculationLockActionEnum | void;
}

export interface RelatedCalculationItemSingleCableCalculationRef {
  id: string;
}

export type WorkStepOverridesEntityRecord = Partial<Record<WorkStepType, number>>;

export interface InformUserAboutWorkSteps {
  configurationId: string;
  matNumber: string;
  chainflexLength: number;
  batchSize: number;
  workStepTypes: WorkStepType[];
}

export interface ProcessDataForExcelExport {
  selectedCalculationItem: CalculationPresentation;
  selectedConfigurationItem: ConfigurationPresentation;
  selectedSnapshotItem: ConfigurationSnapshotPresentation;
  selectedSingleCableCalculation: SingleCableCalculationPresentation;
  processResults: ProcessResult[];
  relatedSingleCableCalculations: SingleCableCalculationPresentation[];
}

export interface IcalcStepsState {
  processResults: ProcessResult[];
  calculationTotalPrice: number;
  allResultsValid: boolean;
}

export interface EntityStateModel<T> {
  items: Record<string, T>;
  ids: string[];
}

export interface MetaDataViewModelCalculation {
  id: string;
  calculationFactor?: number;
  calculationNumber?: string;
  customer?: string;
  quoteNumber?: string;
  customerType?: CustomerTypeEnum;
  isLocked?: boolean;
}

export interface MetaDataViewModelConfiguration {
  id: string;
  matNumber?: string;
  labelingLeft?: string;
  labelingRight?: string;
  description?: string;
}

export interface DuplicateCalculationViewModel {
  newCalculationNumber: string;
  newQuoteNumber: string;
  newCustomer: string;
  singleCableCalculationIds: string[];
}

export interface MetaDataViewModelSingleCableCalculation {
  id: string;
  snapshotId?: string;
  batchSize?: number;
}

export interface MetaDataViewModel {
  selectedCalculationItem: MetaDataViewModelCalculation;
  selectedConfigurationItem: MetaDataViewModelConfiguration;
  selectedSingleCableCalculationItem: MetaDataViewModelSingleCableCalculation;
}

export interface ProcessEntitiesStateModel {
  calculations: EntityStateModel<CalculationUiEntity>;
  configurations: EntityStateModel<ConfigurationUiEntity>;
  singleCableCalculations: EntityStateModel<SingleCableCalculationUiEntity>;
  snapshots: EntityStateModel<SnapshotUiEntity>;
}

export interface ProcessStateModel extends IcalcStepsState {
  informUserAboutWorkSteps: InformUserAboutWorkSteps[];
  isProcessing: boolean;
  isSavingSingleCableCalculation: boolean;
  isLocked: boolean;
  mat017ItemsModification: Mat017ItemChangesInConfigurations;
  chainflexesAndPricesAvailable: boolean;
  chainflexPricesHaveChanged: boolean;
  checkForNewChainflexPricesResult: CheckForNewChainflexPricesResult;
  processServerError: IcalcHTTPError;
  selectedTabIndex: number;
  calculationIdForCreatingNewConfiguration: string;
  selectedSingleCableCalculationId: string;
  isSingleCableCalculationLoading: boolean;
  mat017ItemsLatestModificationDate: Date;
  entities: ProcessEntitiesStateModel;
  isExcelFileDownloading: boolean;
}

export interface SelectedProcessResultMat017Item extends ProcessedMat017Item {
  itemDescription1: string;
  itemDescription2: string;
}

export interface SelectedProcessResult extends Omit<ProcessResult, 'leftMat017ItemList' | 'rightMat017ItemList'> {
  leftMat017ItemList?: SelectedProcessResultMat017Item[];
  rightMat017ItemList?: SelectedProcessResultMat017Item[];
}

export interface BaseUiEntity {
  id: string;
}

export interface CalculationUiEntity extends Omit<CalculationPresentation, 'singleCableCalculations'> {
  singleCableCalculations: BaseUiEntity[];
}

export interface ConfigurationUiEntity extends Omit<ConfigurationPresentation, 'singleCableCalculations'> {
  singleCableCalculations: BaseUiEntity[];
}

export type SingleCableCalculationUiEntity = Omit<
  SingleCableCalculationPresentation,
  'configuration' | 'calculation' | 'snapshot'
>;

export interface SnapshotUiEntity extends Omit<ConfigurationSnapshotPresentation, 'singleCableCalculations'> {
  singleCableCalculations: BaseUiEntity[];
}

export interface FetchingImagesFromWidenPayload {
  widenData: WidenData;
  connectorState: ConfigurationConnectorStatePresentation;
  configurationId?: string;
  snapshotId?: string;
}
