/* eslint-disable @typescript-eslint/no-shadow */

import { createSelector } from '@ngxs/store';
import { ProcessState } from './process.state';
import type {
  InformUserAboutWorkSteps,
  MetaDataViewModel,
  ProcessDataForExcelExport,
  ProcessStateModel,
  SelectedProcessResult,
  SingleCableCalculationUiEntity,
} from './process-state.model';
import { ProcessStateMappers } from './process-state.mappers';
import type {
  ChainflexPriceDeviation,
  ChainflexPriceDeviationContainer,
  CheckForNewChainflexPricesResult,
  ConfigurationSnapshotData,
  ProcessResult,
  CableStructure,
  ChainflexCable,
  ConfigurationPresentation,
  SingleCableCalculationPresentation,
  Mat017ItemWithWidenData,
  ConfigurationWithMat017ItemsChanges,
} from '@igus/icalc-domain';
import {
  ArrayUtils,
  ObjectUtils,
  getUniqueMat017ItemsFromConfigurations,
  areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide,
} from '@igus/icalc-domain';

export class ProcessStateSelectors {
  public static calculationTotalPrice(): (state: ProcessStateModel) => number {
    return createSelector([ProcessState], (state: ProcessStateModel): number => {
      return state.calculationTotalPrice;
    });
  }

  public static informUserAboutWorkSteps(): (state: ProcessStateModel) => InformUserAboutWorkSteps[] {
    return createSelector([ProcessState], (state: ProcessStateModel): InformUserAboutWorkSteps[] => {
      return state.informUserAboutWorkSteps;
    });
  }

  public static selectedTabIndex(): (state: ProcessStateModel) => number {
    return createSelector([ProcessState], (state: ProcessStateModel): number => {
      return state.selectedTabIndex;
    });
  }

  public static isProcessing(): (state: ProcessStateModel) => boolean {
    return createSelector([ProcessState], (state: ProcessStateModel): boolean => {
      return state.isProcessing;
    });
  }

  public static processResults(): (state: ProcessStateModel) => ProcessResult[] {
    return createSelector([ProcessState], (state: ProcessStateModel): ProcessResult[] => {
      return state.processResults;
    });
  }

  public static chainflexPricesHaveChanged(): (state: ProcessStateModel) => boolean {
    return createSelector([ProcessState], (state: ProcessStateModel): boolean => {
      return state.chainflexPricesHaveChanged;
    });
  }

  public static hasAnyMat017ItemPriceChanged(): (state: ProcessStateModel) => boolean {
    return createSelector([ProcessState], (state: ProcessStateModel): boolean => {
      return state.mat017ItemsModification.hasAmountDividedByPriceUnitChanged;
    });
  }

  public static hasInvalidOrRemovedItems(): (state: ProcessStateModel) => boolean {
    return createSelector([ProcessState], (state: ProcessStateModel): boolean => {
      return state.mat017ItemsModification.hasInvalidOrRemovedItems;
    });
  }

  public static checkForNewChainflexPricesResult(): (state: ProcessStateModel) => CheckForNewChainflexPricesResult {
    return createSelector([ProcessState], (state: ProcessStateModel): CheckForNewChainflexPricesResult => {
      return state.checkForNewChainflexPricesResult;
    });
  }

  public static chainflexesAndPricesAvailable(): (state: ProcessStateModel) => boolean {
    return createSelector([ProcessState], (state: ProcessStateModel): boolean => {
      return state.chainflexesAndPricesAvailable;
    });
  }

  public static isValidSelector(): (state: ProcessStateModel) => boolean {
    return createSelector([ProcessState], ({ selectedSingleCableCalculationId }: ProcessStateModel): boolean => {
      return !!selectedSingleCableCalculationId;
    });
  }

  public static isChainflexValid(): (
    state: ProcessStateModel,
    chainflexCable: ChainflexCable,
    chainflexCableLength: number
  ) => boolean {
    return createSelector(
      [ProcessState, ProcessStateSelectors.chainflexCable(), ProcessStateSelectors.chainflexCableLength()],
      (_: ProcessStateModel, chainflexCable: ChainflexCable, chainflexCableLength: number): boolean => {
        return !!chainflexCable && +chainflexCableLength > 0;
      }
    );
  }

