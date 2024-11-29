import { omitCommercialWorkSteps } from '@igus/icalc-common';
import type {
  ChainflexCable,
  CustomerTypeEnum,
  Configuration,
  ConfigurationConnectorState,
  ProcessResult,
  ProcessResultWorkStepItem,
  WorkStepType,
  CommercialWorkStepOverrides,
  DiscountsBasedOnRiskFactors,
  WorkStepQuantitiesWithOverrides,
  CombinedWorkStepSetNames,
  WorkStepPricesValuesByWorkStepSet,
  RedactedMat017ItemWithWidenData,
  ProcessedMat017Item,
  ActionModels,
  ConfigurationState,
} from '@igus/icalc-domain';
import {
  defaultStandardWorkStepNames,
  defaultDriveCliqWorkStepNames,
  WorkStepSet,
  defaultMachineLineWorkStepNames,
  defaultEthernetWorkStepNames,
  areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide,
  getMatNumbersOfMat017ItemsFromActionModelsOnSide,
} from '@igus/icalc-domain';
import { ArrayUtils, NumberUtils } from '@igus/icalc-utils';

import {
  BatchSizeQuantities,
  CommonQuantities,
  ChainflexCableQuantities,
  Mat017ItemsQuantities,
  PinAssignmentQuantities,
} from './work-step-quantities-builders';

export class CalculationConfigurationProcessor {
  constructor(
    private readonly configuration: Configuration,
    private readonly batchSize: number,
    private readonly chainflexLength: number,
    private readonly commercialWorkStepOverrides: CommercialWorkStepOverrides,
    private readonly customerType: CustomerTypeEnum,
    private readonly discounts: DiscountsBasedOnRiskFactors,
    private readonly calculationFactor: number,
    private readonly workStepPrices: WorkStepPricesValuesByWorkStepSet,
    private readonly workStepSet: WorkStepSet
  ) {}

  public static create(
    configuration: Configuration,
    batchSize: number,
    chainflexLength: number,
    commercialWorkStepOverrides: CommercialWorkStepOverrides,
    customerType: CustomerTypeEnum,
    discounts: DiscountsBasedOnRiskFactors,
    calculationFactor: number,
    workStepPrices: WorkStepPricesValuesByWorkStepSet,
    workStepSet: WorkStepSet
  ): CalculationConfigurationProcessor {
    return new CalculationConfigurationProcessor(
      configuration,
      batchSize,
      chainflexLength,
      commercialWorkStepOverrides,
      customerType,
      discounts,
      calculationFactor,
      workStepPrices,
      workStepSet
    );
  }

  public process(): ProcessResult {
    if (!this.isProcessable()) {
      throw new Error(`${this.configuration.matNumber} is unprocessable`);
    }

    let lumpSum = 0;

    const chainflexCable = this.configuration.state?.chainFlexState.chainflexCable;
    const chainflexLength = this.chainflexLength;

    const chainflex = this.calculateChainflex(
      chainflexCable,
      chainflexLength,
      this.discounts?.chainflexDiscount,
      this.calculationFactor
    );

    lumpSum = lumpSum + (chainflex.sellingPrice as number);

    const { leftMat017ItemList, rightMat017ItemList, matListLumpSumResult } = this.calculateMat017Items(
      this.configuration.state?.connectorState,
      this.discounts?.mat017ItemDiscount,
      this.calculationFactor
    );

    lumpSum = lumpSum + matListLumpSumResult;

    const { quantitiesWithOverrides, quantitiesWithoutOverrides } = this.getWorkStepQuantitiesWithOverrides(
      this.configuration,
      this.commercialWorkStepOverrides
    );

    const workStepPricesResult = this.getWorkStepPrices(
      this.customerType,
      this.discounts?.workStepDiscount,
      this.calculationFactor,
      quantitiesWithOverrides,
      this.workStepSet
    );

    lumpSum =
      lumpSum + workStepPricesResult.map((item) => item.sellingPrice).reduce((previous, next) => previous + next, 0);

    const { matNumber, id, description } = this.configuration;

    const configurationReference = { matNumber, configurationId: id, isValid: true, description };

    return {
      configurationReference,
      batchSize: this.batchSize,
      discounts: this.discounts,
      chainflex,
      chainflexLength,
      leftMat017ItemList,
      rightMat017ItemList,
      lumpSum,
      quantitiesWithoutOverrides,
      workSteps: workStepPricesResult,
    } as ProcessResult;
  }

  public isProcessable(): boolean {
    return !this.isUnprocessable();
  }

