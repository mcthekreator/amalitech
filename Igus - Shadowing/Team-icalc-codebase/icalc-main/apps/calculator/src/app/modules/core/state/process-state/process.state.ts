import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type {
  CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto,
  ChainflexPrice,
  CheckForNewChainflexPricesResult,
  ConfigurationConnectorStatePresentation,
  HaveMat017ItemsOverridesChangedResponseDto,
  IcalcLibrary,
  IcalcListInformation,
  Mat017ItemsLatestModificationDate,
  Mat017ItemWithWidenData,
  OneSideOfConfigurationConnector,
  OneSideOfConfigurationConnectorPresentation,
  PinAssignmentValidationResult,
  ProcessManyResult,
  RemoveChainflexDataResponseDto,
  RemoveLinkBetweenConfigurationAndCalculationRequestDto,
  RemoveLinkBetweenConfigurationAndCalculationResponseDto,
  RemoveMat017ItemsResponseDto,
  SaveSingleCableCalculationResponseDto,
  SetExcelDownloadFlagsForCalculationRequestDto,
  SetExcelDownloadFlagsForCalculationResponseDto,
  SingleCableCalculationPresentation,
  UpdateCalculationRequestDto,
  UpdateCalculationWithSCC,
  UpdateChainflexPricesResult,
  UpdateMat017ItemsOverridesInConfigurationsResponseDto,
  WidenData,
  WidenDataItem,
  WorkStepType,
} from '@igus/icalc-domain';
import {
  ArrayUtils,
  cacheBustMat017ImageUrl,
  getUniqueMatNumbersOfMat017ItemsFromConfigurations,
  updateUrlsInMat017ItemListWithWidenData,
  WIDEN_EMBED_FORMAT,
  CalculationLockActionEnum,
  FileFormatEnum,
  NumberUtils,
  ObjectUtils,
  StringUtils,
} from '@igus/icalc-domain';

import { Action, State, StateContext, Store } from '@ngxs/store';
import type { Observable } from 'rxjs';
import { forkJoin, filter, iif, map, mergeMap, of, tap, switchMap, take, retry, finalize } from 'rxjs';

import { addEntity, createGetDefaultStateItemValue, patchEntity } from '../../utils';

import { ChangeSelectedTab, ExportExcelFile } from './process-state.actions';
import type {
  ConfigurationUiEntity,
  ExcelRequestParams,
  ProcessEntitiesStateModel,
  ProcessStateModel,
} from './process-state.model';

import { Api } from '../actions/api';
import { RemoveLinkBetweenConfigurationAndCalculationDialog } from '../actions/remove-link-between-configuration-and-calculation-dialog';
import { MetaData } from '../actions/meta-data';
import { ConfigurationApiService } from '../../data-access/configuration-api.service';
import { CalculationApiService } from '../../data-access/calculation-api.service';

import { Results } from '../actions/results';
import { ProcessApiService } from '../../data-access/process-api.service';
import { ProcessStateMappers } from './process-state.mappers';
import { AppState } from '../app-state/app.state';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import { SingleCableCalculationApiService } from '../../data-access/single-cable-calculation-api.service';
import { FileSaverService } from 'ngx-filesaver';
import { ExcelReportService } from '../../../features/results/services/excel-report.service';
import { CalculationSearch } from '../actions/calculation-search';
import type { ɵPatchSpec } from '@ngxs/store/operators';
import { compose, iif as ngxsIif, patch, updateItem } from '@ngxs/store/operators';
import { ConfigurationSearch } from '../actions/configuration-search';
import { PinAssignment } from '../actions/pin-assignment';
import { Library } from '../actions/library';
import { LeftConnector } from '../actions/left-connector';
import { RightConnector } from '../actions/right-connector';
import { Chainflex } from '../actions/chainflex';
import { AssignConfigurationDialog } from '../actions/assign-configuration-dialog';
import { ProcessStateMutations } from './process-state.mutations';
import { WorkStepInformation } from '../actions/work-step-information';
import { ProcessStateSelectors } from './process-state.selectors';
import { CopyConfigurationToExistingCalculationDialog } from '../actions/copy-configuration-to-existing-calculation-dialog';
import { Mat017ItemApiService } from '../../data-access/mat017-item-api.service';
import { WidenApiService } from '../../data-access/widen-api.service';

export const defaultConfigurationListInformation = {
  orderDirection: 'asc',
  search: '',
  skip: 0,
  take: 100,
  orderBy: 'matNumber',
} as IcalcListInformation;

export const defaultCalculationListInformation = {
  orderDirection: 'asc',
  search: '',
  skip: 0,
  take: 100,
  orderBy: 'calculationNumber',
} as IcalcListInformation;

const processStateDefaults: ProcessStateModel = {
  calculationTotalPrice: null,
  allResultsValid: false,
  informUserAboutWorkSteps: [],
  processResults: [],
  processServerError: null,
  isProcessing: false,
  isSavingSingleCableCalculation: false,
  isSingleCableCalculationLoading: false,
  isLocked: false,
  mat017ItemsModification: {
    hasAmountDividedByPriceUnitChanged: false,
    hasInvalidOrRemovedItems: false,
    configurations: null,
  },
  chainflexesAndPricesAvailable: true,
  chainflexPricesHaveChanged: false,
  checkForNewChainflexPricesResult: null,
  selectedTabIndex: 0,
  calculationIdForCreatingNewConfiguration: null,
  selectedSingleCableCalculationId: null,
  mat017ItemsLatestModificationDate: null,
  isExcelFileDownloading: false,
  entities: {
    calculations: {
      items: {},
      ids: [],
    },
    configurations: {
      items: {},
      ids: [],
    },
    singleCableCalculations: {
      items: {},
      ids: [],
    },
    snapshots: {
      items: {},
      ids: [],
    },
  },
};

export const getDefaultFromProcessState = createGetDefaultStateItemValue(processStateDefaults);

@Injectable()
@State<ProcessStateModel>({
  name: 'ProcessState',
  defaults: { ...processStateDefaults },
})
export class ProcessState {
  constructor(
    private singleCableCalculationApiService: SingleCableCalculationApiService,
    private fileSaverService: FileSaverService,
    private excelReportService: ExcelReportService,
    private configurationApiService: ConfigurationApiService,
    private calculationApiService: CalculationApiService,
    private store: Store,
    private processApiService: ProcessApiService,
    private mat017ItemApiService: Mat017ItemApiService,
    private widenApiService: WidenApiService
  ) {}

  @Action(RemoveLinkBetweenConfigurationAndCalculationDialog.RemovingLinkBetweenConfigurationAndCalculation.Started)
  public removeLinkBetweenConfigurationAndCalculation(context: StateContext<ProcessStateModel>) {
    const state = context.getState();
    const payload: RemoveLinkBetweenConfigurationAndCalculationRequestDto =
      ProcessStateMappers.toRemoveLinkBetweenConfigurationAndCalculationRequestDto(state);

    return this.calculationApiService.removeLinkBetweenConfigurationAndCalculation(payload).pipe(
      tap((result: RemoveLinkBetweenConfigurationAndCalculationResponseDto | null) => {
        if (result === null) {
          return;
        }

        context.dispatch(new Api.RemovingLinkBetweenConfigurationAndCalculation.Succeeded(result));
      })
    );
  }

  @Action([MetaData.ResettingSelection.Submitted, Results.StartingNewCalculation.Submitted])
  public resetSelection(context: StateContext<ProcessStateModel>) {
    const { setState } = context;

    setState(
      patch({
        selectedSingleCableCalculationId: null,
      })
    );
  }

  @Action([Results.StartingNewConfiguration.Submitted])
  public resetSelectionForNewConfigurationFromResults(context: StateContext<ProcessStateModel>) {
    const { getState, setState } = context;
    const state = getState();

    const { id } = ProcessStateMappers.toSelectedCalculationEntity(state);

    setState(
      patch({
        calculationIdForCreatingNewConfiguration: id,
        selectedSingleCableCalculationId: null,
      })
    );
  }

  @Action([Results.LeavingResultsPage.Started])
  public resetProcessState(context: StateContext<ProcessStateModel>) {
    const { setState } = context;

    setState(
      patch({
        calculationTotalPrice: getDefaultFromProcessState('calculationTotalPrice'),
        allResultsValid: getDefaultFromProcessState('allResultsValid'),
        processResults: getDefaultFromProcessState('processResults'),
        chainflexesAndPricesAvailable: getDefaultFromProcessState('chainflexesAndPricesAvailable'),
        chainflexPricesHaveChanged: getDefaultFromProcessState('chainflexPricesHaveChanged'),
        checkForNewChainflexPricesResult: getDefaultFromProcessState('checkForNewChainflexPricesResult'),
        mat017ItemsModification: getDefaultFromProcessState('mat017ItemsModification'),
        mat017ItemsLatestModificationDate: getDefaultFromProcessState('mat017ItemsLatestModificationDate'),
      })
    );
  }

  @Action([
    MetaData.SelectingCalculation.Started,
    MetaData.SelectingConfiguration.Started,
    Results.SelectingSingleCableCalculation.Started,
    Api.LockingCalculation.Succeeded,
  ])
  public findAndSetSingleCableCalculationById(
    context: StateContext<ProcessStateModel>,
    action: MetaData.SelectingCalculation.Started
  ) {
    if (!action?.payload) {
      return;
    }

    const { singleCableCalculationId } = action.payload;

    context.patchState({
      isSingleCableCalculationLoading: true,
    });

    return this.singleCableCalculationApiService.fetchOneBySingleCableCalculationId(singleCableCalculationId).pipe(
      tap((result: SingleCableCalculationPresentation) => {
        context.dispatch(new Api.SelectingSingleCableCalculation.Succeeded(result));
      })
    );
  }

