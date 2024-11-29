import type {
  CalculationPresentation,
  SingleCableCalculationPresentation,
  ConfigurationPresentation,
  UpdateCalculationRequestDto,
  UpdateCalculationWithSCC,
  ConfigurationSnapshotData,
  SaveSingleCableCalculationRequestData,
  ConfigurationSnapshotPresentation,
  ProcessCalculationRequestDto,
  RemoveLinkBetweenConfigurationAndCalculationRequestDto,
  ChainflexPriceDeviation,
  ChainflexPriceDeviationContainer,
  CheckForNewChainflexPricesRequestDto,
  ConfigurationState,
  ConfigurationWithMat017ItemsChanges,
  UpdateMat017OverridesRequestDto,
  ConfigurationWithChangedMat017ItemOverrides,
  Mat017ItemsChange,
  Mat017ItemChange,
  HaveMat017ItemsOverridesChangedRequestDto,
  RemovedMat017ItemFormModel,
  RemovedMat017ItemsRequestDto,
} from '@igus/icalc-domain';
import { Mat017ItemOverridesEnum, StringUtils, ObjectUtils, Mat017ItemStatus, ArrayUtils } from '@igus/icalc-domain';

import type {
  CalculationUiEntity,
  ConfigurationUiEntity,
  ProcessStateModel,
  SingleCableCalculationUiEntity,
  SnapshotUiEntity,
  MetaDataViewModel,
  MetaDataViewModelCalculation,
} from './process-state.model';

export class ProcessStateMappers {
  public static toSingleCableCalculationUiEntity(
    value: SingleCableCalculationPresentation
  ): SingleCableCalculationUiEntity {
    const {
      id,
      calculationFactor,
      batchSize,
      chainflexLength,
      configuration,
      calculation,
      assignedBy,
      commercialWorkStepOverrides,
      assignmentDate,
      calculationId,
      configurationId,
      snapshotId,
      matNumber,
      calculationNumber,
    } = value;

    return {
      id,
      calculationFactor,
      batchSize,
      chainflexLength,
      commercialWorkStepOverrides,
      configurationId: configuration?.id ?? configurationId,
      calculationId: calculation?.id ?? calculationId,
      assignedBy,
      assignmentDate,
      snapshotId,
      matNumber,
      calculationNumber,
    };
  }

  public static toConfigurationUiEntity(value: ConfigurationPresentation): ConfigurationUiEntity {
    return {
      ...value,
      singleCableCalculations: value.singleCableCalculations.map((v) => ({ id: v.id })),
    };
  }

  public static toCalculationUiEntity(value: CalculationPresentation): CalculationUiEntity {
    return {
      ...value,
      singleCableCalculations: value.singleCableCalculations.map((v) => ({ id: v.id })),
    };
  }

  public static toSnapshotUiEntity(value: ConfigurationSnapshotPresentation): SnapshotUiEntity {
    return {
      ...value,
      singleCableCalculations: value.singleCableCalculations.map((v) => ({ id: v.id })),
    };
  }

  public static toUniqueSingleCableCalculationsByCalculationNumber(
    singleCableCalculations: SingleCableCalculationPresentation[],
    selectedSingleCableCalculation: SingleCableCalculationPresentation
  ): SingleCableCalculationPresentation[] {
    return [...singleCableCalculations]
      .filter((value) => {
        if (value.calculationNumber === selectedSingleCableCalculation.calculationNumber) {
          return value.id === selectedSingleCableCalculation.id;
        }
        return true;
      })
      .filter(
        (value, index, self) =>
          self.findIndex((selfValue) => selfValue.calculationNumber === value.calculationNumber) === index
      );
  }

  public static toSelectedSingleCableCalculationWithRelations({
    selectedSingleCableCalculationId,
    entities,
  }: ProcessStateModel): SingleCableCalculationPresentation | null {
    if (!selectedSingleCableCalculationId) {
      return null;
    }

    const scc = entities.singleCableCalculations.items[selectedSingleCableCalculationId];

    return {
      ...scc,
      calculation: ObjectUtils.omitKeys(entities.calculations.items[scc.calculationId], ['singleCableCalculations']),
      configuration: ObjectUtils.omitKeys(entities.configurations.items[scc.configurationId], [
        'singleCableCalculations',
      ]),
      snapshot: ObjectUtils.omitKeys(entities.snapshots.items[scc.snapshotId], ['singleCableCalculations']),
    };
  }

