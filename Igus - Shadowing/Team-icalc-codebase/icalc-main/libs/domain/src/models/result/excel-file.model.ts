import { ArrayUtils } from '../../utils/array-utils';
import { ObjectUtils } from '../../utils/object-utils';
import type {
  ConfigurationChainFlexState,
  ConfigurationPresentation,
  ConfigurationSnapshotPresentationData,
} from '../configuration';
import type { Mat017ItemWithWidenData } from '../mat017-item';
import type { SingleCableCalculationPresentation } from '../single-cable-calculation';
import type {
  WorkStepPricesValuesByWorkStepSet,
  WorkStepQuantities,
  WorkStepSet,
  WorkStepType,
} from './work-step.model';

export abstract class BaseExcelFileMat017ItemList<T> {
  protected isLocked: boolean;
  protected configurationData: ConfigurationPresentation | ConfigurationSnapshotPresentationData;

  protected combinedMat017ItemList: Mat017ItemWithWidenData[] = [];

  protected constructor(scc: SingleCableCalculationPresentation) {
    this.setIsLocked(scc);
    this.setConfigurationData(scc);
    this.setMat017ItemList(this.configurationData);
  }

  public getData(): T {
    const mat017ItemCalculationExcelFields = this.getMat017ItemFields();

    const mappedMat017ItemList = this.combinedMat017ItemList.map((item) =>
      mat017ItemCalculationExcelFields.map((key) => ObjectUtils.getNestedValue(item, key) || 'no Data')
    );

    return mappedMat017ItemList as T;
  }

  private setIsLocked(scc: SingleCableCalculationPresentation): void {
    this.isLocked = scc.snapshotId !== null;
  }

  private setConfigurationData(scc: SingleCableCalculationPresentation): void {
    const data = this.isLocked ? scc.snapshot?.configurationData : scc.configuration;

    if (!data) {
      throw new Error('Either configuration or snapshot have to be defined.');
    }

    this.configurationData = data;
  }

  private setMat017ItemList(
    configurationData: ConfigurationPresentation | ConfigurationSnapshotPresentationData
  ): void {
    const leftConnectorMat017ItemList = ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
      configurationData.state?.connectorState?.leftConnector?.mat017ItemListWithWidenData
    );
    const rightConnectorMat017ItemList = ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
      configurationData.state?.connectorState?.rightConnector?.mat017ItemListWithWidenData
    );

    this.combinedMat017ItemList = [...leftConnectorMat017ItemList, ...rightConnectorMat017ItemList];
  }

  protected abstract getMat017ItemFields(): string[];
}

export class ExcelCalculationMat017ItemList extends BaseExcelFileMat017ItemList<ExcelConfigurationMat017ItemListData> {
  protected constructor(scc: SingleCableCalculationPresentation) {
    super(scc);
  }

  public static create(scc: SingleCableCalculationPresentation): ExcelCalculationMat017ItemList {
    return new ExcelCalculationMat017ItemList(scc);
  }

  protected getMat017ItemFields(): string[] {
    return this.isLocked
      ? [
          'matNumber',
          'overrides.itemDescription1',
          'overrides.itemDescription2',
          'overrides.mat017ItemGroup',
          'overrides.supplierItemNumber',
          'overrides.amountDividedByPriceUnit',
          'quantity',
        ]
      : [
          'matNumber',
          'itemDescription1',
          'itemDescription2',
          'overrides.mat017ItemGroup',
          'supplierItemNumber',
          'overrides.amountDividedByPriceUnit',
          'quantity',
        ];
  }
}

export class ExcelProductionPlanMat017ItemList extends BaseExcelFileMat017ItemList<ExcelProductionPlanMat017ItemListData> {
  protected constructor(scc: SingleCableCalculationPresentation) {
    super(scc);
  }

  public static create(scc: SingleCableCalculationPresentation): ExcelProductionPlanMat017ItemList {
    return new ExcelProductionPlanMat017ItemList(scc);
  }

  protected getMat017ItemFields(): string[] {
    return this.isLocked
      ? [
          'matNumber',
          'overrides.itemDescription1',
          'overrides.itemDescription2',
          'overrides.mat017ItemGroup',
          'overrides.supplierItemNumber',
          'quantity',
        ]
      : [
          'matNumber',
          'itemDescription1',
          'itemDescription2',
          'overrides.mat017ItemGroup',
          'supplierItemNumber',
          'quantity',
        ];
  }
}

export type ExcelProductionPlanMat017ItemListData = [string, string, string, string, string, number][];
export type ExcelConfigurationMat017ItemListData = [string, string, string, string, string, number, number][];

export interface ExcelConfiguration {
  batchSize: number;
  description: string | null;
  chainflexNumber: string | null;
  chainflexPrice: string;
  chainflexLength: number | null;
  chainflexOuterDiameter: number | null;
  workStepSet: WorkStepSet;
  chainFlexState: ConfigurationChainFlexState;
  workStepPrices?: WorkStepPricesValuesByWorkStepSet;
  chainflexCableStructure?: string;
  matNumber?: string;
  mat017ItemList: ExcelConfigurationMat017ItemListData;
  workStepQuantities: WorkStepQuantities;
  workStepOverrides?: { [key in WorkStepType]: number };
  calculationFactor?: number;
  configurationId?: string;
  snapshotId?: string;
}

export interface ExcelProductionPlans {
  productionPlans: ProductionPlan[];
}

export interface ProductionPlan {
  matNumber: string;
  chainflexNumber: string;
  chainflexOuterDiameter: string;
  chainflexCableStructure: string;
  mat017ItemList: [string, string, string, string, string, number][];
  libraryImage: string;
  libraryImageWidth: number;
  libraryImageHeight: number;
  pinAssignmentImageWidth: number;
  pinAssignmentImageHeight: number;
  pinAssignmentImage: string;
  labelingLeft: string;
  labelingRight: string;
  userName: string;
  creationDate: Date;
  modificationDate: Date;
}