  @Action(CalculationSearch.SelectingCalculation.Started)
  public setSingleCableCalculationByCalculationId(
    context: StateContext<ProcessStateModel>,
    action: CalculationSearch.SelectingCalculation.Started
  ) {
    if (!action?.payload) {
      return;
    }

    context.patchState({
      isSingleCableCalculationLoading: true,
    });

    return this.singleCableCalculationApiService.fetchOneByCalculationId(action.payload.calculationId).pipe(
      tap((result: SingleCableCalculationPresentation) => {
        context.dispatch(new Api.SelectingCalculation.Succeeded(result));
      })
    );
  }

  @Action([
    Api.SelectingCalculation.Succeeded,
    Api.SelectingConfiguration.Succeeded,
    Api.SelectingSingleCableCalculation.Succeeded,
    Api.DuplicatingCalculation.Succeeded,
    Api.CopyingConfigurationToNewCalculation.Succeeded,
    Api.CreatingNewConfigurationForExistingCalculation.Succeeded,
    Api.CreatingNewCalculationAndConfiguration.Succeeded,
    Api.CopyingConfigurationToExistingCalculation.Succeeded,
    Api.AssigningConfigurationToExistingCalculation.Succeeded,
    Api.RemovingLinkBetweenConfigurationAndCalculation.Succeeded,
  ])
  public updateEntitiesInState(
    context: StateContext<ProcessStateModel>,
    action:
      | Api.SelectingCalculation.Succeeded
      | Api.SelectingConfiguration.Succeeded
      | Api.SelectingSingleCableCalculation.Succeeded
      | Api.DuplicatingCalculation.Succeeded
      | Api.CopyingConfigurationToNewCalculation.Succeeded
      | Api.CreatingNewConfigurationForExistingCalculation.Succeeded
      | Api.CreatingNewCalculationAndConfiguration.Succeeded
      | Api.CopyingConfigurationToExistingCalculation.Succeeded
      | Api.AssigningConfigurationToExistingCalculation.Succeeded
      | Api.RemovingLinkBetweenConfigurationAndCalculation.Succeeded
  ) {
    if (!action?.payload) {
      return;
    }

    this.updateSelectedSingleCableCalculationWithEntities(action.payload, context);
  }

  @Action(ConfigurationSearch.SelectingConfiguration.Started)
  public setSingleCableCalculationByConfigurationId(
    context: StateContext<ProcessStateModel>,
    action: ConfigurationSearch.SelectingConfiguration.Started
  ) {
    if (!action?.payload) {
      return;
    }

    return this.singleCableCalculationApiService.fetchOneByConfigurationId(action.payload.configurationId).pipe(
      tap((result: SingleCableCalculationPresentation) => {
        context.dispatch(new Api.SelectingConfiguration.Succeeded(result));
      })
    );
  }

  @Action(MetaData.CopyingConfigurationToNewCalculation.Submitted)
  public copyConfigurationToNewCalculation(
    context: StateContext<ProcessEntitiesStateModel>,
    action: MetaData.CopyingConfigurationToNewCalculation.Submitted
  ) {
    if (!action?.payload) {
      return;
    }

    return this.calculationApiService.copyConfigurationToNewCalculation(action.payload).pipe(
      tap((result: SingleCableCalculationPresentation) => {
        context.dispatch(new Api.CopyingConfigurationToNewCalculation.Succeeded(result));
      })
    );
  }

  @Action(MetaData.CreatingNewConfigurationForExistingCalculation.Submitted)
  public createNewConfigurationForExistingCalculation(
    context: StateContext<ProcessStateModel>,
    action: MetaData.CreatingNewConfigurationForExistingCalculation.Submitted
  ) {
    const { calculationId, configuration } = action.payload;

    if (!configuration && !calculationId) {
      return;
    }
    context.patchState({
      isSingleCableCalculationLoading: true,
    });

    return this.calculationApiService.createNewConfigurationForExistingCalculation(action.payload).pipe(
      tap((result) => {
        if (result === null) {
          context.patchState({
            isSingleCableCalculationLoading: false,
          });
          return;
        }
        context.dispatch(new Api.CreatingNewConfigurationForExistingCalculation.Succeeded(result));
      })
    );
  }

  @Action(MetaData.DuplicatingCalculation.Submitted)
  public duplicateCalculation(
    context: StateContext<ProcessEntitiesStateModel>,
    action: MetaData.DuplicatingCalculation.Submitted
  ) {
    if (!action?.payload) {
      return;
    }

    return this.calculationApiService.duplicateCalculation(action.payload).pipe(
      tap((result: SingleCableCalculationPresentation) => {
        context.dispatch(new Api.DuplicatingCalculation.Succeeded(result));
      })
    );
  }

  @Action(MetaData.CreatingNewCalculationAndConfiguration.Submitted)
  public createNewCalculationAndNewConfiguration(
    context: StateContext<ProcessStateModel>,
    action: MetaData.CreatingNewCalculationAndConfiguration.Submitted
  ) {
    const payload = action.payload;

    payload.calculation.calculationFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(
      payload.calculation.calculationFactor
    );

    context.patchState({
      isSingleCableCalculationLoading: true,
    });

    return this.calculationApiService.createNewCalculationAndConfiguration(payload).pipe(
      tap((result) => {
        if (result === null) {
          context.patchState({
            isSingleCableCalculationLoading: false,
          });
          return;
        }

        context.dispatch(new Api.CreatingNewCalculationAndConfiguration.Succeeded(result));
      })
    );
  }

  @Action(AssignConfigurationDialog.AssigningConfigurationToExistingCalculation.Submitted)
  public assignConfigurationToExistingCalculation(
    context: StateContext<ProcessStateModel>,
    action: AssignConfigurationDialog.AssigningConfigurationToExistingCalculation.Submitted
  ) {
    const { dispatch, getState, patchState } = context;
    const state = getState();

    const calculationId =
      state.entities.singleCableCalculations.items[state.selectedSingleCableCalculationId].calculationId;

    if (!action?.payload?.singleCableCalculationBaseData && !action.payload?.configurationId && !calculationId) {
      return;
    }

    return this.calculationApiService
      .assignConfigurationToExistingCalculation({
        calculationId,
        configurationId: action?.payload?.configurationId,
        singleCableCalculationBaseData: action?.payload?.singleCableCalculationBaseData,
      })
      .pipe(
        map((result) => {
          if (result === null) {
            patchState({
              isSingleCableCalculationLoading: getDefaultFromProcessState('isSingleCableCalculationLoading'),
            });
          }
          return result;
        }),
        filter((result) => !!result),
        mergeMap((result) => {
          return dispatch(new Api.AssigningConfigurationToExistingCalculation.Succeeded(result));
        })
      );
  }