  public static toRelatedSingleCableCalculationsOfCalculation({
    selectedSingleCableCalculationId,
    entities,
  }: ProcessStateModel): SingleCableCalculationPresentation[] {
    const calculationId = entities.singleCableCalculations.items[selectedSingleCableCalculationId].calculationId;
    const calculation = entities.calculations.items[calculationId];

    return [
      ...calculation.singleCableCalculations.map((scc) => ({
        ...entities.singleCableCalculations.items[scc.id],
      })),
    ];
  }

  public static toRelatedUniqueConfigurationIdsAndCountOfCalculation(state: ProcessStateModel): Record<string, number> {
    const calculation = ProcessStateMappers.toRelatedSingleCableCalculationsOfCalculation(state);

    return calculation
      .map((scc) => scc.configurationId)
      .reduce<Record<string, number>>((acc, configuration) => {
        if (acc[configuration]) {
          acc[configuration]++;
        } else {
          acc[configuration] = 1;
        }
        return acc;
      }, {});
  }

  public static toSaveSingleCableCalculationRequestDto(
    scc: SingleCableCalculationPresentation,
    statePropertiesToSave: (keyof ConfigurationState)[]
  ): SaveSingleCableCalculationRequestData {
    const { configuration, snapshot } = scc;

    return {
      id: scc.id,
      calculationFactor: scc.calculationFactor,
      batchSize: scc.batchSize,
      chainflexLength: scc.chainflexLength,
      assignedBy: scc.assignedBy as unknown as string,
      assignmentDate: scc.assignmentDate,
      commercialWorkStepOverrides: scc.commercialWorkStepOverrides,
      ...(scc.configurationId && {
        configuration: {
          id: configuration.id,
          labelingLeft: configuration.labelingLeft,
          labelingRight: configuration.labelingRight,
          description: configuration.description,
          partNumber: configuration.partNumber,
          state: statePropertiesToSave.reduce((acc, stateProperty) => {
            acc[stateProperty] = configuration.state[stateProperty];
            return acc;
          }, {}),
        },
      }),
      ...(scc.snapshotId && {
        snapshot: {
          id: snapshot.id,
          libraryState: snapshot.configurationData.state.libraryState,
          connectorState: snapshot.configurationData.state.connectorState,
        },
      }),
    };
  }

  public static toFormattedUpdateCalculationRequestDto(
    payload: UpdateCalculationWithSCC | UpdateCalculationRequestDto
  ): UpdateCalculationRequestDto {
    let requestDto: UpdateCalculationRequestDto = {
      calculationNumber: payload.calculationNumber,
    };

    if (payload.calculationFactor) {
      const calculationFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(payload.calculationFactor);

      requestDto = {
        ...requestDto,
        ...payload,
        calculationFactor,
      };
    } else if (payload.singleCableCalculation?.calculationFactor) {
      const sccCalculationFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(
        payload.singleCableCalculation.calculationFactor
      );

      requestDto = {
        ...requestDto,
        ...payload,
        singleCableCalculation: {
          ...payload.singleCableCalculation,
          calculationFactor: sccCalculationFactor,
        },
      };
    }

    return requestDto;
  }

  public static toMetaDataViewModel(state: ProcessStateModel): MetaDataViewModel {
    const selectedSingleCableCalculation = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

    /*
     * if calculationIdForCreatingNewConfiguration is provided we only want to return the partial model with calculation informations
     * so that configuration data can be provided by user.
     */
    if (state.calculationIdForCreatingNewConfiguration) {
      const calculation = ProcessStateMappers.toMetaDataViewModelCalculationForCreatingNewConfiguration(state);

      return {
        selectedCalculationItem: {
          id: calculation.id,
          calculationFactor: calculation.calculationFactor,
          calculationNumber: calculation.calculationNumber,
          quoteNumber: calculation.quoteNumber,
          customer: calculation.customer,
          customerType: calculation.customerType,
          isLocked: calculation.isLocked,
        },
        selectedConfigurationItem: {
          id: null,
        },
        selectedSingleCableCalculationItem: {
          id: null,
        },
      };
    }

    const { configuration, calculation, snapshot } = selectedSingleCableCalculation;

    const configurationData = configuration ?? snapshot.configurationData;

    return {
      selectedCalculationItem: {
        id: calculation.id,
        calculationFactor: calculation.calculationFactor,
        calculationNumber: calculation.calculationNumber,
        quoteNumber: calculation.quoteNumber,
        customer: calculation.customer,
        customerType: calculation.customerType,
        isLocked: calculation.isLocked,
      },
      selectedConfigurationItem: {
        id: configurationData.id,
        matNumber: configurationData.matNumber,
        labelingLeft: configurationData.labelingLeft,
        labelingRight: configurationData.labelingRight,
        description: configurationData.description,
      },
      selectedSingleCableCalculationItem: {
        batchSize: selectedSingleCableCalculation.batchSize,
        id: selectedSingleCableCalculation.id,
        snapshotId: selectedSingleCableCalculation.snapshotId,
      },
    };
  }