  private isUnprocessable(): boolean {
    const configurationState = this.configuration?.state;
    const chainflexCable = configurationState?.chainFlexState?.chainflexCable;
    const leftConnector = configurationState?.connectorState?.leftConnector;
    const actionModels = configurationState?.pinAssignmentState?.actionModels;

    return (
      !this.configuration ||
      !this.configuration?.matNumber ||
      !this.configuration?.partNumber ||
      !configurationState ||
      !chainflexCable ||
      !leftConnector ||
      ArrayUtils.isEmpty(leftConnector?.mat017ItemListWithWidenData) ||
      !actionModels ||
      !this.isLibraryValid(configurationState) ||
      !this.isActionModelValid(actionModels, chainflexCable)
    );
  }

  private isLibraryValid(configurationState: ConfigurationState): boolean {
    if (!configurationState?.libraryState) return true;
    return (
      areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(
        configurationState?.libraryState?.imageList
          .filter((image) => image.side === 'left')
          .map((image) => image.matNumber),
        this.configuration,
        'left'
      ) &&
      areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(
        configurationState?.libraryState?.imageList
          .filter((image) => image.side === 'right')
          .map((image) => image.matNumber),
        this.configuration,
        'right'
      )
    );
  }

  private isActionModelValid(actionModels: ActionModels, chainflexCable: ChainflexCable): boolean {
    const chainflexCableStructure = chainflexCable?.cableStructureInformation?.structure;

    if (!chainflexCableStructure || !actionModels || ArrayUtils.isEmpty(Object.keys(actionModels))) return false;
    return (
      areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(
        getMatNumbersOfMat017ItemsFromActionModelsOnSide(actionModels, chainflexCableStructure, 'left'),
        this.configuration,
        'left'
      ) &&
      areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(
        getMatNumbersOfMat017ItemsFromActionModelsOnSide(actionModels, chainflexCableStructure, 'right'),
        this.configuration,
        'right'
      )
    );
  }

  private calculateChainflex(
    chainflexCable: ChainflexCable,
    chainflexLength: number,
    riskFactor: number,
    calculationFactor: number
  ): ChainflexCable {
    const germanListPrice = chainflexCable?.price?.germanListPrice;
    // rounding should take place in two setps here (see ICALC-680)
    const sellingPricePerUnit = NumberUtils.round(germanListPrice * riskFactor * calculationFactor); // once when price is multiplied by risk factor & calculation factor (done here)
    const sellingPrice = NumberUtils.round(sellingPricePerUnit * chainflexLength); // and once when the result (sellingPricePerUnit) is multiplied by length (done here)

    return {
      ...chainflexCable,
      sellingPricePerUnit,
      sellingPrice,
    };
  }

