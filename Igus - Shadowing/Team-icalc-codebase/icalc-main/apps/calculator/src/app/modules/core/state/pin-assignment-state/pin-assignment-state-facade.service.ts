import { Injectable } from '@angular/core';
import type {
  ActionModels,
  CableStructureInformation,
  ConfigurationPinAssignmentState,
  IcalcBridge,
  Litze,
  PinAssignmentValidationResult,
} from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Actions, ofActionCompleted, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { PinAssignmentState } from './pin-assignment-state';

import { SetBase64Image } from './pin-assignment-state.actions';
import type {
  LeavingPinAssignmentPageStartedPayload,
  NavigatingBackFromPinAssignmentPagePayload,
  NavigatingToResultsPagePayload,
  EnteringPinAssignmentPagePayload,
} from './pin-assignment-state.model';
import { PinAssignment } from '../actions/pin-assignment';
import { Api } from '../actions/api';

@Injectable({
  providedIn: 'root',
})
export class PinAssignmentStateFacadeService {
  @Select(PinAssignmentState.pinAssignmentStructure)
  public pinAssignmentStructure$: Observable<CableStructureInformation>;

  @Select(PinAssignmentState.bridges)
  public bridges$: Observable<CableStructureInformation>;

  @Select(PinAssignmentState.base64Image)
  public base64Image$: Observable<string>;

  @Select(PinAssignmentState.lineOrder)
  public lineOrder$: Observable<CableStructureInformation>;

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  @Dispatch()
  public setBase64Image = (payload: string) => new SetBase64Image(payload);

  @Dispatch()
  public enteringPinAssignmentPageStarted = () => new PinAssignment.EnteringPinAssignmentPage.Started();

  @Dispatch()
  public enteringPinAssignmentPageEntered = (payload: EnteringPinAssignmentPagePayload) =>
    new PinAssignment.EnteringPinAssignmentPage.Entered(payload);

  @Dispatch()
  public approveCalculationConfiguration = () => new PinAssignment.ApprovingConfiguration.Started();

  @Dispatch()
  public validatingPinAssignmentStarted = (payload: {
    calculationId: string;
    configurationId: string;
    pinAssignmentState?: ConfigurationPinAssignmentState;
  }) => new PinAssignment.ValidatingPinAssignment.Started(payload);

  @Dispatch()
  public leavingPinAssignmentStarted = (payload: LeavingPinAssignmentPageStartedPayload) =>
    new PinAssignment.LeavingPinAssignmentPage.Started(payload);

  @Dispatch()
  public navigatingBackFromPinAssignmentPageStarted = (payload: NavigatingBackFromPinAssignmentPagePayload) =>
    new PinAssignment.NavigatingBackFromPinAssignmentPage.Started(payload);

  @Dispatch()
  public navigatingToResultsPageStarted = (payload: NavigatingToResultsPagePayload) =>
    new PinAssignment.NavigatingToResultsPage.Started(payload);

  public configurationValidationResult$(): Observable<PinAssignmentValidationResult> {
    return this.actions$.pipe(
      ofActionSuccessful(Api.ValidatingPinAssignment.Succeeded),
      map((action: Api.ValidatingPinAssignment.Succeeded) => action.payload)
    );
  }

  public hasPinAssignmentDataBeenSaved$(): Observable<Api.UpdatingPinAssignment.Succeeded> {
    return this.actions$.pipe(ofActionSuccessful(Api.UpdatingPinAssignment.Succeeded));
  }

  public approveCalculationConfigurationResult$(): Observable<PinAssignment.ApprovingConfiguration.Succeeded> {
    return this.actions$.pipe(ofActionSuccessful(PinAssignment.ApprovingConfiguration.Succeeded));
  }

  public setBase64Completed$(): Observable<boolean> {
    return this.actions$.pipe(
      ofActionCompleted(SetBase64Image),
      map((actionCompletion) => actionCompletion.result.successful || actionCompletion.result.canceled)
    );
  }

  public getBase64ImageSnapshot(): string {
    return this.store.selectSnapshot(PinAssignmentState.base64Image);
  }

  public getLineOrderSnapshot(): number {
    return this.store.selectSnapshot(PinAssignmentState.lineOrder);
  }

  public getActionModelsSnapshot(): ActionModels {
    return this.store.selectSnapshot(PinAssignmentState.actionModels);
  }

  public getBridgesSnapshot(): { left: IcalcBridge[]; right: IcalcBridge[] } {
    return this.store.selectSnapshot(PinAssignmentState.bridges);
  }

  public getLitzeSnapshot(): Litze[] {
    return this.store.selectSnapshot(PinAssignmentState.litze);
  }
}