  public static toChainFlexListWithNewPrices(state: ProcessStateModel): ChainflexPriceDeviation[] {
    const { checkForNewChainflexPricesResult } = state;

    if (!checkForNewChainflexPricesResult) {
      return [];
    }

    return checkForNewChainflexPricesResult.singleCableCalculationPriceUpdateReferences
      .filter((sccRef) => sccRef.priceDeviationDetected && sccRef.priceAvailable)
      .map((sccRef) => {
        const sccUiEntity = state.entities.singleCableCalculations.items[sccRef.singleCableCalculationId];

        return {
          sccId: sccRef.singleCableCalculationId,
          configurationMatNumber: sccUiEntity.matNumber,
          partNumber: sccRef.partNumber,
          chainflexLength: sccUiEntity.chainflexLength,
          batchSize: sccUiEntity.batchSize,
          priceUpdateable: true,
          oldCFPrice: sccRef.oldPriceObject?.germanListPrice,
          newCFPrice: sccRef.newPriceObject?.germanListPrice,
        };
      });
  }

  public static toUpdateMat017ItemsOverridesRequestDto(
    state: ProcessStateModel,
    configurations: ConfigurationWithChangedMat017ItemOverrides[]
  ): UpdateMat017OverridesRequestDto {
    const selectedSingleCableCalculationId = state.selectedSingleCableCalculationId;
    const calculationId = state.entities.singleCableCalculations.items[selectedSingleCableCalculationId].calculationId;

    return configurations.reduce(
      (acc, conf) => {
        const hasAnyMat017ItemGroupChanged = conf.mat017ItemsChanges.some(
          (item) =>
            !!item.newOverrides?.mat017ItemGroup &&
            item.currentOverrides.mat017ItemGroup !== item.newOverrides?.mat017ItemGroup
        );

        if (hasAnyMat017ItemGroupChanged && !acc.configurationIds.includes(conf.id)) acc.configurationIds.push(conf.id);
        return acc;
      },
      { calculationId, updateProperties: [Mat017ItemOverridesEnum.mat017ItemGroup], configurationIds: [] }
    );
  }

  public static toMat017ItemWithNewPrices(state: ProcessStateModel): ConfigurationWithMat017ItemsChanges[] {
    return ProcessStateMappers.toMat017ItemListPerItemStatus(state, [Mat017ItemStatus.active]);
  }

  public static toMat017ItemListWithNoPrices(state: ProcessStateModel): ConfigurationWithMat017ItemsChanges[] {
    return ProcessStateMappers.toMat017ItemListPerItemStatus(state, [
      Mat017ItemStatus.removed,
      Mat017ItemStatus.inactive,
    ]);
  }

  public static toMat017ItemListPerItemStatus(
    state: ProcessStateModel,
    mat017ItemStatus: Mat017ItemStatus[]
  ): ConfigurationWithMat017ItemsChanges[] {
    const { mat017ItemsModification } = state;

    if (!mat017ItemsModification || ArrayUtils.isEmpty(mat017ItemsModification.configurations)) return [];

    const numberOfConfigurationAssignment =
      ProcessStateMappers.toRelatedUniqueConfigurationIdsAndCountOfCalculation(state);

    return mat017ItemsModification.configurations.reduce((acc, configuration) => {
      const mat017ItemChanges = ProcessStateMappers.toMat017ItemChanges(
        configuration.mat017ItemsChanges,
        mat017ItemStatus
      );

      if (ArrayUtils.isNotEmpty(mat017ItemChanges)) {
        acc.push({
          ...configuration,
          assignments: numberOfConfigurationAssignment[configuration.id],
          mat017ItemsChanges: mat017ItemChanges,
        });
      }
      return acc;
    }, []);
  }