  public static isLeftConnectorValid(): (
    state: ProcessStateModel,
    configuration: ConfigurationPresentation
  ) => boolean {
    return createSelector(
      [ProcessState, ProcessStateSelectors.selectedConfigurationData()],
      (state: ProcessStateModel, configuration: ConfigurationPresentation): boolean => {
        const configState = configuration.state;

        if (configState && configState.connectorState?.leftConnector) {
          const { leftConnector } = configState.connectorState;
          const { chainflexCable } = configState.chainFlexState;
          const chainflexCableLength = ProcessStateSelectors.chainflexCableLength()(state);

          return (
            Object.keys(leftConnector.addedMat017Items)?.length > 0 &&
            ArrayUtils.isNotEmpty(leftConnector?.mat017ItemListWithWidenData) &&
            this.isChainflexValid()(state, chainflexCable, +chainflexCableLength)
          );
        }

        return false;
      }
    );
  }

  public static isLibraryValid(): (state: ProcessStateModel, configuration: ConfigurationPresentation) => boolean {
    return createSelector(
      [ProcessState, ProcessStateSelectors.selectedConfigurationData()],
      (state: ProcessStateModel, configuration: ConfigurationPresentation): boolean => {
        const imageList = configuration?.state?.libraryState?.imageList;
        const matNumberListLeft = imageList?.filter((image) => image?.side === 'left').map((image) => image?.matNumber);
        const matNumberListRight = imageList
          ?.filter((image) => image?.side === 'right')
          .map((image) => image?.matNumber);

        return (
          areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(matNumberListLeft, configuration, `left`) &&
          areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(matNumberListRight, configuration, `right`) &&
          this.isLeftConnectorValid()(state, configuration)
        );
      }
    );
  }

