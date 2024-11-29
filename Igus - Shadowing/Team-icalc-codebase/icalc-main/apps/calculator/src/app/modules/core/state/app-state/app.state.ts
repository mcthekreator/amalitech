import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import { IcalcHTTPError } from '@igus/icalc-domain';
import type { IcalcAuthResponse } from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { getEnvironment } from '../../../../../environments/environment';
import { catchError, of } from 'rxjs';
import type { Observable } from 'rxjs';

import { LoginUser, LogoutUser, RemoveUser, SetUser } from './app-state.actions';
import { IcalcStep, UserData, AppStateModel } from './app-state.model';
import { Chainflex } from '../actions/chainflex';
import { LeftConnector } from '../actions/left-connector';
import { Results } from '../actions/results';
import { RightConnector } from '../actions/right-connector';
import { Library } from '../actions/library';
import { PinAssignment } from '../actions/pin-assignment';
import { APP_FULL_WIDTH_CSS_CLASS } from '@icalc/frontend/app/constants/constants';
import { MetaData } from '../actions/meta-data';

const defaultSteps: IcalcStep[] = [
  {
    label: IcalcRoutes.metaData,
    route: `/app/${IcalcRoutes.metaData}`,
  },
  {
    label: IcalcRoutes.chainFlex,
    route: `/app/${IcalcRoutes.chainFlex}`,
  },
  {
    label: `${IcalcRoutes.connectorLeft}`,
    route: `/app/${IcalcRoutes.connector}/${IcalcRoutes.left}`,
  },
  {
    label: `${IcalcRoutes.connectorRight}`,
    route: `/app/${IcalcRoutes.connector}/${IcalcRoutes.right}`,
  },
  {
    label: IcalcRoutes.library,
    route: `/app/${IcalcRoutes.library}`,
  },
  {
    label: IcalcRoutes.pinAssignment,
    route: `/app/${IcalcRoutes.pinAssignment}`,
  },
  {
    label: IcalcRoutes.results,
    route: `/app/${IcalcRoutes.results}`,
  },
].map((step) => ({ ...step, isVisible: true, isDisabled: false }));

@State<AppStateModel>({
  name: 'AppState',
  defaults: {
    userData: null,
    isUserLoggedIn: false,
    isLoginFailed: false,
    currentStep: null,
    steps: [...defaultSteps],
    mainCssClass: '',
    calcError: null,
  },
})
@Injectable()
export class AppState {
  constructor(private readonly http: HttpClient) {}

  @Selector()
  public static mainCssClass(state: AppStateModel): string {
    return state.mainCssClass;
  }

  @Selector()
  public static userData(state: AppStateModel): UserData {
    return state.userData;
  }

  @Selector()
  public static isUserLoggedIn(state: AppStateModel): boolean {
    return state.isUserLoggedIn;
  }

  @Selector()
  public static isLoginFailed(state: AppStateModel): boolean {
    return state.isLoginFailed;
  }

  @Selector()
  public static userName(state: AppStateModel): string | undefined {
    if (!state.userData) {
      return '';
    }
    return `${state.userData?.firstName ?? ''} ${state.userData?.lastName ?? ''}`;
  }

  @Selector()
  public static currentStep(state: AppStateModel): IcalcStep {
    return state.currentStep;
  }

  @Selector()
  public static nextStep(state: AppStateModel): null | IcalcStep {
    if (!state.currentStep) {
      return null;
    }
    const currentStepIndex = state.steps?.findIndex((step) => step.label === state.currentStep.label);

    if (currentStepIndex < state.steps.length - 1) {
      return state.steps[currentStepIndex + 1];
    }
    return null;
  }

  @Selector()
  public static previousStep(state: AppStateModel): null | IcalcStep {
    if (!state.currentStep) {
      return null;
    }
    const currentStepIndex = state.steps?.findIndex((step) => step.label === state.currentStep.label);

    if (currentStepIndex > 0) {
      return state.steps[currentStepIndex - 1];
    }
    return null;
  }

  @Selector()
  public static steps(state: AppStateModel): IcalcStep[] {
    return state.steps;
  }