  public static toChainFlexListWithNoPrices(state: ProcessStateModel): ChainflexPriceDeviationContainer[] {
    const { checkForNewChainflexPricesResult } = state;

    if (!checkForNewChainflexPricesResult) {
      return [];
    }

    const resultMap = checkForNewChainflexPricesResult.singleCableCalculationPriceUpdateReferences
      .filter((sccRef) => sccRef.priceAvailable === false)
      .reduce((mapAcc, resultRef) => {
        const sccUiEntity = state.entities.singleCableCalculations.items[resultRef.singleCableCalculationId];

        const sccRefObj = {
          sccId: resultRef.singleCableCalculationId,
          configurationMatNumber: sccUiEntity.matNumber,
          partNumber: resultRef.partNumber,
          chainflexLength: sccUiEntity.chainflexLength,
          batchSize: sccUiEntity.batchSize,
          priceAvailable: resultRef.priceAvailable,
          oldCFPrice: resultRef.oldPriceObject?.germanListPrice,
        };

        let sccReferenceContainer = mapAcc.get(sccRefObj.configurationMatNumber);

        if (!sccReferenceContainer) {
          sccReferenceContainer = {
            configurationMatNumber: sccRefObj.configurationMatNumber,
            chainflexPriceDeviations: [],
          };
          mapAcc.set(sccRefObj.configurationMatNumber, sccReferenceContainer);
        }

        sccReferenceContainer.chainflexPriceDeviations.push(sccRefObj);

        return mapAcc;
      }, new Map());

    return [...resultMap.values()];
  }

  public static toMetaDataViewModelCalculationForCreatingNewConfiguration(
    state: ProcessStateModel
  ): MetaDataViewModelCalculation {
    const calculation = state.entities.calculations.items[state.calculationIdForCreatingNewConfiguration];

    return {
      id: calculation.id,
      calculationFactor: calculation.calculationFactor,
      calculationNumber: calculation.calculationNumber,
      quoteNumber: calculation.quoteNumber,
      customer: calculation.customer,
      customerType: calculation.customerType,
      isLocked: calculation.isLocked,
    };
  }

  public static toSelectedConfigurationData({
    selectedSingleCableCalculationId,
    entities,
  }: ProcessStateModel): ConfigurationPresentation | ConfigurationSnapshotData {
    const scc = entities.singleCableCalculations.items[selectedSingleCableCalculationId];
    const { configurationId, snapshotId } = scc;
    const configurationData =
      configurationId && !snapshotId
        ? entities.configurations.items[configurationId]
        : entities.snapshots.items[snapshotId].configurationData;

    return ObjectUtils.cloneDeep(configurationData);
  }

  public static toSelectedConfigurationEntity({
    selectedSingleCableCalculationId,
    entities,
  }: ProcessStateModel): ConfigurationPresentation {
    const configurationId = entities.singleCableCalculations.items[selectedSingleCableCalculationId].configurationId;

    return ObjectUtils.cloneDeep<ConfigurationPresentation>(entities.configurations.items[configurationId]);
  }

  public static toSelectedCalculationEntity({
    selectedSingleCableCalculationId,
    entities,
  }: ProcessStateModel): CalculationUiEntity {
    const calculationId = entities.singleCableCalculations.items[selectedSingleCableCalculationId].calculationId;

    return ObjectUtils.cloneDeep<CalculationUiEntity>(entities.calculations.items[calculationId]);
  }

  public static toConfigurationUiEntityBySingleCableCalculationId(
    state: ProcessStateModel,
    singleCableCalculationId: string
  ): ConfigurationUiEntity {
    const sccUiEntity = state.entities.singleCableCalculations.items[singleCableCalculationId];

    return state.entities.configurations.items[sccUiEntity.configurationId];
  }

  public static toConfigurationUiEntityByConfigurationId(
    state: ProcessStateModel,
    configurationId: string
  ): ConfigurationUiEntity {
    return state.entities.configurations.items[configurationId];
  }

