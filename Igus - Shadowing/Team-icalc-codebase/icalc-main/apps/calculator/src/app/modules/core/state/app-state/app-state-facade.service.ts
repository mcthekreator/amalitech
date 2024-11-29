import { Injectable } from '@angular/core';
import type { IcalcHTTPError } from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LoginUser, LogoutUser, RemoveUser, SetUser } from './app-state.actions';
import type { IcalcStep, UserData } from './app-state.model';
import { AppState } from './app.state';
import { Api } from '../actions/api';

@Injectable({
  providedIn: 'root',
})
export class AppStateFacadeService {
  @Select(AppState.mainCssClass)
  public mainCssClass$: Observable<string>;

  @Select(AppState.userData)
  public userData$: Observable<UserData>;

  @Select(AppState.isUserLoggedIn)
  public isUserLoggedIn$: Observable<boolean>;

  @Select(AppState.isLoginFailed)
  public isLoginFailed$: Observable<boolean>;

  @Select(AppState.currentStep)
  public currentStep$: Observable<IcalcStep>;

  @Select(AppState.nextStep)
  public nextStep$: Observable<IcalcStep>;

  @Select(AppState.previousStep)
  public previousStep$: Observable<IcalcStep>;

  @Select(AppState.steps)
  public steps$: Observable<IcalcStep[]>;

  @Select(AppState.icalcHTTPError)
  public icalcHTTPError$: Observable<IcalcHTTPError>;

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  @Dispatch()
  public setUser = (userData: UserData): SetUser => new SetUser(userData);

  @Dispatch()
  public removeUser = (): RemoveUser => new RemoveUser();

  @Dispatch()
  public loginUser = (payload: { email: string; password: string }): LoginUser => new LoginUser(payload);

  @Dispatch()
  public logoutUser = (): LogoutUser => new LogoutUser();

  public getUserName(): string {
    return this.store.selectSnapshot(AppState.userName);
  }

  public getNextStepSnapShot(): IcalcStep {
    return this.store.selectSnapshot(AppState.nextStep);
  }

  public hasConfigurationApprovalBeenRevoked$(): Observable<Api.RevokingConfigurationApproval.Succeeded> {
    return this.actions$.pipe(ofActionSuccessful(Api.RevokingConfigurationApproval.Succeeded));
  }
}