  private calculateMat017Items(
    state: ConfigurationConnectorState,
    riskFactor: number,
    calculationFactor: number
  ): {
    leftMat017ItemList: ProcessedMat017Item[];
    rightMat017ItemList: ProcessedMat017Item[];
    matListLumpSumResult: number;
  } {
    const leftItemQuantities = state?.leftConnector?.addedMat017Items ?? {};
    const leftMat017ItemList: ProcessedMat017Item[] = ArrayUtils.fallBackToEmptyArray<RedactedMat017ItemWithWidenData>(
      state?.leftConnector?.mat017ItemListWithWidenData
    ).map((mat017ItemWithWidenData) => {
      const quantity = leftItemQuantities[mat017ItemWithWidenData.matNumber] ?? 0;

      return this.calculateMat017Item(mat017ItemWithWidenData, riskFactor, calculationFactor, quantity);
    });

    const rightItemQuantities = state?.rightConnector?.addedMat017Items;
    const rightMat017ItemList: ProcessedMat017Item[] = ArrayUtils.fallBackToEmptyArray<RedactedMat017ItemWithWidenData>(
      state?.rightConnector?.mat017ItemListWithWidenData
    ).map((mat017ItemWithWidenData) => {
      const quantity = rightItemQuantities[mat017ItemWithWidenData.matNumber] ?? 0;

      return this.calculateMat017Item(mat017ItemWithWidenData, riskFactor, calculationFactor, quantity);
    });

    const matListLumpSumResult = ArrayUtils.fallBackToEmptyArray<ProcessedMat017Item>([
      ...leftMat017ItemList,
      ...rightMat017ItemList,
    ])
      .map((item) => item.sellingPrice ?? 0)
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
      }, 0);

    return { leftMat017ItemList, rightMat017ItemList, matListLumpSumResult };
  }

  private calculateMat017Item(
    mat017ItemWithWidenData: RedactedMat017ItemWithWidenData,
    riskFactor: number,
    calculationFactor: number,
    quantity: number
  ): ProcessedMat017Item {
    const {
      id,
      matNumber,
      overrides: { amountDividedByPriceUnit },
    } = mat017ItemWithWidenData;

    const amountDividedByPriceUnitRounded = NumberUtils.round(amountDividedByPriceUnit);

    const sellingPricePerUnit = NumberUtils.round(amountDividedByPriceUnitRounded * riskFactor * calculationFactor);
    const sellingPrice = NumberUtils.round(sellingPricePerUnit * quantity);

    return {
      id,
      matNumber,
      amountDividedByPriceUnit: amountDividedByPriceUnitRounded,
      quantity,
      sellingPricePerUnit,
      sellingPrice,
    };
  }

  private getWorkStepQuantitiesWithOverrides(
    configuration: Configuration,
    commercialWorkStepOverrides: CommercialWorkStepOverrides
  ): WorkStepQuantitiesWithOverrides {
    const batchSize = this.batchSize;
    const technicalWorkStepOverrides = omitCommercialWorkSteps(configuration.state?.workStepOverrides || {});

    const batchSizeQuantities = new BatchSizeQuantities(batchSize);

    batchSizeQuantities.setProjektierung();
    batchSizeQuantities.setAuftragsmanagement();
    batchSizeQuantities.setEinkaufDispo();
    batchSizeQuantities.setTransportStock();

    const commonQuantities = new CommonQuantities(this.workStepSet);

    commonQuantities.setDrillingSealInsert();
    commonQuantities.setSendTestReport();
    commonQuantities.setPackage();

    const chainflexCableQuantities = new ChainflexCableQuantities(configuration.state);

    chainflexCableQuantities.setCutUnder20MM();
    chainflexCableQuantities.setCutOver20MM();

    const mat017ItemsQuantities = new Mat017ItemsQuantities(configuration.state);

    mat017ItemsQuantities.setConsignment();
    mat017ItemsQuantities.setLabeling();
    mat017ItemsQuantities.setTestFieldPrep();

    const pinAssignmentQuantities = new PinAssignmentQuantities(configuration.state);

    pinAssignmentQuantities.setStrip();
    pinAssignmentQuantities.setAssembly();
    pinAssignmentQuantities.setStripShieldHandling();
    pinAssignmentQuantities.setShieldHandling();
    pinAssignmentQuantities.setStripInnerJacket();
    pinAssignmentQuantities.setStripOuterJacket();
    pinAssignmentQuantities.setShieldHandlingOuterShield();
    pinAssignmentQuantities.setShieldHandlingInnerShield();
    pinAssignmentQuantities.setSkinning();
    pinAssignmentQuantities.setCrimp();
    pinAssignmentQuantities.setTest();

    const quantitiesWithoutOverrides = {
      ...batchSizeQuantities.getValue(),
      ...commonQuantities.getValue(),
      ...chainflexCableQuantities.getValue(),
      ...mat017ItemsQuantities.getValue(),
      ...pinAssignmentQuantities.getValue(),
    } as { [key in WorkStepType]?: number };

    return {
      quantitiesWithoutOverrides,
      quantitiesWithOverrides: {
        ...quantitiesWithoutOverrides,
        ...technicalWorkStepOverrides,
        ...commercialWorkStepOverrides,
      },
    };
  }

  private getWorkStepPrices(
    customerType: CustomerTypeEnum,
    riskFactor: number,
    calculationFactor: number,
    workStepQuantities: { [key in WorkStepType]?: number },
    workStepSet: WorkStepSet
  ): ProcessResultWorkStepItem[] {
    let workStepNames: ReadonlyArray<CombinedWorkStepSetNames>;

    switch (workStepSet) {
      case WorkStepSet.driveCliq:
        workStepNames = defaultDriveCliqWorkStepNames;
        break;
      case WorkStepSet.machineLine:
        workStepNames = defaultMachineLineWorkStepNames;
        break;
      case WorkStepSet.ethernet:
        workStepNames = defaultEthernetWorkStepNames;
        break;
      default:
        workStepNames = defaultStandardWorkStepNames;
        break;
    }

    return workStepNames.map((workStep: WorkStepType) => {
      const quantity = workStepQuantities?.[workStep] ?? 0;

      let price = this.workStepPrices?.[workStep]?.[customerType] ?? 0;

      price = NumberUtils.round(price); // rounding should take place in three steps (see ICALC-248), the base price should be rounded (done here)
      const sellingPricePerUnit = NumberUtils.round(price * riskFactor * calculationFactor); // once when price is multiplied by risk factor & calculation factor (done here)
      const sellingPrice = NumberUtils.round(sellingPricePerUnit * quantity); // and once when the result (sellingPricePerUnit) is multiplied by quantity (done here)

      return {
        name: workStep,
        price,
        quantity,
        sellingPricePerUnit,
        sellingPrice,
      } as ProcessResultWorkStepItem;
    });
  }
}