  public static isLocked(): (state: ProcessStateModel) => boolean | null {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): boolean | null => {
        if (!selectedSingleCableCalculationId) {
          return null;
        }
        const calculationId = entities.singleCableCalculations.items[selectedSingleCableCalculationId].calculationId;
        const calculation = entities.calculations.items[calculationId];

        return calculation ? calculation.isLocked : false;
      }
    );
  }

  public static isSingleCableCalculationLoading(): (state: ProcessStateModel) => boolean | null {
    return createSelector([ProcessState], ({ isSingleCableCalculationLoading }: ProcessStateModel): boolean => {
      return isSingleCableCalculationLoading;
    });
  }

  public static isSavingSingleCableCalculation(): (state: ProcessStateModel) => boolean | null {
    return createSelector([ProcessState], ({ isSavingSingleCableCalculation }: ProcessStateModel): boolean => {
      return isSavingSingleCableCalculation;
    });
  }

  public static isExcelFileDownloading(): (state: ProcessStateModel) => boolean | null {
    return createSelector([ProcessState], ({ isExcelFileDownloading }: ProcessStateModel): boolean => {
      return isExcelFileDownloading;
    });
  }

  public static currentSelectedCalculationId(): (state: ProcessStateModel) => string {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): string => {
        return entities.singleCableCalculations.items[selectedSingleCableCalculationId].calculationId;
      }
    );
  }

  public static currentSelectedConfigurationId(): (state: ProcessStateModel) => string {
    return createSelector([ProcessState], (state: ProcessStateModel): string => {
      return state.entities.singleCableCalculations.items[state.selectedSingleCableCalculationId].configurationId;
    });
  }

  public static currentSelectedSingleCableCalculationId(): (state: ProcessStateModel) => string {
    return createSelector([ProcessState], (state: ProcessStateModel): string => {
      return state.selectedSingleCableCalculationId;
    });
  }

  public static metaDataViewModel(): (state: ProcessStateModel) => MetaDataViewModel {
    return createSelector([ProcessState], (state: ProcessStateModel): MetaDataViewModel => {
      return ProcessStateMappers.toMetaDataViewModel(state);
    });
  }

  public static relatedSingleCableCalculationsOfCalculation(): (
    state: ProcessStateModel
  ) => SingleCableCalculationPresentation[] {
    return createSelector([ProcessState], (state: ProcessStateModel): SingleCableCalculationPresentation[] => {
      return ProcessStateMappers.toRelatedSingleCableCalculationsOfCalculation(state);
    });
  }

  public static relatedSingleCableCalculationsOfCalculationWithRelations(): (
    state: ProcessStateModel
  ) => SingleCableCalculationPresentation[] {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): SingleCableCalculationPresentation[] => {
        const calculationId = entities.singleCableCalculations.items[selectedSingleCableCalculationId].calculationId;
        const calculation = entities.calculations.items[calculationId];

        return calculation.singleCableCalculations.map((scc) => {
          const fullScc = entities.singleCableCalculations.items[scc.id];

          return {
            ...entities.singleCableCalculations.items[scc.id],
            configuration: entities.configurations.items[fullScc.configurationId],
            snapshot: entities.snapshots.items[fullScc.snapshotId],
          } as SingleCableCalculationPresentation;
        });
      }
    );
  }

  public static selectedConfiguration(): (state: ProcessStateModel) => ConfigurationPresentation {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): ConfigurationPresentation => {
        const configurationId =
          entities.singleCableCalculations.items[selectedSingleCableCalculationId].configurationId;

        return ObjectUtils.cloneDeep<ConfigurationPresentation>(entities.configurations.items[configurationId]);
      }
    );
  }

  public static selectedConfigurationData(): (
    state: ProcessStateModel
  ) => ConfigurationPresentation | ConfigurationSnapshotData {
    return createSelector(
      [ProcessState],
      (state: ProcessStateModel): ConfigurationPresentation | ConfigurationSnapshotData => {
        return ProcessStateMappers.toSelectedConfigurationData(state);
      }
    );
  }

  public static relatedSingleCableCalculationsOfConfiguration(): (
    state: ProcessStateModel
  ) => SingleCableCalculationPresentation[] {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): SingleCableCalculationPresentation[] => {
        const selectedScc = entities.singleCableCalculations.items[selectedSingleCableCalculationId];
        const { configurationId, snapshotId } = selectedScc;
        const configuration = entities.configurations.items[configurationId];
        const snapshot = entities.snapshots.items[snapshotId];
        const { singleCableCalculations } = configuration || snapshot;
        const sccListFromEntities = singleCableCalculations.map((scc) => ({
          ...entities.singleCableCalculations.items[scc.id],
        }));

        return ProcessStateMappers.toUniqueSingleCableCalculationsByCalculationNumber(sccListFromEntities, selectedScc);
      }
    );
  }

  public static selectedSingleCableCalculationWithRelations(): (
    state: ProcessStateModel
  ) => SingleCableCalculationPresentation {
    return createSelector([ProcessState], (state: ProcessStateModel): SingleCableCalculationPresentation => {
      return ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);
    });
  }

  public static selectedSingleCableCalculation(): (state: ProcessStateModel) => SingleCableCalculationUiEntity {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): SingleCableCalculationUiEntity => {
        return entities.singleCableCalculations.items[selectedSingleCableCalculationId];
      }
    );
  }

  public static selectedProcessResult(): (
    state: ProcessStateModel,
    configuration: ConfigurationPresentation
  ) => SelectedProcessResult {
    return createSelector(
      [ProcessState, ProcessStateSelectors.selectedConfigurationData()],
      (
        { selectedSingleCableCalculationId, processResults }: ProcessStateModel,
        configuration: ConfigurationPresentation
      ): SelectedProcessResult => {
        const matItemsInAllConfigurations = getUniqueMat017ItemsFromConfigurations([configuration]);
        const newMatItem017ByMatNumberMap = Object.fromEntries(
          matItemsInAllConfigurations.map(
            ({ matNumber, itemDescription1, itemDescription2 }: Mat017ItemWithWidenData) => [
              matNumber,
              { itemDescription1, itemDescription2 },
            ]
          )
        );

        const processResult = processResults.find(
          (result) => selectedSingleCableCalculationId === result.configurationReference.sccId
        );

        const { leftMat017ItemList, rightMat017ItemList } = processResult;

        return {
          ...processResult,
          ...(!!leftMat017ItemList && {
            leftMat017ItemList: leftMat017ItemList.map((leftItem) => ({
              ...leftItem,
              ...newMatItem017ByMatNumberMap[leftItem.matNumber],
            })),
          }),
          ...(!!rightMat017ItemList && {
            rightMat017ItemList: rightMat017ItemList.map((rightItem) => ({
              ...rightItem,
              ...newMatItem017ByMatNumberMap[rightItem.matNumber],
            })),
          }),
        };
      }
    );
  }

  public static chainflexCableLength(): (state: ProcessStateModel) => number {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): number => {
        const scc = entities.singleCableCalculations.items[selectedSingleCableCalculationId];

        return scc.chainflexLength;
      }
    );
  }

  public static chainflexCable(): (state: ProcessStateModel) => ChainflexCable {
    return createSelector([ProcessState], (state: ProcessStateModel): ChainflexCable => {
      const configuration = ProcessStateMappers.toSelectedConfigurationData(state);

      return configuration.state.chainFlexState.chainflexCable;
    });
  }

  public static chainflexCableStructure(): (state: ProcessStateModel) => CableStructure {
    return createSelector(
      [ProcessState],
      ({ selectedSingleCableCalculationId, entities }: ProcessStateModel): CableStructure => {
        const configurationId =
          entities.singleCableCalculations.items[selectedSingleCableCalculationId].configurationId;
        const configuration = ObjectUtils.cloneDeep<ConfigurationPresentation>(
          entities.configurations.items[configurationId]
        );

        return configuration.state.chainFlexState.chainflexCable.cableStructure;
      }
    );
  }

  public static processDataForExcelExport(): (
    processState: ProcessStateModel,
    singleCableCalculation: SingleCableCalculationPresentation,
    relatedSingleCableCalculations: SingleCableCalculationPresentation[]
  ) => ProcessDataForExcelExport {
    return createSelector(
      [
        ProcessState,
        ProcessStateSelectors.selectedSingleCableCalculationWithRelations(),
        ProcessStateSelectors.relatedSingleCableCalculationsOfCalculationWithRelations(),
      ],
      (
        processState: ProcessStateModel,
        singleCableCalculation: SingleCableCalculationPresentation,
        relatedSingleCableCalculations: SingleCableCalculationPresentation[]
      ): ProcessDataForExcelExport => {
        const { configuration, calculation, snapshot } = singleCableCalculation;

        return {
          selectedCalculationItem: calculation,
          selectedConfigurationItem: configuration,
          selectedSnapshotItem: snapshot,
          selectedSingleCableCalculation: singleCableCalculation,
          processResults: processState.processResults,
          relatedSingleCableCalculations,
        };
      }
    );
  }

  public static chainflexListWithNewPrices(): (state: ProcessStateModel) => ChainflexPriceDeviation[] {
    return createSelector([ProcessState], (state: ProcessStateModel): ChainflexPriceDeviation[] => {
      return ProcessStateMappers.toChainFlexListWithNewPrices(state);
    });
  }

  public static mat017ItemListWithNewPrices(): (state: ProcessStateModel) => ConfigurationWithMat017ItemsChanges[] {
    return createSelector([ProcessState], (state: ProcessStateModel): ConfigurationWithMat017ItemsChanges[] => {
      return ProcessStateMappers.toMat017ItemWithNewPrices(state);
    });
  }

  public static chainflexListWithNoPrices(): (state: ProcessStateModel) => ChainflexPriceDeviationContainer[] {
    return createSelector([ProcessState], (state: ProcessStateModel): ChainflexPriceDeviationContainer[] => {
      return ProcessStateMappers.toChainFlexListWithNoPrices(state);
    });
  }

  public static mat017ItemListWithNoPrices(): (state: ProcessStateModel) => ConfigurationWithMat017ItemsChanges[] {
    return createSelector([ProcessState], (state: ProcessStateModel): ConfigurationWithMat017ItemsChanges[] => {
      return ProcessStateMappers.toMat017ItemListWithNoPrices(state);
    });
  }

  public static shouldInformAboutMissingChainflexPrices(): (
    state: ProcessStateModel,
    chainflexListWithNoPrices: ChainflexPriceDeviationContainer[]
  ) => boolean {
    return createSelector(
      [ProcessState, ProcessStateSelectors.chainflexListWithNoPrices()],
      (state: ProcessStateModel, chainflexListWithNoPrices: ChainflexPriceDeviationContainer[]): boolean => {
        return !state?.chainflexesAndPricesAvailable && chainflexListWithNoPrices.length > 0;
      }
    );
  }

  public static shouldInformAboutMissingMat017ItemPrices(): (
    state: ProcessStateModel,
    mat017ItemListWithNoPrices: ConfigurationWithMat017ItemsChanges[]
  ) => boolean {
    return createSelector(
      [ProcessState, ProcessStateSelectors.mat017ItemListWithNoPrices()],
      (state: ProcessStateModel, mat017ItemListWithNoPrices: ConfigurationWithMat017ItemsChanges[]): boolean => {
        return state?.mat017ItemsModification.hasInvalidOrRemovedItems && mat017ItemListWithNoPrices.length > 0;
      }
    );
  }

  public static mat017ItemsLatestModificationDate(): (state: ProcessStateModel) => Date {
    return createSelector([ProcessState], (state: ProcessStateModel): Date => {
      return state.mat017ItemsLatestModificationDate;
    });
  }
}