  @Action(Chainflex.LeavingChainflexPage.Started)
  public updateChainflexData(context: StateContext<ProcessStateModel>, action: Chainflex.LeavingChainflexPage.Started) {
    const { getState } = context;
    const state = getState();

    const chainflexCableLength = action.payload.chainflexCableLength;
    const chainflexCable = action.payload.chainflexCable;

    const selectedSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    // avoid updating for locked calculations
    if (selectedSingleCableCalculation.calculation.isLocked) {
      return;
    }

    const currentConfiguration = selectedSingleCableCalculation.configuration;
    const hasOwnChainFlexState = !!currentConfiguration.state.chainFlexState;
    const currentChainflexCableId = currentConfiguration.state.chainFlexState?.chainflexCable?.id;

    const hasChainflexSelectionChanged = currentChainflexCableId !== action.payload.chainflexCable?.id;
    const hasChainflexLengthChanged = selectedSingleCableCalculation.chainflexLength !== chainflexCableLength;

    if (!hasChainflexLengthChanged && !hasChainflexSelectionChanged) {
      return;
    }

    const { singleCableCalculation, informUserAboutWorkSteps } =
      ProcessStateMutations.removeOverridesRelatedToChainflex(
        state,
        selectedSingleCableCalculation,
        action.payload.chainflexCable
      );

    ObjectUtils.setNestedValue(
      singleCableCalculation.configuration.state,
      ['chainFlexState', 'chainflexCable'],
      action.payload.chainflexCable
    );

    singleCableCalculation.chainflexLength = chainflexCableLength;

    context.setState(
      patch({
        ...(informUserAboutWorkSteps ? { informUserAboutWorkSteps } : {}),
        entities: patch({
          singleCableCalculations: patchEntity(singleCableCalculation.id, {
            chainflexLength: singleCableCalculation.chainflexLength,
            commercialWorkStepOverrides: singleCableCalculation.commercialWorkStepOverrides,
          }),
          configurations: patchEntity(singleCableCalculation.configurationId, {
            state: patch({
              chainFlexState: hasOwnChainFlexState
                ? patch({
                    chainflexCable,
                  })
                : {
                    chainflexCable,
                  },
              workStepOverrides: singleCableCalculation.configuration.state.workStepOverrides,
              pinAssignmentState: singleCableCalculation.configuration.state.pinAssignmentState,
            }),
          }),
        }),
      })
    );

    const saveRequestDto = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(singleCableCalculation, [
      'chainFlexState',
      'pinAssignmentState',
      'workStepOverrides',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(saveRequestDto).pipe(
      mergeMap((result) => {
        return context.dispatch(new Api.UpdatingChainflex.Succeeded(result));
      })
    );
  }

  @Action(LeftConnector.LeavingLeftConnectorPage.Started)
  public updateLeftConnectorData(
    context: StateContext<ProcessStateModel>,
    action: LeftConnector.LeavingLeftConnectorPage.Started
  ) {
    const { getState, setState } = context;
    const state = getState();

    const selectedSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    // avoid updating for locked calculations
    if (selectedSingleCableCalculation.snapshotId) {
      return;
    }

    const currentLeftConnectorState = ObjectUtils.cloneDeep<OneSideOfConfigurationConnector>(
      selectedSingleCableCalculation.configuration.state?.connectorState?.leftConnector
    );

    ObjectUtils.setNestedValue(
      selectedSingleCableCalculation.configuration.state,
      ['connectorState', 'leftConnector'],
      action.payload.leftConnector
    );

    const { singleCableCalculation, informUserAboutWorkSteps } =
      ProcessStateMutations.removeOverridesRelatedToConnectors(
        state,
        selectedSingleCableCalculation,
        currentLeftConnectorState,
        'leftConnector'
      );

    const newLeftConnector = singleCableCalculation.configuration.state.connectorState?.leftConnector;
    const hasConnectorState = !!currentLeftConnectorState;
    const existingRightConnector = singleCableCalculation.configuration.state.connectorState?.rightConnector;

    setState(
      patch({
        ...(informUserAboutWorkSteps ? { informUserAboutWorkSteps } : {}),
        isSavingSingleCableCalculation: true,
        entities: patch({
          configurations: patchEntity(singleCableCalculation.configurationId, {
            state: patch({
              connectorState: ngxsIif(
                hasConnectorState,
                patch({
                  leftConnector: newLeftConnector,
                }),
                {
                  ...(existingRightConnector && { rightConnector: existingRightConnector }),
                  leftConnector: newLeftConnector,
                } as ConfigurationConnectorStatePresentation
              ),
            }),
          }),
        }),
      })
    );

    const saveRequestDto = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(singleCableCalculation, [
      'connectorState',
      'workStepOverrides',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(saveRequestDto).pipe(
      tap((result) => {
        context.dispatch(new Api.UpdatingLeftConnector.Succeeded(result));
      })
    );
  }

  @Action(RightConnector.LeavingRightConnectorPage.Started)
  public updateRightConnectorData(
    context: StateContext<ProcessStateModel>,
    action: RightConnector.LeavingRightConnectorPage.Started
  ) {
    const { setState, getState } = context;
    const state = getState();

    const selectedSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    // avoid updating for locked calculations
    if (selectedSingleCableCalculation.snapshotId) {
      return;
    }

    const currentRightConnectorState = ObjectUtils.cloneDeep<OneSideOfConfigurationConnector>(
      selectedSingleCableCalculation.configuration.state?.connectorState?.rightConnector
    );

    ObjectUtils.setNestedValue(
      selectedSingleCableCalculation.configuration.state,
      ['connectorState', 'rightConnector'],
      action.payload.rightConnector
    );

    const { singleCableCalculation, informUserAboutWorkSteps } =
      ProcessStateMutations.removeOverridesRelatedToConnectors(
        state,
        selectedSingleCableCalculation,
        currentRightConnectorState,
        'rightConnector'
      );

    const newRightConnector = singleCableCalculation.configuration.state.connectorState.rightConnector;

    setState(
      patch({
        ...(informUserAboutWorkSteps ? { informUserAboutWorkSteps } : {}),
        isSavingSingleCableCalculation: true,
        entities: patch({
          configurations: patchEntity(singleCableCalculation.configurationId, {
            state: patch({
              connectorState: patch({
                rightConnector: newRightConnector,
              }),
            }),
          }),
        }),
      })
    );

    const saveRequestDto = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(singleCableCalculation, [
      'connectorState',
      'workStepOverrides',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(saveRequestDto).pipe(
      tap((result) => {
        context.dispatch(new Api.UpdatingRightConnector.Succeeded(result));
      })
    );
  }

  @Action(Api.UpdatingConnectorOverrides.Succeeded)
  public updateConnectorOverrides(
    context: StateContext<ProcessStateModel>,
    action: Api.UpdatingConnectorOverrides.Succeeded
  ): void {
    const updatedConfigurationsResponse = action.payload;
    const { setState, getState } = context;
    const { updateConfigurations, atLeastOneConfigurationApprovalRevoked } = updatedConfigurationsResponse.reduce(
      (acc, updatedConfiguration) => {
        const isApprovalRevoked = updatedConfiguration.calculationConfigurationStatus.hasApprovalBeenRevoked;

        acc.atLeastOneConfigurationApprovalRevoked = acc.atLeastOneConfigurationApprovalRevoked || isApprovalRevoked;

        const patchedConfig = patchEntity<ConfigurationUiEntity>(updatedConfiguration.configurationId, {
          state: patch({
            connectorState: updatedConfiguration.connectorState,
            workStepOverrides: updatedConfiguration.workStepOverrides,
          }),
        });

        acc.updateConfigurations = [...acc.updateConfigurations, patchedConfig];

        return acc;
      },
      { updateConfigurations: [], atLeastOneConfigurationApprovalRevoked: false }
    );

    setState(
      patch({
        entities: patch({
          configurations: compose(...updateConfigurations),
        }),
        informUserAboutWorkSteps: ProcessStateMutations.addInformAboutWorkSteps(
          getState(),
          updatedConfigurationsResponse
        ),
      })
    );
    if (atLeastOneConfigurationApprovalRevoked) {
      context.dispatch(new Api.RevokingConfigurationApproval.Succeeded());
    }
  }

  @Action([
    LeftConnector.SyncingLeftMat017ItemPriceToRight.Started,
    RightConnector.SyncingRightMat017ItemPriceToLeft.Started,
  ])
  public syncMat017ItemPriceInOtherSideOfConnector(
    context: StateContext<ProcessStateModel>,
    action:
      | LeftConnector.SyncingLeftMat017ItemPriceToRight.Started
      | RightConnector.SyncingRightMat017ItemPriceToLeft.Started
  ) {
    const otherConnectorSide =
      action.payload.currentConnectorSide === 'leftConnector' ? 'rightConnector' : 'leftConnector';
    const affectedMat017Items = action.payload.mat017ItemsWithMismatch;
    const { getState, setState } = context;
    const state = getState();

    const selectedSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    if (selectedSingleCableCalculation.snapshotId) {
      return;
    }

    setState(
      patch({
        entities: patch({
          configurations: patchEntity(selectedSingleCableCalculation.configurationId, {
            state: patch({
              connectorState: patch({
                [otherConnectorSide]: patch({
                  mat017ItemListWithWidenData: updateItem<Mat017ItemWithWidenData>(
                    (item) => affectedMat017Items.includes(item.matNumber),
                    (item) => ({
                      ...item,
                      overrides: {
                        ...item.overrides,
                        amountDividedByPriceUnit: item.amountDividedByPriceUnit,
                      },
                    })
                  ),
                }),
              }),
            }),
          }),
        }),
      })
    );
  }

  @Action([LeftConnector.CloningMat017ItemList.Cloned, RightConnector.CloningMat017ItemList.Cloned])
  public cloneMat017ItemListWithWidenData(
    context: StateContext<ProcessStateModel>,
    action: LeftConnector.CloningMat017ItemList.Cloned | RightConnector.CloningMat017ItemList.Cloned
  ) {
    if (action.payload && (action.payload.which === 'rightConnector' || action.payload.which === 'leftConnector')) {
      const state = context.getState();

      const currentSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
        ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
      );
      const sccId = currentSingleCableCalculation.id;

      const targetConnector = action.payload.which === 'rightConnector' ? 'leftConnector' : 'rightConnector';
      const status = action.payload.which === 'rightConnector' ? 'left' : 'right';

      const {
        singleCableCalculation: {
          commercialWorkStepOverrides,
          configuration: {
            state: { workStepOverrides },
          },
        },
        informUserAboutWorkSteps,
      } = ProcessStateMutations.removeOverridesAfterCloningConnector(state, currentSingleCableCalculation);

      const currentConfiguration = currentSingleCableCalculation.configuration;
      const clonedConnectorState: OneSideOfConfigurationConnectorPresentation = ObjectUtils.cloneDeep(
        action.payload.data
      );

      const { addedMat017Items } = clonedConnectorState;
      const mat017ItemListWithWidenData = ObjectUtils.cloneDeep<Mat017ItemWithWidenData[]>(
        clonedConnectorState.mat017ItemListWithWidenData
      )?.map((item) => ({ ...item, status }));

      const hasConnectorState = !!currentSingleCableCalculation.configuration.state?.connectorState?.[targetConnector];

      context.setState(
        patch({
          ...(informUserAboutWorkSteps ? { informUserAboutWorkSteps } : {}),
          entities: patch({
            singleCableCalculations: patchEntity(sccId, {
              commercialWorkStepOverrides,
            }),
            configurations: patchEntity(currentConfiguration.id, {
              state: patch({
                connectorState: ngxsIif(
                  hasConnectorState,
                  patch({
                    [targetConnector]: patch({
                      addedMat017Items,
                      mat017ItemListWithWidenData,
                    }),
                  }),
                  {
                    [targetConnector]: {
                      addedMat017Items,
                      mat017ItemListWithWidenData,
                    },
                  } as unknown as ConfigurationConnectorStatePresentation
                ),
                workStepOverrides,
              }),
            }),
          }),
        })
      );
    }
  }

  @Action(Library.AddingWidenImage.Started)
  public addWidenImageToMat017Item(context: StateContext<ProcessStateModel>, action: Library.AddingWidenImage.Started) {
    const payload = action.payload;

    return this.widenApiService.uploadImage(payload).pipe(
      switchMap((generatedUrl: string | null) => {
        if (generatedUrl === null) {
          return;
        }

        return this.widenApiService.getImage(generatedUrl).pipe(
          tap((widenDataItem: WidenDataItem | null) => {
            if (widenDataItem === null) {
              return;
            }
            const picUrl = cacheBustMat017ImageUrl(widenDataItem?.embeds?.[WIDEN_EMBED_FORMAT]?.url);
            const versionId = widenDataItem?.version_id;

            if (!picUrl) {
              return;
            }

            context.dispatch(
              new Api.FetchingImageFromWiden.Succeeded({
                update: {
                  [`${payload.titleTag}Url`]: picUrl,
                  [`${payload.titleTag}VersionId`]: versionId,
                },
                matNumber: payload.matNumber,
              })
            );
          }),
          retry({ count: 5, delay: 4000 }),
          finalize(() => {
            context.dispatch(
              new Library.AddingWidenImage.Succeeded({
                matNumber: payload.matNumber,
                titleTag: payload.titleTag,
              })
            );
          })
        );
      })
    );
  }

  @Action(Api.FetchingImageFromWiden.Succeeded)
  public updateImageInMat017ItemListElement(
    context: StateContext<ProcessStateModel>,
    action: Api.FetchingImageFromWiden.Succeeded
  ) {
    const { matNumber, update } = action.payload;

    this.updateMat017ItemWithWidenData(context, matNumber, update);
  }

  @Action(Library.EnteringLibraryPage.Started)
  public getWidenImagesForMat017Items(context: StateContext<ProcessStateModel>): Observable<WidenData> {
    const isLocked = this.store.selectSnapshot(ProcessStateSelectors.isLocked());

    const { getState } = context;
    const state = getState();

    const selectedSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    let itemsToRequest: Mat017ItemWithWidenData[] = [];
    let connectorState: ConfigurationConnectorStatePresentation;

    if (!isLocked) {
      connectorState = selectedSingleCableCalculation.configuration?.state?.connectorState;
    } else {
      connectorState = selectedSingleCableCalculation.snapshot?.configurationData?.state?.connectorState;
    }

    itemsToRequest = [
      ...connectorState.leftConnector.mat017ItemListWithWidenData,
      ...connectorState.rightConnector.mat017ItemListWithWidenData,
    ];

    if (ArrayUtils.isNotEmpty(itemsToRequest)) {
      let uniqueMatNumbers: string[] = [];

      if (!isLocked) {
        uniqueMatNumbers = getUniqueMatNumbersOfMat017ItemsFromConfigurations([
          selectedSingleCableCalculation.configuration,
        ]);
      } else {
        uniqueMatNumbers = getUniqueMatNumbersOfMat017ItemsFromConfigurations([
          selectedSingleCableCalculation.snapshot?.configurationData,
        ]);
      }

      return this.widenApiService.getImages(uniqueMatNumbers).pipe(
        tap((result: WidenData | null) => {
          if (result === null) {
            return;
          }

          context.dispatch(
            new Api.FetchingImagesFromWiden.Succeeded({
              widenData: result,
              connectorState,
              configurationId: selectedSingleCableCalculation.configurationId,
              snapshotId: selectedSingleCableCalculation.snapshotId,
            })
          );
        })
      );
    }
  }

  @Action(Api.FetchingImagesFromWiden.Succeeded)
  public setWidenImagesInConnectorState(
    context: StateContext<ProcessStateModel>,
    action: Api.FetchingImagesFromWiden.Succeeded
  ) {
    const isLocked = this.store.selectSnapshot(ProcessStateSelectors.isLocked());

    const { setState } = context;

    const { widenData, connectorState, configurationId, snapshotId } = action.payload;

    const leftMat017ItemListWithWidenData = ObjectUtils.cloneDeep<Mat017ItemWithWidenData[]>(
      connectorState.leftConnector.mat017ItemListWithWidenData
    );

    const rightMat017ItemListWithWidenData = ObjectUtils.cloneDeep<Mat017ItemWithWidenData[]>(
      connectorState.rightConnector.mat017ItemListWithWidenData
    );

    updateUrlsInMat017ItemListWithWidenData(leftMat017ItemListWithWidenData, widenData);
    updateUrlsInMat017ItemListWithWidenData(rightMat017ItemListWithWidenData, widenData);

    setState(
      patch({
        entities: patch({
          ...(!isLocked && {
            configurations: patchEntity(configurationId, {
              state: patch({
                connectorState: patch({
                  leftConnector: patch({
                    mat017ItemListWithWidenData: leftMat017ItemListWithWidenData,
                  }),
                  rightConnector: patch({
                    mat017ItemListWithWidenData: rightMat017ItemListWithWidenData,
                  }),
                }),
              }),
            }),
          }),
          ...(isLocked && {
            snapshots: patchEntity(snapshotId, {
              configurationData: patch({
                state: patch({
                  connectorState: patch({
                    leftConnector: patch({
                      mat017ItemListWithWidenData: leftMat017ItemListWithWidenData,
                    }),
                    rightConnector: patch({
                      mat017ItemListWithWidenData: rightMat017ItemListWithWidenData,
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      })
    );
  }

  @Action(Library.LeavingLibraryPage.Started)
  public updateLibraryStateInConfiguration(
    context: StateContext<ProcessStateModel>,
    action: Library.LeavingLibraryPage.Started
  ) {
    const { getState, setState, dispatch } = context;
    const state = getState();
    const { payload: libraryState } = action;

    delete libraryState.mat017ItemLoadingStatus;
    const scc = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);
    const isLocked = scc.calculation.isLocked;

    setState(
      patch({
        entities: patch({
          ...(!isLocked && {
            configurations: patchEntity(scc.configurationId, {
              labelingLeft: libraryState.leftChainFlex?.text,
              labelingRight: libraryState.rightChainFlex?.text,
              state: patch({
                connectorState: scc.configuration?.state?.connectorState,
                libraryState: libraryState as IcalcLibrary,
              }),
            }),
          }),
          ...(isLocked && {
            snapshots: patchEntity(scc.snapshotId, {
              configurationData: patch({
                state: patch({
                  connectorState: scc.snapshot?.configurationData?.state?.connectorState,
                  libraryState: libraryState as IcalcLibrary,
                }),
              }),
            }),
          }),
        }),
      })
    );

    const newState = getState();

    const saveRequestDto = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(newState),
      ['libraryState', 'connectorState', 'workStepOverrides']
    );

    return this.singleCableCalculationApiService.saveSingleCableCalculation(saveRequestDto).pipe(
      tap((result) => {
        dispatch(new Api.UpdatingLibrary.Succeeded(result));
      })
    );
  }

  @Action(MetaData.UpdatingMetaData.Started)
  public updateCalculationAndConfigurationFromMetaData(
    context: StateContext<ProcessStateModel>,
    action: MetaData.UpdatingMetaData.Started
  ) {
    const { getState, setState, dispatch } = context;
    const { payload: metaDataFromComponent } = action;
    const state = getState();

    const metaDataViewModelFromState = ProcessStateMappers.toMetaDataViewModel(state);
    const calculationFromState = metaDataViewModelFromState.selectedCalculationItem;

    if (calculationFromState.isLocked) {
      return;
    }

    const configurationFromState = metaDataViewModelFromState.selectedConfigurationItem;
    const singleCableCalculationFromState = metaDataViewModelFromState.selectedSingleCableCalculationItem;

    const calculationFromComponent = metaDataFromComponent.selectedCalculationItem;
    const configurationFromComponent = metaDataFromComponent.selectedConfigurationItem;
    const singleCableCalculationFromComponent = metaDataFromComponent.selectedSingleCableCalculationItem;

    const hasCustomerTypeChanged = calculationFromComponent?.customerType !== calculationFromState?.customerType;
    const hasQuoteNumberChanged = calculationFromComponent?.quoteNumber !== calculationFromState?.quoteNumber;
    const hasCustomerChanged = calculationFromComponent?.customer !== calculationFromState?.customer;
    const hasCalculationFactorChanged = !NumberUtils.areFloatsEqual(
      StringUtils.getFloatOrZeroFromLocalizedStringInput(calculationFromComponent?.calculationFactor),
      calculationFromState?.calculationFactor
    );

    let patchCalculationReq$: Observable<UpdateCalculationWithSCC> = of(null);
    let saveSccReq$: Observable<SaveSingleCableCalculationResponseDto> = of(null);
    const haveAnyCalculationfieldChanged =
      hasCustomerTypeChanged || hasCalculationFactorChanged || hasQuoteNumberChanged || hasCustomerChanged;

    if (haveAnyCalculationfieldChanged) {
      setState(
        patch({
          entities: patch({
            calculations: patchEntity(calculationFromState.id, {
              calculationFactor: calculationFromComponent.calculationFactor,
              customerType: calculationFromComponent.customerType,
              quoteNumber: calculationFromComponent.quoteNumber,
              customer: calculationFromComponent.customer,
            }),
          }),
        })
      );

      const patchRequestDto = ProcessStateMappers.toFormattedUpdateCalculationRequestDto({
        calculationNumber: calculationFromState.calculationNumber,
        calculationFactor: calculationFromComponent.calculationFactor,
        customerType: calculationFromComponent.customerType,
        quoteNumber: calculationFromComponent.quoteNumber,
        customer: calculationFromComponent.customer,
      });

      patchCalculationReq$ = this.calculationApiService.patchCalculation(patchRequestDto).pipe(
        tap((result: UpdateCalculationWithSCC) => {
          if (result === null) {
            return;
          }

          setState(
            patch({
              entities: patch({
                calculations: patchEntity(result.id, result),
              }),
            })
          );
        })
      );
    }

    const hasLabelingLeftChanged = configurationFromComponent?.labelingLeft !== configurationFromState?.labelingLeft;
    const hasLabelingRightChanged = configurationFromComponent?.labelingRight !== configurationFromState?.labelingRight;
    const hasDescriptionChanged = configurationFromComponent?.description !== configurationFromState?.description;

    const hasBatchSizeChanged =
      singleCableCalculationFromComponent?.batchSize !== singleCableCalculationFromState?.batchSize;

    const haveAnyConfigurationFieldChanged =
      hasLabelingLeftChanged || hasLabelingRightChanged || hasBatchSizeChanged || hasDescriptionChanged;

    if (haveAnyConfigurationFieldChanged) {
      const sccToSave = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

      const { singleCableCalculation, informUserAboutWorkSteps } =
        ProcessStateMutations.removeOverridesRelatedToMetaData(state, sccToSave, metaDataFromComponent);

      if (informUserAboutWorkSteps) {
        setState(
          patch({
            informUserAboutWorkSteps,
          })
        );
      }

      singleCableCalculation.configuration.labelingLeft = configurationFromComponent.labelingLeft;
      singleCableCalculation.configuration.labelingRight = configurationFromComponent.labelingRight;
      singleCableCalculation.configuration.description = configurationFromComponent.description;
      singleCableCalculation.batchSize = singleCableCalculationFromComponent.batchSize;

      const saveRequestDto = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(singleCableCalculation, [
        'chainFlexState',
      ]);

      saveSccReq$ = this.singleCableCalculationApiService.saveSingleCableCalculation(saveRequestDto);
    }

    return forkJoin([patchCalculationReq$, saveSccReq$]).pipe(
      tap(([patchCalculationResponse, saveSccResponse]) => {
        if (patchCalculationResponse === null && saveSccResponse === null) {
          return;
        }

        const payload = {
          ...(saveSccResponse && saveSccResponse),
          updatedCalculation: patchCalculationResponse,
        };

        dispatch(new Api.UpdatingMetaData.Succeeded(payload));
      })
    );
  }

  @Action(PinAssignment.ValidatingPinAssignment.Started)
  public startValidatingPinAssignment(
    context: StateContext<ProcessStateModel>,
    action: PinAssignment.ValidatingPinAssignment.Started
  ) {
    const { calculationId, configurationId, pinAssignmentState } = action.payload;
    const { setState, getState, dispatch } = context;

    const state = getState();
    const selectedScc = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

    const { singleCableCalculation, informUserAboutWorkSteps } =
      ProcessStateMutations.removeOverridesRelatedToPinAssignment(state, selectedScc, pinAssignmentState);

    if (informUserAboutWorkSteps) {
      setState(
        patch({
          informUserAboutWorkSteps,
        })
      );
    }

    singleCableCalculation.configuration.state.pinAssignmentState = pinAssignmentState;

    const payloadToSave = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(singleCableCalculation, [
      'pinAssignmentState',
      'workStepOverrides',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(payloadToSave).pipe(
      mergeMap((saveResult) => dispatch(new Api.UpdatingPinAssignment.Succeeded(saveResult))),
      mergeMap(() => {
        return this.processApiService.validatePinAssignment(calculationId, configurationId).pipe(
          filter((validationResult: PinAssignmentValidationResult) => validationResult !== null),
          mergeMap((validationResult: PinAssignmentValidationResult) => {
            return dispatch(new Api.ValidatingPinAssignment.Succeeded(validationResult));
          })
        );
      })
    );
  }

  @Action(PinAssignment.NavigatingBackFromPinAssignmentPage.Started)
  public updatePinAssignmentAfterNavigatingBack(
    context: StateContext<ProcessStateModel>,
    action: PinAssignment.LeavingPinAssignmentPage.Started
  ) {
    const {
      payload: { pinAssignmentState, hasSavedLatestChanges },
    } = action;
    const state = context.getState();

    const selectedScc = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

    if (selectedScc.calculation.isLocked || hasSavedLatestChanges) {
      return;
    }

    selectedScc.configuration.state.pinAssignmentState = pinAssignmentState;

    const payloadToSave = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(selectedScc, [
      'pinAssignmentState',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(payloadToSave).pipe(
      mergeMap((saveResult) => {
        return context.dispatch(
          new PinAssignment.NavigatingBackFromPinAssignmentPage.PinAssignmentDataSaved(saveResult)
        );
      })
    );
  }

  @Action(PinAssignment.NavigatingToResultsPage.Started)
  public updatePinAssignmentByNavigatingToResultsPage(
    context: StateContext<ProcessStateModel>,
    action: PinAssignment.NavigatingToResultsPage.Started
  ) {
    const {
      payload: { pinAssignmentState, approve },
    } = action;
    const state = context.getState();

    const selectedScc = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

    if (selectedScc.calculation.isLocked) {
      return;
    }

    selectedScc.configuration.state.pinAssignmentState = pinAssignmentState;

    const payloadToSave = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(selectedScc, [
      'pinAssignmentState',
      'workStepOverrides',
    ]);
    const { calculationId, configurationId } = selectedScc;

    return this.singleCableCalculationApiService.saveSingleCableCalculation(payloadToSave).pipe(
      mergeMap((saveResult) => {
        return iif(
          () => approve,
          this.singleCableCalculationApiService.approve(calculationId, configurationId),
          of(true)
        ).pipe(mergeMap(() => context.dispatch(new Api.UpdatingPinAssignment.Succeeded(saveResult))));
      })
    );
  }

  @Action([
    Api.UpdatingMetaData.Succeeded,
    Api.UpdatingChainflex.Succeeded,
    Api.UpdatingLeftConnector.Succeeded,
    Api.UpdatingRightConnector.Succeeded,
    Api.UpdatingLibrary.Succeeded,
    Api.UpdatingPinAssignment.Succeeded,
    PinAssignment.NavigatingBackFromPinAssignmentPage.PinAssignmentDataSaved,
    Api.SubmittingWorkStepsForm.Succeeded,
    Api.ChangingWorkStepSets.Succeeded,
  ])
  public updateSingleCableCalculationAndConfigurationinState(
    context: StateContext<ProcessStateModel>,
    action:
      | Api.UpdatingMetaData.Succeeded
      | Api.UpdatingChainflex.Succeeded
      | Api.UpdatingLeftConnector.Succeeded
      | Api.UpdatingRightConnector.Succeeded
      | Api.UpdatingLibrary.Succeeded
      | Api.UpdatingPinAssignment.Succeeded
      | PinAssignment.NavigatingBackFromPinAssignmentPage.PinAssignmentDataSaved
      | Api.SubmittingWorkStepsForm.Succeeded
      | Api.ChangingWorkStepSets.Succeeded
  ) {
    const { setState, getState } = context;
    const state = getState();
    const {
      payload: { singleCableCalculation, calculationConfigurationStatus },
    } = action;

    if (!singleCableCalculation) {
      return;
    }

    const sccId = state.selectedSingleCableCalculationId;
    const currentConfiguration = ProcessStateMappers.toSelectedConfigurationEntity(state);
    const configurationId = currentConfiguration.id;

    setState(
      patch({
        calculationIdForCreatingNewConfiguration: null,
        isSavingSingleCableCalculation: false,
        entities: patch({
          singleCableCalculations: patchEntity(sccId, {
            commercialWorkStepOverrides: singleCableCalculation.commercialWorkStepOverrides,
            calculationFactor: singleCableCalculation.calculationFactor,
            batchSize: singleCableCalculation.batchSize,
            chainflexLength: singleCableCalculation.chainflexLength,
          }),
          configurations: patchEntity(configurationId, {
            ...singleCableCalculation.configuration,
            state: patch({ ...singleCableCalculation.configuration.state }), // allows to update only part of the state object
          }),
        }),
      })
    );

    if (calculationConfigurationStatus?.hasApprovalBeenRevoked) {
      context.dispatch(new Api.RevokingConfigurationApproval.Succeeded());
    }
  }

  @Action(Results.ChangingWorkStepSets.Started)
  public changeWorkStepSets(context: StateContext<ProcessStateModel>, action: Results.ChangingWorkStepSets.Started) {
    if (!action.payload) {
      return;
    }

    const state = context.getState();
    const selectedScc = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    if (selectedScc.calculation.isLocked) {
      return;
    }

    selectedScc.configuration.state.workStepSet = action.payload.workStepSet;

    const payloadToSave = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(selectedScc, ['workStepSet']);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(payloadToSave).pipe(
      tap((result) => {
        context.dispatch(new Api.ChangingWorkStepSets.Succeeded(result));
      })
    );
  }

  @Action(Results.SubmittingWorkStepsForm.Submitted)
  public saveOverrides(context: StateContext<ProcessStateModel>, action: Results.SubmittingWorkStepsForm.Submitted) {
    if (!action.payload) {
      return;
    }

    const state = context.getState();
    let selectedScc = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    if (selectedScc.calculation.isLocked) {
      return;
    }
    const currentProcessResult = state.processResults?.find(
      (processResult) => processResult.configurationReference.sccId === action.payload.sccId
    );

    if (!currentProcessResult) {
      return;
    }

    const currentWorkSteps = currentProcessResult.workSteps;
    const quantitiesWithoutOverrides = currentProcessResult.quantitiesWithoutOverrides;

    if (ArrayUtils.isEmpty(currentWorkSteps)) {
      return;
    }

    const payload = ObjectUtils.cloneDeep<{ configurationId: string; overrides: { [key in WorkStepType]?: number } }>(
      action.payload
    );

    selectedScc = ProcessStateMutations.saveOverrides(selectedScc, payload.overrides, quantitiesWithoutOverrides);
    const payloadToSave = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(selectedScc, [
      'workStepOverrides',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(payloadToSave).pipe(
      tap((result) => {
        context.dispatch(new Api.SubmittingWorkStepsForm.Succeeded(result));
      })
    );
  }

  @Action(Results.UpdatingCalculationData.Submitted)
  public updateCalculation(
    context: StateContext<ProcessStateModel>,
    action: Results.UpdatingCalculationData.Submitted
  ) {
    const { dispatch } = context;

    const {
      payload: {
        calculationNumber,
        calculationFactor,
        customerType,
        mat017ItemAndWorkStepRiskFactor,
        mat017ItemRiskFactor,
      },
    } = action;

    const formattedCalculationFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(calculationFactor);
    const formattedMat017ItemAndWorkStepRiskFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(
      mat017ItemAndWorkStepRiskFactor
    );
    const formattedMat017ItemRiskFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(mat017ItemRiskFactor);

    const requestPayload = {
      calculationNumber,
      calculationFactor: formattedCalculationFactor,
      mat017ItemAndWorkStepRiskFactor: formattedMat017ItemAndWorkStepRiskFactor,
      mat017ItemRiskFactor: formattedMat017ItemRiskFactor,
      customerType,
    };

    return this.calculationApiService.patchCalculation(requestPayload).pipe(
      tap((result) => {
        if (result === null) {
          return;
        }

        dispatch(new Api.UpdatingCalculationData.Succeeded(result));
      })
    );
  }

  @Action(Results.UpdatingSingleCableCalculationAndConfigurationData.Submitted)
  public updateSingleCableCalculationFromResults(
    context: StateContext<ProcessStateModel>,
    action: Results.UpdatingSingleCableCalculationAndConfigurationData.Submitted
  ) {
    const { getState, dispatch } = context;
    const state = getState();
    const selectedScc = ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);
    const {
      payload: { calculationFactor, description },
    } = action;

    if (selectedScc.snapshotId) {
      return;
    }

    selectedScc.configuration.description = description;
    const formattedIndividualCalculationFactor = StringUtils.getFloatOrZeroFromLocalizedStringInput(calculationFactor);

    const payloadToSave = ProcessStateMappers.toSaveSingleCableCalculationRequestDto(selectedScc, [
      'workStepOverrides',
    ]);

    return this.singleCableCalculationApiService.saveSingleCableCalculation(payloadToSave).pipe(
      tap((result) => {
        if (result === null) {
          return;
        }
        const payload = {
          description: result.singleCableCalculation.configuration.description,
          modificationDate: result.singleCableCalculation.configuration.modificationDate,
          modifiedBy: result.singleCableCalculation.configuration.modifiedBy,
        };

        dispatch(new Api.UpdateConfigurationData.Succeeded(payload));
      }),
      map((payload) => {
        const requestPayload: UpdateCalculationRequestDto = {
          calculationNumber: payload.singleCableCalculation.calculationNumber,

          singleCableCalculation: {
            id: payload.singleCableCalculation.id,
            calculationFactor: formattedIndividualCalculationFactor,
          },
        };

        return this.calculationApiService.patchCalculation(requestPayload).pipe(
          tap((result) => {
            if (result === null) {
              return;
            }

            dispatch(new Api.UpdatingSingleCableCalculationData.Succeeded(result));
          })
        );
      })
    );
  }

  @Action(Results.UpdatingChainflexPrices.Submitted)
  public updateChainflexPrices(
    context: StateContext<ProcessStateModel>,
    action: Results.UpdatingChainflexPrices.Submitted
  ) {
    const { dispatch } = context;
    const { payload } = action;

    return this.singleCableCalculationApiService
      .updateChainflexPrices({
        singleCableCalculationIds: payload,
      })
      .pipe(
        tap((result: UpdateChainflexPricesResult | null) => {
          if (result === null) {
            return;
          }

          dispatch(new Api.UpdatingChainflexPrices.Succeeded(result));
        })
      );
  }

  @Action(Results.UpdatingMat017ItemPrices.Submitted)
  public updateMat017ItemPrices(context: StateContext<ProcessStateModel>) {
    const { dispatch, getState } = context;

    const state = getState();

    const updateMat017ItemPricePayload = ProcessStateMappers.toUpdateMat017ItemOverridesRequestDto(state);

    return this.calculationApiService
      .updateMat017ItemOverrides({
        ...updateMat017ItemPricePayload,
      })
      .pipe(
        tap((result: UpdateMat017ItemsOverridesInConfigurationsResponseDto | null) => {
          if (result === null) {
            return;
          }

          dispatch(new Api.UpdatingMat017ItemPrices.Succeeded(result));
        })
      );
  }

  @Action(Results.RemovingMat017ItemFromConfigurations.Submitted)
  public removeMat017ItemFromConfigurations(
    context: StateContext<ProcessStateModel>,
    action: Results.RemovingMat017ItemFromConfigurations.Submitted
  ) {
    const { dispatch, getState } = context;
    const { payload } = action;

    const state = getState();

    const removeMat017ItemPayload = ProcessStateMappers.toRemoveMat017ItemsRequestDto(state, payload);

    return this.calculationApiService
      .removeMat017Items({
        ...removeMat017ItemPayload,
      })
      .pipe(
        tap((result: RemoveMat017ItemsResponseDto | null) => {
          if (result === null) {
            return;
          }

          dispatch(new Api.RemovingMat017ItemFromConfigurations.Succeeded(result));
        })
      );
  }

  @Action(Api.RemovingMat017ItemFromConfigurations.Succeeded)
  public updateConfigurationsInStateWithRemovedMat017Items(
    context: StateContext<ProcessStateModel>,
    action: Api.RemovingMat017ItemFromConfigurations.Succeeded
  ) {
    const { dispatch, setState, getState } = context;
    const { payload } = action;
    const state = getState();

    const approvalRevoked = payload.some(
      (configuration) => configuration.calculationConfigurationStatus.hasApprovalBeenRevoked
    );

    const savedConfigurations = payload.map((configuration) => {
      return {
        id: configuration.configurationId,
        connectorState: configuration.connectorState,
        workStepOverrides: configuration.workStepOverrides,
      };
    });
    const updateConfigurations = savedConfigurations.map((config) =>
      patchEntity<ConfigurationUiEntity>(config.id, {
        state: patch({
          connectorState: config.connectorState as ConfigurationConnectorStatePresentation,
          workStepOverrides: config.workStepOverrides,
        }),
      })
    );

    setState(
      patch({
        entities: patch({
          configurations: compose(...updateConfigurations),
        }),
        informUserAboutWorkSteps: ProcessStateMutations.addInformAboutWorkSteps(state, payload),
      })
    );

    if (approvalRevoked) {
      dispatch(new Api.RevokingConfigurationApproval.Succeeded());
    }
  }

  @Action(Results.RemovingChainflexDataFromConfigurations.Submitted)
  public removeChainflexDataFromConfigurations(
    context: StateContext<ProcessStateModel>,
    action: Results.UpdatingChainflexPrices.Submitted
  ) {
    const { dispatch } = context;
    const { payload } = action;

    return this.singleCableCalculationApiService
      .removeChainflexData({
        singleCableCalculationIds: payload,
      })
      .pipe(
        tap((result: RemoveChainflexDataResponseDto | null) => {
          if (result === null) {
            return;
          }

          dispatch(new Api.RemovingChainflexDataFromConfigurations.Succeeded(result));
        })
      );
  }

  @Action(Api.RemovingChainflexDataFromConfigurations.Succeeded)
  public updateConfigurationsInState(
    context: StateContext<ProcessStateModel>,
    action: Api.RemovingChainflexDataFromConfigurations.Succeeded
  ) {
    const { dispatch, setState } = context;
    const { payload } = action;

    const approvalRevoked = payload.savedSingleCableCalculations.some(
      (savedSCC) => savedSCC.calculationConfigurationStatus.hasApprovalBeenRevoked
    );
    const savedConfigurations = payload.savedSingleCableCalculations.map(
      (scc) => scc.singleCableCalculation.configuration
    );
    const updateConfigurations = savedConfigurations.map((config) =>
      patchEntity<ConfigurationUiEntity>(config.id, config)
    );

    setState(
      patch({
        entities: patch({
          configurations: compose(...updateConfigurations),
        }),
      })
    );

    if (approvalRevoked) {
      dispatch(new Api.RevokingConfigurationApproval.Succeeded());
    }
  }

  @Action(Api.UpdatingChainflexPrices.Succeeded)
  public updateChainflexPricesInState(
    context: StateContext<ProcessStateModel>,
    action: Api.UpdatingChainflexPrices.Succeeded
  ) {
    const { payload } = action;
    const { getState, setState } = context;
    const state = getState();

    const newCFPricesByConfigurationId = payload.singleCableCalculationPriceUpdateReferences.reduce((acc, sccRef) => {
      const configUiEntity = ProcessStateMappers.toConfigurationUiEntityBySingleCableCalculationId(
        state,
        sccRef.singleCableCalculationId
      );

      if (configUiEntity) {
        acc.set(configUiEntity.id, sccRef.newPriceObject);
      }

      return acc;
    }, new Map<string, ChainflexPrice>());

    const updateConfigurations = Array.from(newCFPricesByConfigurationId.entries()).map(([configId, cfPrice]) =>
      patchEntity<ConfigurationUiEntity>(configId, {
        state: patch({
          chainFlexState: patch({
            chainflexCable: patch({
              price: cfPrice,
            }),
          }),
        }),
      })
    );

    setState(
      patch({
        chainflexPricesHaveChanged: false,
        entities: patch({
          configurations: compose(...updateConfigurations),
        }),
      })
    );
  }

  @Action(Api.UpdatingMat017ItemPrices.Succeeded)
  public updateMat017ItemPricesInState(
    context: StateContext<ProcessStateModel>,
    action: Api.UpdatingMat017ItemPrices.Succeeded
  ) {
    const { payload } = action;
    const { getState, setState } = context;
    const state = getState();

    const newMat017ItemPriceByConfigurationId = payload.filter(
      (config) => state.entities.configurations.items[config.configurationId]
    );

    const updateConfigurations = newMat017ItemPriceByConfigurationId.map(
      ({ configurationId, connectorState, workStepOverrides }) => {
        return patchEntity<ConfigurationUiEntity>(configurationId, {
          state: patch({
            connectorState,
            workStepOverrides,
          }),
        });
      }
    );

    setState(
      patch({
        mat017ItemsModification: patch({
          hasAmountDividedByPriceUnitChanged: false,
        }),
        entities: patch({
          configurations: compose(...updateConfigurations),
        }),
      })
    );
  }

  @Action(Api.UpdatingCalculationData.Succeeded)
  public updateCalculationInState(
    context: StateContext<ProcessStateModel>,
    action: Api.UpdatingCalculationData.Succeeded
  ) {
    const {
      selectedSingleCableCalculationId,
      entities: { singleCableCalculations },
    } = context.getState();
    const { calculationFactor, customerType, mat017ItemAndWorkStepRiskFactor, mat017ItemRiskFactor } = action.payload;

    const selectedScc = singleCableCalculations.items[selectedSingleCableCalculationId];
    const calculationId = selectedScc.calculationId;

    context.setState(
      patch({
        entities: patch({
          calculations: patchEntity(calculationId, {
            calculationFactor,
            customerType,
            mat017ItemAndWorkStepRiskFactor,
            mat017ItemRiskFactor,
          }),
        }),
      })
    );
  }

  @Action(Api.UpdateConfigurationData.Succeeded)
  public updateConfigurationInState(
    context: StateContext<ProcessStateModel>,
    action: Api.UpdateConfigurationData.Succeeded
  ) {
    const {
      selectedSingleCableCalculationId,
      entities: { singleCableCalculations },
    } = context.getState();
    const { description, modificationDate, modifiedBy } = action.payload;

    const selectedScc = singleCableCalculations.items[selectedSingleCableCalculationId];
    const configurationId = selectedScc.configurationId;

    context.setState(
      patch({
        entities: patch({
          configurations: patchEntity(configurationId, {
            description,
            modificationDate,
            modifiedBy,
          }),
        }),
      })
    );
  }

  @Action(Api.UpdatingSingleCableCalculationData.Succeeded)
  public updateSingleCableCalculationInState(
    context: StateContext<ProcessStateModel>,
    action: Api.UpdatingSingleCableCalculationData.Succeeded
  ) {
    const { calculationFactor, id } = action.payload.singleCableCalculation;

    context.setState(
      patch({
        entities: patch({
          singleCableCalculations: patchEntity(id, {
            calculationFactor,
          }),
        }),
      })
    );
  }

  @Action(ExportExcelFile)
  public async exportExcelFile(context: StateContext<ProcessStateModel>, action: ExportExcelFile) {
    if (!action.payload) {
      return;
    }
    context.patchState({
      isExcelFileDownloading: true,
    });

    let requestParams: ExcelRequestParams;
    const fileDownloadOptions = action.payload.selectedDownloadOption;
    const selectedFormat = fileDownloadOptions.format;

    if (action.payload.productionPlan) {
      const { data: createExcelProductionPlanFileDto, fileName } =
        await this.excelReportService.prepareCreateExcelProductionPlanFileDtoAndFileName(
          this.store.selectSnapshot(ProcessStateSelectors.processDataForExcelExport()),
          fileDownloadOptions
        );
      const dispatchFlagUpdate =
        selectedFormat === FileFormatEnum.xls || FileFormatEnum.xlsx
          ? CalculationLockActionEnum.productionPlanExcelDownloaded
          : undefined;

      requestParams = {
        apiPath: 'createExcelProductionPlanFile',
        data: createExcelProductionPlanFileDto,
        fileName,
        dispatchFlagUpdate,
      };
    } else if (action.payload.calculation) {
      const { data: excelCalculation, fileName } = this.excelReportService.prepareExcelCalculationAndFileName(
        this.store.selectSnapshot(ProcessStateSelectors.processDataForExcelExport()),
        fileDownloadOptions
      );

      const dispatchFlagUpdate =
        selectedFormat === FileFormatEnum.xls || FileFormatEnum.xlsx
          ? CalculationLockActionEnum.calculationExcelDownloaded
          : undefined;

      requestParams = {
        apiPath: 'createExcelCalculation',
        data: excelCalculation,
        fileName,
        dispatchFlagUpdate,
      };
    }

    const { apiPath, data, fileName, dispatchFlagUpdate } = requestParams;

    return this.processApiService[apiPath](data).pipe(
      tap((responseBody: Blob) => {
        if (responseBody === null) {
          context.patchState({
            isExcelFileDownloading: false,
          });
          return;
        }

        this.fileSaverService.save(responseBody, fileName);
        context.patchState({
          isExcelFileDownloading: false,
        });
        if (dispatchFlagUpdate) {
          context.dispatch(new Api.ExportingExcelFile.Succeeded({ [dispatchFlagUpdate]: true }));
        }
      })
    );
  }

  @Action(Api.ExportingExcelFile.Succeeded)
  public setExcelDownloadFlagsForSelectedCalculation(
    context: StateContext<ProcessStateModel>,
    action: Api.ExportingExcelFile.Succeeded
  ) {
    if (!action.payload) {
      return;
    }
    const state = context.getState();
    const { id: singleCableCalculationId, calculation } =
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state);

    if (calculation.isLocked) {
      return;
    }

    const parameter: SetExcelDownloadFlagsForCalculationRequestDto = {
      calculationNumber: calculation.calculationNumber,
      ...action.payload,
    };

    return this.calculationApiService.setExcelDownloadFlags(parameter).pipe(
      tap((response: SetExcelDownloadFlagsForCalculationResponseDto | null) => {
        if (response === null) {
          return;
        }

        const { calculationExcelDownloaded, productionPlanExcelDownloaded, id } = response;

        context.setState(
          patch({
            entities: patch({
              calculations: patchEntity(id, {
                calculationExcelDownloaded,
                productionPlanExcelDownloaded,
              }),
            }),
          })
        );

        const hasBeenLocked = !calculation.isLocked && response.isLocked;

        if (hasBeenLocked) {
          context.dispatch(new Api.LockingCalculation.Succeeded({ singleCableCalculationId }));
        }
      })
    );
  }

  @Action(RemoveLinkBetweenConfigurationAndCalculationDialog.OpeningDialog.Opened)
  public validateLinkBetweenConfigurationAndCalculationCanBeRemoved(context: StateContext<ProcessStateModel>) {
    const { selectedSingleCableCalculationId } = context.getState();

    return this.calculationApiService
      .canLinkBetweenConfigurationAndCalculationBeRemoved(selectedSingleCableCalculationId)
      .pipe(
        tap((result: CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto) => {
          if (result instanceof HttpErrorResponse) {
            context.dispatch(
              new Api.ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved.Failed(result as HttpErrorResponse)
            );
            return;
          }
          context.dispatch(new Api.ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved.Succeeded(result));
        })
      );
  }

  @Action([CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted])
  public validateIfCanBeDuplicated(
    context: StateContext<ProcessStateModel>,
    action: CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted
  ) {
    const { payload } = action;
    const { dispatch } = context;

    return this.configurationApiService.findByNumber(payload.newMatNumber).pipe(
      filter((result) => !(result instanceof HttpErrorResponse)),
      map((value) => !value),
      mergeMap((isValid) => {
        if (!isValid) {
          return dispatch(new Api.CopyingConfigurationToExistingCalculation.ValidationFailed());
        }
        return dispatch(new Api.CopyingConfigurationToExistingCalculation.Validated(payload));
      })
    );
  }

  @Action(Api.CopyingConfigurationToExistingCalculation.Validated)
  public copyingConfigurationToExistingCalculation(
    context: StateContext<ProcessStateModel>,
    action: Api.CopyingConfigurationToExistingCalculation.Validated
  ) {
    const { payload } = action;
    const { dispatch } = context;

    return this.calculationApiService.copyConfigurationToExistingCalculation(payload).pipe(
      mergeMap((response) => {
        if (response === null) {
          return of(null);
        }
        return dispatch(new Api.CopyingConfigurationToExistingCalculation.Succeeded(response));
      })
    );
  }

  @Action(ChangeSelectedTab)
  public changeSelectedTab(context: StateContext<ProcessStateModel>, action: ChangeSelectedTab) {
    const newTabIndex = +action.selectedTabIndex;

    context.patchState({ selectedTabIndex: isNaN(newTabIndex) ? 0 : newTabIndex });
  }

  @Action([
    Results.EnteringResultsPage.Entered,
    Api.UpdatingCalculationData.Succeeded,
    Api.UpdatingSingleCableCalculationData.Succeeded,
    Api.SubmittingWorkStepsForm.Succeeded,
    Api.CopyingConfigurationToExistingCalculation.Succeeded,
    Api.AssigningConfigurationToExistingCalculation.Succeeded,
    Api.RemovingLinkBetweenConfigurationAndCalculation.Succeeded,
    Api.UpdatingChainflexPrices.Succeeded,
    Api.RemovingChainflexDataFromConfigurations.Succeeded,
    Api.ChangingWorkStepSets.Succeeded,
    Api.UpdatingMat017ItemPrices.Succeeded,
    Api.RemovingMat017ItemFromConfigurations.Succeeded,
    Api.UpdateConfigurationData.Succeeded,
  ])
  public processCalculation(
    context: StateContext<ProcessStateModel>,
    action:
      | Results.EnteringResultsPage.Entered
      | Api.UpdatingCalculationData.Succeeded
      | Api.UpdatingSingleCableCalculationData.Succeeded
      | Api.SubmittingWorkStepsForm.Succeeded
      | Api.UpdatingChainflexPrices.Succeeded
      | Api.AssigningConfigurationToExistingCalculation.Succeeded
      | Api.CopyingConfigurationToExistingCalculation.Succeeded
      | Api.RemovingLinkBetweenConfigurationAndCalculation.Succeeded
      | Api.RemovingChainflexDataFromConfigurations.Succeeded
      | Api.ChangingWorkStepSets.Succeeded
      | Api.RemovingMat017ItemFromConfigurations.Succeeded
      | Api.UpdateConfigurationData.Succeeded
  ) {
    return this.isInResultsStep$().pipe(
      filter((isInResultsStep) => isInResultsStep === true),
      switchMap(() => {
        const state = context.getState();

        // if a new assignment is created or one is deleted we need to use singleCableCalculation from payload as the change might not be in the entities state yet
        let sccFromActionPayload: SingleCableCalculationPresentation;

        if (
          action instanceof Api.AssigningConfigurationToExistingCalculation.Succeeded ||
          action instanceof Api.CopyingConfigurationToExistingCalculation.Succeeded ||
          action instanceof Api.RemovingLinkBetweenConfigurationAndCalculation.Succeeded
        ) {
          sccFromActionPayload = action.payload;
        }
        const requestDto = ProcessStateMappers.toProcessCalculationRequestDto(state, sccFromActionPayload);

        context.patchState({
          isProcessing: true,
        });

        return this.processApiService.process(requestDto).pipe(
          tap((result: ProcessManyResult | null) => {
            if (result === null) {
              return;
            }

            context.patchState({
              isProcessing: false,
              processResults: result.processResults,
              calculationTotalPrice: result.calculationTotalPrice,
              allResultsValid: result.allResultsValid,
            });

            context.dispatch(new Api.ProcessingCalculation.Succeeded(result));
          })
        );
      })
    );
  }

  @Action([Api.ProcessingCalculation.Succeeded])
  public checkChainflexAndPriceExistence({ getState, patchState, dispatch }: StateContext<ProcessStateModel>) {
    const isLocked = this.store.selectSnapshot(ProcessStateSelectors.isLocked());

    return this.isInResultsStep$().pipe(
      filter((isInResultsStep) => isInResultsStep === true && !isLocked), // only check for new prices if not locked and is in results page
      switchMap(() => {
        const state = getState();
        const payload = ProcessStateMappers.toCheckForNewChainflexPricesDto(state);

        return this.singleCableCalculationApiService.checkChainflexAndPriceExistence(payload).pipe(
          tap((result: CheckForNewChainflexPricesResult | null) => {
            if (result === null) {
              patchState({
                processServerError: getDefaultFromProcessState('processServerError'),
                chainflexPricesHaveChanged: getDefaultFromProcessState('chainflexPricesHaveChanged'),
                chainflexesAndPricesAvailable: getDefaultFromProcessState('chainflexesAndPricesAvailable'),
              });
              return;
            }
            patchState({
              checkForNewChainflexPricesResult: result,
              chainflexPricesHaveChanged: result.chainflexPricesHaveChanged,
              chainflexesAndPricesAvailable: result.chainflexesAndPricesAvailable,
            });

            dispatch(new Api.CheckingForNewChainflexPrices.Succeeded(result));
          })
        );
      })
    );
  }

  @Action([Api.ProcessingCalculation.Succeeded])
  public checkForMat017ItemChanges({ getState, patchState, dispatch }: StateContext<ProcessStateModel>) {
    const isLocked = this.store.selectSnapshot(ProcessStateSelectors.isLocked());

    return this.isInResultsStep$().pipe(
      filter((isInResultsStep) => isInResultsStep === true && !isLocked), // only check for new prices if not locked and is in results page
      switchMap(() => {
        const state = getState();
        const payload = ProcessStateMappers.toCheckForNewMat017ItemPrices(state);

        return this.calculationApiService.haveMat017ItemsOverridesChanged(payload).pipe(
          tap((result: HaveMat017ItemsOverridesChangedResponseDto | null) => {
            if (result === null) {
              patchState({
                processServerError: getDefaultFromProcessState('processServerError'),
                mat017ItemsModification: getDefaultFromProcessState('mat017ItemsModification'),
              });
              return;
            }

            patchState({
              mat017ItemsModification: {
                hasAmountDividedByPriceUnitChanged: result.hasAmountDividedByPriceUnitChanged,
                hasInvalidOrRemovedItems: result.hasInvalidOrRemovedItems,
                configurations: result.configurations,
              },
            });

            dispatch(new Api.CheckingForMat017ItemsOverridesChanges.Succeeded(result));
          })
        );
      }),
      switchMap((result: HaveMat017ItemsOverridesChangedResponseDto | null) => {
        if (result === null) return of(result);

        const state = getState();

        const payload = ProcessStateMappers.toUpdateMat017ItemsOverridesRequestDto(state, result.configurations);

        if (ArrayUtils.isEmpty(payload.configurationIds)) return of(payload.configurationIds);

        return this.calculationApiService.updateMat017ItemOverrides(payload).pipe(
          tap((response: UpdateMat017ItemsOverridesInConfigurationsResponseDto | null) => {
            if (response === null) return of(response);

            dispatch(new Api.UpdatingConnectorOverrides.Succeeded(response));
          })
        );
      }),
      switchMap((response: UpdateMat017ItemsOverridesInConfigurationsResponseDto | null) => {
        if (response === null || ArrayUtils.isEmpty(response)) return of(response);
        const state = getState();
        const requestDto = ProcessStateMappers.toProcessCalculationRequestDto(state);

        patchState({
          isProcessing: true,
        });
        return this.processApiService.process(requestDto).pipe(
          tap((result: ProcessManyResult | null) => {
            if (result === null) {
              return;
            }

            patchState({
              isProcessing: false,
              processResults: result.processResults,
              calculationTotalPrice: result.calculationTotalPrice,
              allResultsValid: result.allResultsValid,
            });
          })
        );
      })
    );
  }

  @Action(WorkStepInformation.OpeningWorkStepInformationPopup.Started)
  public removeWorkStepInformation(context: StateContext<ProcessStateModel>) {
    context.patchState({
      informUserAboutWorkSteps: getDefaultFromProcessState('informUserAboutWorkSteps'),
    });
  }

  @Action([
    Api.ProcessingCalculation.Succeeded,
    RightConnector.EnteringRightConnectorPage.Started,
    LeftConnector.EnteringLeftConnectorPage.Started,
  ])
  public getMat017ItemsLatestModificationDate(context: StateContext<ProcessStateModel>) {
    return this.mat017ItemApiService.getLatestModificationDate().pipe(
      tap((result: Mat017ItemsLatestModificationDate | null) => {
        if (result === null) {
          return;
        }

        context.patchState({
          mat017ItemsLatestModificationDate: result.latestModificationDate,
        });
      })
    );
  }

  private updateSelectedSingleCableCalculationWithEntities(
    result: SingleCableCalculationPresentation,
    { setState }: StateContext<ProcessStateModel>
  ) {
    // gather all single cable calcultions
    const sccList = [
      ...result.calculation.singleCableCalculations,
      ...(result.configuration ? result.configuration.singleCableCalculations : []),
      ...(result.snapshot ? result.snapshot.singleCableCalculations : []),
    ];

    const addSCCs = sccList.map((scc) => {
      return addEntity(ProcessStateMappers.toSingleCableCalculationUiEntity(scc));
    });

    const { calculation, configuration, snapshot } = result;
    const calculationEntity = ProcessStateMappers.toCalculationUiEntity(calculation);
    const configurationEntity = configuration ? ProcessStateMappers.toConfigurationUiEntity(configuration) : undefined;
    const snapshotEntity = snapshot ? ProcessStateMappers.toSnapshotUiEntity(snapshot) : undefined;

    const patchObject: ɵPatchSpec<ProcessEntitiesStateModel> = {
      calculations: addEntity(calculationEntity),
      singleCableCalculations: compose(...addSCCs),
      ...(configurationEntity && { configurations: addEntity(configurationEntity) }),
      ...(snapshotEntity && { snapshots: addEntity(snapshotEntity) }),
    };

    setState(
      patch({
        selectedSingleCableCalculationId: result.id,
        calculationIdForCreatingNewConfiguration: null,
        isSingleCableCalculationLoading: false,
        entities: patch(patchObject),
      })
    );
  }

  private isInResultsStep$(): Observable<boolean> {
    return this.store.select(AppState.currentStep).pipe(
      take(1),
      map((v) => v.label === IcalcRoutes.results)
    );
  }

  private updateMat017ItemWithWidenData(
    context: StateContext<ProcessStateModel>,
    matNumber: string,
    update: Partial<Mat017ItemWithWidenData>
  ) {
    const { setState, getState } = context;
    const state = getState();

    const selectedSingleCableCalculation = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(
      ProcessStateMappers.toSelectedSingleCableCalculationWithRelations(state)
    );

    setState(
      patch({
        entities: patch({
          configurations: patchEntity(selectedSingleCableCalculation.configurationId, {
            state: patch({
              connectorState: patch({
                leftConnector: patch({
                  mat017ItemListWithWidenData: updateItem<Mat017ItemWithWidenData>(
                    (item) => item.matNumber === matNumber,
                    (item) => ({
                      ...item,
                      ...update,
                    })
                  ),
                }),
                rightConnector: patch({
                  mat017ItemListWithWidenData: updateItem<Mat017ItemWithWidenData>(
                    (item) => item.matNumber === matNumber,
                    (item) => ({
                      ...item,
                      ...update,
                    })
                  ),
                }),
              }),
            }),
          }),
        }),
      })
    );
  }
}
