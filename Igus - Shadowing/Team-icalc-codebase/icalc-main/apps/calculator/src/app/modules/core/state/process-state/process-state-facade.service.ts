import type { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type {
  CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto,
  ChainflexCable,
  ChainflexPriceDeviation,
  ChainflexPriceDeviationContainer,
  CheckForNewChainflexPricesResult,
  ConfigurationPresentation,
  ConfigurationSnapshotPresentationData,
  CopyConfigurationToNewCalculationDto,
  CreateCalculationAndConfigurationRequestDto,
  CreateNewConfigurationForExistingCalculationRequestDto,
  CopyConfigurationToExistingCalculationRequestDto,
  DuplicatingCalculationRequestDto,
  IcalcHTTPError,
  ConfigurationWithMat017ItemsChanges,
  ProcessManyResult,
  SingleCableCalculationBaseData,
  SingleCableCalculationPresentation,
  UpdateCalculationRequestDto,
  WorkStepSet,
  RemovedMat017ItemFormModel,
  FileDownloadOptions,
  LocalizedStrings,
} from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { combineLatest, map, merge, Observable } from 'rxjs';

import { ChangeSelectedTab, ExportExcelFile } from './process-state.actions';
import type {
  IcalcStepsState,
  InformUserAboutWorkSteps,
  ProcessDataForExcelExport,
  ProcessStateModel,
  SubmittingWorkStepsFormPayload,
  UpdatingSingleCableCalculationDataPayload,
  MetaDataViewModel,
  SelectedProcessResult,
} from './process-state.model';
import { Api } from '../actions/api';
import { RemoveLinkBetweenConfigurationAndCalculationDialog } from '../actions/remove-link-between-configuration-and-calculation-dialog';
import { MetaData } from '../actions/meta-data';
import { CalculationSearch } from '../actions/calculation-search';
import { AssignConfigurationDialog } from '../actions/assign-configuration-dialog';
import { CopyConfigurationToExistingCalculationDialog } from '../actions/copy-configuration-to-existing-calculation-dialog';
import { ConfigurationSearch } from '../actions/configuration-search';
import { Results } from '../actions/results';
import { ProcessStateSelectors } from './process-state.selectors';
import { WorkStepInformation } from '../actions/work-step-information';
import { SyncingRightMat017ItemPriceToLeft } from '../actions/right-connector/right-connector';
import { SyncingLeftMat017ItemPriceToRight } from '../actions/left-connector/left-connector';
@Injectable({
  providedIn: 'root',
})
export class ProcessStateFacadeService {
  @Select(ProcessStateSelectors.relatedSingleCableCalculationsOfCalculation())
  public relatedSingleCableCalculationsOfCalculation$!: Observable<SingleCableCalculationPresentation[]>;

  @Select(ProcessStateSelectors.relatedSingleCableCalculationsOfConfiguration())
  public relatedSingleCableCalculationsOfConfiguration$: Observable<SingleCableCalculationPresentation[]>;

  @Select(ProcessStateSelectors.selectedSingleCableCalculationWithRelations())
  public selectedSingleCableCalculation$!: Observable<SingleCableCalculationPresentation>;

  @Select(ProcessStateSelectors.selectedConfiguration())
  public selectedConfigurationItem$: Observable<ConfigurationPresentation>;

  @Select(ProcessStateSelectors.selectedConfigurationData())
  public selectedConfigurationData$: Observable<ConfigurationPresentation | ConfigurationSnapshotPresentationData>;

  @Select(ProcessStateSelectors.selectedProcessResult())
  public selectedProcessResult$: Observable<SelectedProcessResult>;

  @Select(ProcessStateSelectors.isValidSelector())
  public isValid$: Observable<boolean>;

  @Select(ProcessStateSelectors.isChainflexValid())
  public isValidChainflex$: Observable<boolean>;

  @Select(ProcessStateSelectors.isLeftConnectorValid())
  public isLeftConnectorValid$: Observable<boolean>;

  @Select(ProcessStateSelectors.isLibraryValid())
  public isLibraryValid$: Observable<boolean>;

  @Select(ProcessStateSelectors.isLocked())
  public isLocked$: Observable<boolean | null>;

  @Select(ProcessStateSelectors.metaDataViewModel())
  public metaDataViewModel$: Observable<MetaDataViewModel>;

  @Select(ProcessStateSelectors.isSingleCableCalculationLoading())
  public isSingleCableCalculationLoading$: Observable<boolean>;

  @Select(ProcessStateSelectors.isSavingSingleCableCalculation())
  public isSavingSingleCableCalculation$: Observable<boolean>;

  @Select(ProcessStateSelectors.isExcelFileDownloading())
  public isExcelFileDownloading$: Observable<boolean>;

  @Select(ProcessStateSelectors.chainflexCableLength())
  public chainflexCableLength$: Observable<number>;

  @Select(ProcessStateSelectors.chainflexCable())
  public chainflexCable$: Observable<ChainflexCable>;

  @Select(ProcessStateSelectors.selectedConfigurationData())
  public processResults$: Observable<ProcessManyResult>;

  @Select(ProcessStateSelectors.chainflexCableStructure())
  public chainflexCableStructure$: Observable<LocalizedStrings>;

  @Select(ProcessStateSelectors.chainflexPricesHaveChanged())
  public chainflexPricesHaveChanged$: Observable<boolean>;

  @Select(ProcessStateSelectors.checkForNewChainflexPricesResult())
  public checkForNewChainflexPricesResult$: Observable<CheckForNewChainflexPricesResult>;

  @Select(ProcessStateSelectors.chainflexListWithNewPrices())
  public chainflexListWithNewPrices$: Observable<ChainflexPriceDeviation[]>;

  @Select(ProcessStateSelectors.mat017ItemListWithNewPrices())
  public mat017ItemListWithNewPrices$: Observable<ConfigurationWithMat017ItemsChanges[]>;

  @Select(ProcessStateSelectors.mat017ItemListWithNoPrices())
  public mat017ItemListWithNoPrices$: Observable<ConfigurationWithMat017ItemsChanges[]>;

  @Select(ProcessStateSelectors.hasAnyMat017ItemPriceChanged())
  public hasAnyMat017ItemPriceChange$: Observable<boolean>;

  @Select(ProcessStateSelectors.hasInvalidOrRemovedItems())
  public hasInvalidOrRemovedItems$: Observable<boolean>;

  @Select(ProcessStateSelectors.chainflexListWithNoPrices())
  public chainflexListWithNoPrices$: Observable<ChainflexPriceDeviationContainer[]>;

  @Select(ProcessStateSelectors.shouldInformAboutMissingChainflexPrices())
  public shouldInformAboutMissingChainflexPrices$: Observable<boolean>;

  @Select(ProcessStateSelectors.shouldInformAboutMissingMat017ItemPrices())
  public shouldInformAboutMissingMat017ItemPrices$: Observable<boolean>;

  @Select(ProcessStateSelectors.chainflexesAndPricesAvailable())
  public chainflexesAndPricesAvailable$: Observable<boolean>;

  @Select(ProcessStateSelectors.mat017ItemsLatestModificationDate())
  public mat017ItemsLatestModificationDate$: Observable<Date>;

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  @Dispatch()
  public enteringMetaDataPageStarted = () => new MetaData.EnteringMetaDataPage.Started();

  @Dispatch()
  public enteringMetaDataPageEntered = () => new MetaData.EnteringMetaDataPage.Entered();

  @Dispatch()
  public enteringResultsPageStarted = () => new Results.EnteringResultsPage.Started();

  @Dispatch()
  public enteringResultsPageEntered = () => new Results.EnteringResultsPage.Entered();

  @Dispatch()
  public leavingResultsPageStarted = () => new Results.LeavingResultsPage.Started();

  @Dispatch()
  public startingNewCalculationFromResultsSubmitted = () => new Results.StartingNewCalculation.Submitted();

  @Dispatch()
  public startingNewConfigurationFromResultsStarted = () => new Results.StartingNewConfiguration.Submitted();

  @Dispatch()
  public resettingSelectionSubmitted = () => new MetaData.ResettingSelection.Submitted();

  @Dispatch()
  public updatingCalculationDataSubmitted = (payload: UpdateCalculationRequestDto) =>
    new Results.UpdatingCalculationData.Submitted(payload);

  @Dispatch()
  public updatingSingleCableCalculationAndConfigurationData = (payload: UpdatingSingleCableCalculationDataPayload) =>
    new Results.UpdatingSingleCableCalculationAndConfigurationData.Submitted(payload);

  @Dispatch()
  public selectingCalculationInMetaDataStarted = (payload: { singleCableCalculationId: string }) =>
    new MetaData.SelectingCalculation.Started(payload);

  @Dispatch()
  public selectingConfigurationInMetaDataStarted = (payload: { singleCableCalculationId: string }) =>
    new MetaData.SelectingConfiguration.Started(payload);

  @Dispatch()
  public selectingSingleCableCalculationResultsStarted = (payload: { singleCableCalculationId: string }) =>
    new Results.SelectingSingleCableCalculation.Started(payload);

  @Dispatch()
  public selectingConfigurationInConfigurationSearchStarted = (payload: { configurationId: string }) =>
    new ConfigurationSearch.SelectingConfiguration.Started(payload);

  @Dispatch()
  public updatingMetaDataStarted = (payload: MetaDataViewModel) => new MetaData.UpdatingMetaData.Started(payload);

  @Dispatch()
  public submittingWorkStepsFormSubmitted = (payload: SubmittingWorkStepsFormPayload) =>
    new Results.SubmittingWorkStepsForm.Submitted(payload);

  @Dispatch()
  public changingWorkStepsSetsStarted = (payload: { workStepSet: WorkStepSet }) =>
    new Results.ChangingWorkStepSets.Started(payload);

  @Dispatch()
  public changeSelectedTab = (selectedTabIndex: number): ChangeSelectedTab => new ChangeSelectedTab(selectedTabIndex);

  @Dispatch()
  public creatingNewCalculationAndNewConfigurationSubmitted = (payload: CreateCalculationAndConfigurationRequestDto) =>
    new MetaData.CreatingNewCalculationAndConfiguration.Submitted(payload);

  @Dispatch()
  public createNewConfigurationForExistingCalculationSubmitted = (
    payload: CreateNewConfigurationForExistingCalculationRequestDto
  ) => new MetaData.CreatingNewConfigurationForExistingCalculation.Submitted(payload);

  @Dispatch()
  public assignConfigurationToExistingCalculation = (payload: {
    reProcess?: boolean;
    configurationId?: string;
    singleCableCalculationBaseData?: SingleCableCalculationBaseData;
  }) => {
    return new AssignConfigurationDialog.AssigningConfigurationToExistingCalculation.Submitted(payload);
  };

  @Dispatch()
  public removeLinkBetweenConfigurationAndCalculationDialogStarted = () =>
    new RemoveLinkBetweenConfigurationAndCalculationDialog.RemovingLinkBetweenConfigurationAndCalculation.Started();

  @Dispatch()
  public removeLinkBetweenConfigurationAndCalculationDialogOpened = () =>
    new RemoveLinkBetweenConfigurationAndCalculationDialog.OpeningDialog.Opened();

  @Dispatch()
  public exportExcelFile = (payload: {
    productionPlan?: boolean;
    calculation?: boolean;
    selectedDownloadOption: FileDownloadOptions;
  }): ExportExcelFile => {
    return new ExportExcelFile(payload);
  };

  @Dispatch()
  public copyingConfigurationToExistingCalculationSubmitted = (
    payload: CopyConfigurationToExistingCalculationRequestDto
  ) => {
    return new CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted(
      payload
    );
  };

  @Dispatch()
  public duplicatingCalculationSubmitted = (payload: DuplicatingCalculationRequestDto) =>
    new MetaData.DuplicatingCalculation.Submitted(payload);

  @Dispatch()
  public selectingCalculationStarted = (payload: { calculationId: string }) =>
    new CalculationSearch.SelectingCalculation.Started(payload);

  @Dispatch()
  public copyingConfigurationToNewCalculationInMetaDataSubmitted = (payload: CopyConfigurationToNewCalculationDto) =>
    new MetaData.CopyingConfigurationToNewCalculation.Submitted(payload);

  @Dispatch()
  public openingWorkStepInformationPopupStarted = () =>
    new WorkStepInformation.OpeningWorkStepInformationPopup.Started();

  @Dispatch()
  public updatingChainflexPricesSubmitted = (payload: string[]) =>
    new Results.UpdatingChainflexPrices.Submitted(payload);

  @Dispatch()
  public updatingMat017ItemPricesSubmitted = () => new Results.UpdatingMat017ItemPrices.Submitted();

  @Dispatch()
  public removingMat017ItemFromConfigurationsSubmitted = (payload: RemovedMat017ItemFormModel[]) =>
    new Results.RemovingMat017ItemFromConfigurations.Submitted(payload);

  @Dispatch()
  public removingChainflexDataFromConfigurationsSubmitted = (payload: string[]) =>
    new Results.RemovingChainflexDataFromConfigurations.Submitted(payload);

  @Dispatch()
  public syncRightMat017ItemPriceToLeft = (payload: {
    mat017ItemsWithMismatch: string[];
    currentConnectorSide: 'leftConnector';
  }) => new SyncingRightMat017ItemPriceToLeft.Started(payload);

  @Dispatch()
  public syncLeftMat017ItemPriceToRight = (payload: {
    mat017ItemsWithMismatch: string[];
    currentConnectorSide: 'rightConnector';
  }) => new SyncingLeftMat017ItemPriceToRight.Started(payload);

  public currentSelectedCalculationIdSnapshot(): string {
    return this.store.selectSnapshot(ProcessStateSelectors.currentSelectedCalculationId());
  }

  public currentSelectedConfigurationIdSnapshot(): string {
    return this.store.selectSnapshot(ProcessStateSelectors.currentSelectedConfigurationId());
  }

  public processDataForExcelExport(): ProcessDataForExcelExport {
    return this.store.selectSnapshot(ProcessStateSelectors.processDataForExcelExport());
  }

  public currentSelectedSingleCableCalculationId(): string {
    return this.store.selectSnapshot(ProcessStateSelectors.currentSelectedSingleCableCalculationId());
  }

  public isLocked(): boolean {
    return this.store.selectSnapshot(ProcessStateSelectors.isLocked());
  }

  public copyingConfigurationToExistingCalculationResult$(): Observable<{
    hasValidationFailed?: boolean;
    hasSucceeded?: boolean;
  }> {
    return merge(
      this.actions$.pipe(
        ofActionSuccessful(Api.CopyingConfigurationToExistingCalculation.ValidationFailed),
        map(() => ({ hasValidationFailed: true }))
      ),
      this.actions$.pipe(
        ofActionSuccessful(Api.CopyingConfigurationToExistingCalculation.Succeeded),
        map(() => ({ hasSucceeded: true }))
      )
    );
  }

  public hasCheckedNewChainflexPricesAndMat017ItemsOverridesChangesSuccessfully$(): Observable<
    [Api.CheckingForNewChainflexPrices.Succeeded, Api.CheckingForMat017ItemsOverridesChanges.Succeeded]
  > {
    return combineLatest([
      this.actions$.pipe(ofActionSuccessful(Api.CheckingForNewChainflexPrices.Succeeded)),
      this.actions$.pipe(ofActionSuccessful(Api.CheckingForMat017ItemsOverridesChanges.Succeeded)),
    ]);
  }

  public processState$(): Observable<IcalcStepsState> {
    return this.store.select((state) => {
      const {
        processResults,
        calculationTotalPrice,
        allResultsValid,
        isLocked,
        chainflexesAndPricesAvailable,
        chainflexPricesHaveChanged,
      } = state.ProcessState as ProcessStateModel;

      return {
        processResults,
        calculationTotalPrice,
        allResultsValid,
        isLocked,
        chainflexesAndPricesAvailable,
        chainflexPricesHaveChanged,
      };
    });
  }

  public processStateSnapshot(): IcalcStepsState {
    return this.store.selectSnapshot((state) => {
      const { processResults, calculationTotalPrice, allResultsValid } = state.ProcessState as ProcessStateModel;

      return {
        processResults,
        calculationTotalPrice,
        allResultsValid,
      };
    });
  }

  public informUserAboutWorkSteps$(): Observable<InformUserAboutWorkSteps[]> {
    return this.store.select((state) => (state.ProcessState as ProcessStateModel).informUserAboutWorkSteps);
  }

  public processServerError$(): Observable<IcalcHTTPError> {
    return this.store.select((state) => (state.ProcessState as ProcessStateModel).processServerError);
  }

  public isProcessing$(): Observable<boolean> {
    return this.store.select((state) => (state.ProcessState as ProcessStateModel).isProcessing);
  }

  public calculationTotalPrice$(): Observable<number> {
    return this.store.select((state) => (state.ProcessState as ProcessStateModel).calculationTotalPrice);
  }

  public allResultsValid$(): Observable<boolean> {
    return this.store.select((state) => (state.ProcessState as ProcessStateModel).allResultsValid);
  }

  public selectedTabIndex$(): Observable<number> {
    return this.store.select((state) => (state.ProcessState as ProcessStateModel).selectedTabIndex);
  }

  public hasCreatedConfigurationForExistingCalculationSuccessfully$(): Observable<Api.CreatingNewConfigurationForExistingCalculation.Succeeded> {
    return this.actions$.pipe(ofActionSuccessful(Api.CreatingNewConfigurationForExistingCalculation.Succeeded));
  }

  public hasCreatedNewCalculationAndConfigurationSuccessfully$(): Observable<Api.CreatingNewCalculationAndConfiguration.Succeeded> {
    return this.actions$.pipe(ofActionSuccessful(Api.CreatingNewCalculationAndConfiguration.Succeeded));
  }

  public canLinkBetweenConfigurationAndCalculationBeRemoved$(): Observable<CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto> {
    return this.actions$.pipe(
      ofActionSuccessful(Api.ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved.Succeeded),
      map((action: Api.ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved.Succeeded) => action.payload)
    );
  }

  public canLinkBetweenConfigurationAndCalculationBeRemovedFailed$(): Observable<HttpErrorResponse> {
    return this.actions$.pipe(
      ofActionSuccessful(Api.ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved.Failed),
      map((action: Api.ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved.Failed) => action.payload)
    );
  }
}
