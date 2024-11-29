import { Injectable } from '@angular/core';
import type {
  CalculationConfigurationStatus,
  Core,
  IcalcBridge,
  IcalcHTTPError,
  Litze,
  Shield,
  Twisting,
} from '@igus/icalc-domain';
import { ActionModels, CableStructureItemList } from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { createGetDefaultStateItemValue } from '../../utils';

import { SetBase64Image, SetBase64ImageSucceeded } from './pin-assignment-state.actions';
import { PinAssignmentStateModel } from './pin-assignment-state.model';
import { getEnvironment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, mergeMap, of } from 'rxjs';
import { PinAssignment } from '../actions/pin-assignment';
import { ProcessStateSelectors } from '../process-state/process-state.selectors';
import { PinAssignmentStateMutations } from './pin-assignment-state.mutations';

const defaultPinAssignmentState: PinAssignmentStateModel = {
  chainFlexNumber: '',
  base64Image: '',
  pinAssignmentStructure: null,
  bridges: { left: [], right: [] },
  litze: [],
  actionModels: null,
  lineOrder: -1,
  processServerError: null,
};

const getDefaultFromPinAssignmentState = createGetDefaultStateItemValue(defaultPinAssignmentState);

@State<PinAssignmentStateModel>({
  name: 'PinAssignmentState',
  defaults: { ...defaultPinAssignmentState },
})
@Injectable()
export class PinAssignmentState {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  @Selector()
  public static pinAssignmentStructure(state: PinAssignmentStateModel): CableStructureItemList {
    return state.pinAssignmentStructure;
  }

  @Selector()
  public static actionModels(state: PinAssignmentStateModel): ActionModels {
    return state.actionModels;
  }

  @Selector()
  public static bridges(state: PinAssignmentStateModel): { left: IcalcBridge[]; right: IcalcBridge[] } {
    return state.bridges;
  }

  @Selector()
  public static litze(state: PinAssignmentStateModel): Litze[] {
    return state.litze;
  }

  @Selector()
  public static lineOrder(state: PinAssignmentStateModel): number {
    return state.lineOrder;
  }

  @Selector()
  public static base64Image(state: PinAssignmentStateModel): string {
    return state.base64Image;
  }

  @Action(SetBase64Image)
  public setBase64Image(
    context: StateContext<PinAssignmentStateModel>,
    action: SetBase64Image
  ): null | PinAssignmentStateModel {
    if (!action.payload) {
      return;
    }
    context.patchState({
      base64Image: `${action.payload}`,
    });

    context.dispatch(new SetBase64ImageSucceeded());
  }

  @Action(PinAssignment.LeavingPinAssignmentPage.Started)
  public setPinAssignment(
    context: StateContext<PinAssignmentStateModel>,
    action: PinAssignment.LeavingPinAssignmentPage.Started
  ) {
    if (action.payload === null) {
      context.patchState({
        bridges: getDefaultFromPinAssignmentState('bridges'),
        actionModels: getDefaultFromPinAssignmentState('actionModels'),
        chainFlexNumber: getDefaultFromPinAssignmentState('chainFlexNumber'),
        litze: getDefaultFromPinAssignmentState('litze'),
      });
      return;
    }
    if (!action.payload) {
      return;
    }

    const {
      pinAssignmentState: { bridges, actionModels, litze },
    } = action.payload;

    context.patchState({ bridges, actionModels, litze });
  }

  @Action(PinAssignment.EnteringPinAssignmentPage.Entered)
  public setUpNewPinAssignment(
    context: StateContext<PinAssignmentStateModel>,
    action: PinAssignment.EnteringPinAssignmentPage.Entered
  ) {
    const { payload } = action;

    const cfCable = payload.chainflexCable;

    const state = { ...defaultPinAssignmentState, ...payload.pinAssignmentState };
    const actionModels = state?.actionModels ?? {};
    const bridges = state?.bridges;
    const setUpNewModels = Object.keys(actionModels).length < 1;

    const cfInformation = payload.cableStructureInformation;

    const structure = cfInformation.structure;

    const {
      state: { connectorState },
    } = this.store.selectSnapshot(ProcessStateSelectors.selectedConfigurationData());

    if (ArrayUtils.isEmpty(structure)) {
      return;
    }

    let isOdd = false;
    let lineOrder = -1;

    const rows = ArrayUtils.fallBackToEmptyArray<Core | Shield | Twisting | Litze>(structure).map((structureItem) => {
      if (structureItem.type === 'core' || structureItem.type === 'shield') {
        isOdd = !isOdd;
        lineOrder = lineOrder + 1;
        if (setUpNewModels) {
          actionModels[`${lineOrder}`] = {
            type: structureItem.type,
            left: { actionSelect: 'none' },
            right: { actionSelect: 'none' },
          };
        }

        actionModels[`${lineOrder}`] = PinAssignmentStateMutations.removeNotExistentMat017ItemsFromActionModel(
          actionModels[`${lineOrder}`],
          connectorState
        );

        return {
          ...structureItem,
          isOdd,
          lineOrder,
        };
      }
      return structureItem;
    });

    const litzeRows = ArrayUtils.fallBackToEmptyArray<Litze>(state.litze).map((litze) => {
      isOdd = !isOdd;
      lineOrder = lineOrder + 1;
      if (setUpNewModels) {
        actionModels[`${lineOrder}`] = {
          type: litze.type,
          left: { actionSelect: 'none' },
          right: { actionSelect: 'none' },
        };
      }
      return {
        ...litze,
        isOdd,
        lineOrder,
      };
    });

    context.patchState({
      chainFlexNumber: cfCable.partNumber,
      lineOrder,
      actionModels,
      bridges,
      pinAssignmentStructure: [...rows, ...litzeRows],
      base64Image: state.base64Image,
    });
  }

  @Action(PinAssignment.ApprovingConfiguration.Started)
  public approveCalculationConfiguration(context: StateContext<PinAssignmentStateModel>) {
    const { configurationId, calculationId } = this.store.selectSnapshot(
      ProcessStateSelectors.selectedSingleCableCalculation()
    );

    const payload = {
      calculationId,
      configurationId,
    };

    return this.http
      .post<CalculationConfigurationStatus>(
        `${getEnvironment().dataServiceUrl}single-cable-calculation/configuration/status/approve`,
        payload
      )
      .pipe(
        catchError((error: unknown) => {
          context.patchState({
            processServerError: error as IcalcHTTPError,
          });
          return of(null);
        }),
        mergeMap((approvalResult: CalculationConfigurationStatus) => {
          if (approvalResult !== null) {
            return context.dispatch(new PinAssignment.ApprovingConfiguration.Succeeded());
          }
        })
      );
  }
}