  @Selector()
  public static icalcHTTPError(state: AppStateModel): IcalcHTTPError {
    return state.calcError;
  }

  @Action([
    MetaData.EnteringMetaDataPage.Started,
    Chainflex.EnteringChainflexPage.Started,
    LeftConnector.EnteringLeftConnectorPage.Started,
    RightConnector.EnteringRightConnectorPage.Started,
    Library.EnteringLibraryPage.Started,
    PinAssignment.EnteringPinAssignmentPage.Started,
    Results.EnteringResultsPage.Started,
  ])
  public setAppFullWidthClass(context: StateContext<AppStateModel>): void {
    context.patchState({
      mainCssClass: APP_FULL_WIDTH_CSS_CLASS,
    });
  }

  @Action([
    MetaData.UpdatingMetaData.Started,
    Chainflex.LeavingChainflexPage.Started,
    LeftConnector.LeavingLeftConnectorPage.Started,
    RightConnector.LeavingRightConnectorPage.Started,
    Results.LeavingResultsPage.Started,
  ])
  public resetMainCssClass(context: StateContext<AppStateModel>) {
    context.patchState({
      mainCssClass: '',
    });
  }

  @Action(LoginUser)
  public loginUser(context: StateContext<AppStateModel>, action: LoginUser): undefined | Observable<null> {
    if (!action?.payload?.email || !action?.payload?.password) {
      return;
    }
    context.patchState({ isLoginFailed: false });
    this.http
      .post<{ user: UserData }>(`${getEnvironment().dataServiceUrl}auth/signin`, action?.payload, {
        withCredentials: true,
      })
      .pipe(
        catchError((error: unknown) => {
          if ((error as HttpErrorResponse).status === 403) {
            context.patchState({ isUserLoggedIn: false, isLoginFailed: true });
          }
          return of(null);
        })
      )
      .subscribe((userData) => {
        if (userData === null || !userData.user) {
          return;
        }
        context.patchState({ isUserLoggedIn: true, isLoginFailed: false, userData: userData.user });
      });
  }

  @Action(LogoutUser)
  public logoutUser(context: StateContext<AppStateModel>): void {
    this.http.post<IcalcAuthResponse>(`${getEnvironment().dataServiceUrl}auth/logout`, {}).subscribe((_) => {
      context.patchState({ isUserLoggedIn: false, isLoginFailed: false, userData: null });
    });
  }

  @Action(SetUser)
  public setUser(context: StateContext<AppStateModel>, action: SetUser): undefined | void {
    if (!action?.userData) {
      return;
    }
    context.patchState({
      userData: action.userData,
      isLoginFailed: false,
      isUserLoggedIn: true,
    });
  }

  @Action(RemoveUser)
  public removeUser(context: StateContext<AppStateModel>): void {
    context.patchState({
      userData: null,
      isLoginFailed: false,
      isUserLoggedIn: false,
    });
  }

  @Action([MetaData.EnteringMetaDataPage.Entered])
  public setMetaDataStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.metaData);
  }

  @Action([Chainflex.EnteringChainflexPage.Entered])
  public setChainflexStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.chainFlex);
  }

  @Action([LeftConnector.EnteringLeftConnectorPage.Entered])
  public setLeftConnectorStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.connectorLeft);
  }

  @Action([RightConnector.EnteringRightConnectorPage.Entered])
  public setRightConnectorStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.connectorRight);
  }

  @Action([Library.EnteringLibraryPage.Entered])
  public setLibraryStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.library);
  }

  @Action([PinAssignment.EnteringPinAssignmentPage.Entered])
  public setPinAssignmentStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.pinAssignment);
  }

  @Action([Results.EnteringResultsPage.Entered])
  public setResultsStep(context: StateContext<AppStateModel>): void {
    this.setCurrentStep(context, IcalcRoutes.results);
  }

  private setCurrentStep(context: StateContext<AppStateModel>, newStepLabel: string): void {
    const state = context.getState();

    if (ArrayUtils.isEmpty(state.steps)) {
      return;
    }
    const newStep = state.steps.find((step) => step.label === newStepLabel);

    if (!newStep) {
      return;
    }
    context.patchState({
      currentStep: { ...newStep },
    });
  }
}