  public static toProcessCalculationRequestDto(
    { selectedSingleCableCalculationId, entities }: ProcessStateModel,
    singleCableCalculationFromPayload?: SingleCableCalculationPresentation
  ): ProcessCalculationRequestDto {
    const selectedsingleCableCalculation = entities.singleCableCalculations.items[selectedSingleCableCalculationId];
    const calculationId = selectedsingleCableCalculation.calculationId;

    let relatedSingleCableCalculationsIds: string[];

    if (singleCableCalculationFromPayload) {
      relatedSingleCableCalculationsIds = singleCableCalculationFromPayload.calculation.singleCableCalculations.map(
        (value) => value.id
      );
    } else {
      relatedSingleCableCalculationsIds = entities.calculations.items[calculationId].singleCableCalculations.flatMap(
        (baseUiEntity) => Object.values(baseUiEntity)
      );
    }

    return {
      calculationId,
      singleCableCalculationIds: relatedSingleCableCalculationsIds,
    };
  }

  public static toRemoveLinkBetweenConfigurationAndCalculationRequestDto(
    state: ProcessStateModel
  ): RemoveLinkBetweenConfigurationAndCalculationRequestDto {
    const { configurationId, calculationId, id } =
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

    return { configurationId, singleCableCalculationId: id, calculationId };
  }

  public static toCheckForNewChainflexPricesDto(state: ProcessStateModel): CheckForNewChainflexPricesRequestDto {
    const relatedSingleCableCalculationIds: string[] =
      ProcessStateMappers.toRelatedSingleCableCalculationsOfCalculation(state).map((scc) => scc.id);

    return {
      singleCableCalculationIds: relatedSingleCableCalculationIds,
    };
  }

  public static toCheckForNewMat017ItemPrices(state: ProcessStateModel): HaveMat017ItemsOverridesChangedRequestDto {
    const relatedConfigurationIds: string[] = state.processResults.map(
      (scc) => scc.configurationReference.configurationId
    );

    return {
      configurationIds: Array.from(new Set(relatedConfigurationIds)),
    };
  }

  public static toRemoveMat017ItemsRequestDto(
    state: ProcessStateModel,
    selectedMatNumbers: RemovedMat017ItemFormModel[]
  ): RemovedMat017ItemsRequestDto {
    const configurations = ProcessStateMappers.toMat017ItemListWithNoPrices(state);
    const sccId = state.selectedSingleCableCalculationId;
    const calculationId = state.entities.singleCableCalculations.items[sccId].calculationId;

    return configurations.reduce<RemovedMat017ItemsRequestDto>(
      (acc, conf) => {
        for (const matItem of selectedMatNumbers) {
          if (matItem.configurationMatNumber === conf.matNumber) {
            const configuration = {
              configurationId: conf.id,
              mat017Items: conf.mat017ItemsChanges
                .filter((item) => matItem.matNumber === item.matNumber)
                .map((mat017Item) => mat017Item.matNumber),
            };

            acc.configurations.push(configuration);
          }
        }

        return acc;
      },
      { calculationId, configurations: [] }
    );
  }

  public static toUpdateMat017ItemOverridesRequestDto(state: ProcessStateModel): UpdateMat017OverridesRequestDto {
    const configurations = ProcessStateMappers.toMat017ItemWithNewPrices(state);
    const sccId = state.selectedSingleCableCalculationId;
    const calculationId = state.entities.singleCableCalculations.items[sccId].calculationId;

    return {
      calculationId,
      updateProperties: [Mat017ItemOverridesEnum.amountDividedByPriceUnit],
      configurationIds: configurations.map((configuration) => configuration.id),
    };
  }

  private static toMat017ItemChanges(
    mat017ItemsChanges: Mat017ItemChange[],
    mat017ItemStatus: Mat017ItemStatus[]
  ): Mat017ItemsChange[] {
    return mat017ItemsChanges
      .filter((item) => mat017ItemStatus.includes(item.itemStatus))
      .map((mat017Item) => {
        return {
          matNumber: mat017Item.matNumber,
          itemDescription1: mat017Item.itemDescription1,
          itemDescription2: mat017Item.itemDescription2,
          mat017ItemGroup: mat017Item.newOverrides.mat017ItemGroup,
          oldPrice: mat017Item.currentOverrides.amountDividedByPriceUnit,
          newPrice: mat017Item.newOverrides.amountDividedByPriceUnit,
          itemStatus: mat017Item.itemStatus,
          usedInSketch: mat017Item.usedInSketch,
          usedInPinAssignment: mat017Item.usedInPinAssignment,
        };
      });
  }
}
