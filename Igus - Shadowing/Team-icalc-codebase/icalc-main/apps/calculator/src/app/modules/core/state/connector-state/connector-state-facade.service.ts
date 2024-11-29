import { Injectable } from '@angular/core';
import type {
  ConnectorSide,
  Favorites,
  IcalcListInformation,
  Mat017ItemListFilter,
  Mat017ItemWithWidenData,
  OneSideOfConfigurationConnectorPresentation,
  CreateMat017ItemManuallyResponseDto,
} from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';

import {
  AddToMat017ItemListWithWidenData,
  ChangeQuantityOfMat017ItemWithWidenData,
  GetMat017ItemsOfConnectorWithWidenData,
  GetFavorites,
  RemoveFromMat017ItemListWithWidenData,
  SetConnector,
  SetBothConnectorStates,
  UpdateSort,
  RemoveManuallyCreatedMat017Item,
} from './connector-state.actions';
import { Api } from '../actions/api';
import type {
  CreatingMat017ItemsSubmittedPayload,
  IcalcConnector,
  IcalcListResponseInformation,
} from './connector-state.model';
import { ConnectorState } from './connector.state';
import { LeftConnector } from '../actions/left-connector';
import { RightConnector } from '../actions/right-connector';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateMat017ItemsDialog } from '../actions/create-mat017-items-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConnectorStateFacadeService {
  @Select(ConnectorState.leftConnector)
  public leftConnector$: Observable<IcalcConnector>;

  @Select(ConnectorState.rightConnector)
  public rightConnector$: Observable<IcalcConnector>;

  @Select(ConnectorState.rightCheckedMat017Items)
  public rightCheckedMat017Items$: Observable<{ [id: string]: boolean }>;

  @Select(ConnectorState.leftCheckedMat017Items)
  public leftCheckedMat017Items$: Observable<{ [id: string]: boolean }>;

  @Select(ConnectorState.leftItemList)
  public leftItemList$: Observable<Mat017ItemWithWidenData[]>;

  @Select(ConnectorState.rightItemList)
  public rightItemList$: Observable<Mat017ItemWithWidenData[]>;

  @Select(ConnectorState.leftTotalCount)
  public leftTotalCount$: Observable<number>;

  @Select(ConnectorState.rightTotalCount)
  public rightTotalCount$: Observable<number>;

  @Select(ConnectorState.leftFavorites)
  public leftFavorites$: Observable<Favorites[]>;

  @Select(ConnectorState.leftFavoritesIsLoading)
  public leftFavoritesIsLoading$: Observable<boolean>;

  @Select(ConnectorState.rightFavorites)
  public rightFavorites$: Observable<Favorites[]>;

  @Select(ConnectorState.rightFavoritesIsLoading)
  public rightFavoritesIsLoading$: Observable<boolean>;

  @Select(ConnectorState.leftListInformation)
  public leftListInformation$: Observable<IcalcListInformation>;

  @Select(ConnectorState.rightListInformation)
  public rightListInformation$: Observable<IcalcListInformation>;

  @Select(ConnectorState.leftListResponseInformation)
  public leftListResponseInformation$: Observable<IcalcListResponseInformation>;

  @Select(ConnectorState.rightListResponseInformation)
  public rightListResponseInformation$: Observable<IcalcListResponseInformation>;

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  @Dispatch()
  public enteringLeftConnectorPageStarted = () => new LeftConnector.EnteringLeftConnectorPage.Started();

  @Dispatch()
  public enteringLeftConnectorPageEntered = (payload: { leftConnector: Partial<IcalcConnector> | null }) =>
    new LeftConnector.EnteringLeftConnectorPage.Entered(payload);

  @Dispatch()
  public leavingLeftConnectorPageStarted = (payload: { leftConnector: OneSideOfConfigurationConnectorPresentation }) =>
    new LeftConnector.LeavingLeftConnectorPage.Started(payload);

  @Dispatch()
  public enteringRightConnectorPageStarted = () => new RightConnector.EnteringRightConnectorPage.Started();

  @Dispatch()
  public enteringRightConnectorPageEntered = (payload: { rightConnector: Partial<IcalcConnector> | null }) =>
    new RightConnector.EnteringRightConnectorPage.Entered(payload);

  @Dispatch()
  public leavingRightConnectorPageStarted = (payload: {
    rightConnector: OneSideOfConfigurationConnectorPresentation;
  }) => new RightConnector.LeavingRightConnectorPage.Started(payload);

  @Dispatch()
  public setConnector = (payload: { which: ConnectorSide; connector: Partial<IcalcConnector> }) =>
    new SetConnector(payload);

  @Dispatch()
  public creatingMat017ItemsSubmitted = (
    payload: CreatingMat017ItemsSubmittedPayload
  ): CreateMat017ItemsDialog.CreatingMat017Items.Submitted =>
    new CreateMat017ItemsDialog.CreatingMat017Items.Submitted(payload);

  @Dispatch()
  public addToMat017ItemListWithWidenData = (payload: {
    which: ConnectorSide;
    mat017ItemsWithWidenData: Mat017ItemWithWidenData[];
  }): AddToMat017ItemListWithWidenData => new AddToMat017ItemListWithWidenData(payload);

  @Dispatch()
  public removeFromMat017ItemListWithWidenData = (payload: {
    which: ConnectorSide;
    mat017ItemWithWidenData: Mat017ItemWithWidenData;
  }): RemoveFromMat017ItemListWithWidenData => new RemoveFromMat017ItemListWithWidenData(payload);

  @Dispatch()
  public cloneLeftConnectorMat017ItemListWithWidenData = (payload: {
    which: 'leftConnector';
    data: OneSideOfConfigurationConnectorPresentation;
  }) => new LeftConnector.CloningMat017ItemList.Cloned(payload);

  @Dispatch()
  public cloneRightConnectorMat017ItemListWithWidenData = (payload: {
    which: 'rightConnector';
    data: OneSideOfConfigurationConnectorPresentation;
  }) => new RightConnector.CloningMat017ItemList.Cloned(payload);

  @Dispatch()
  public getMat017ItemsOfConnectorWithWidenData = (payload: {
    listInformation: Partial<IcalcListInformation>;
    filterInformation?: Mat017ItemListFilter;
    which: ConnectorSide;
  }): GetMat017ItemsOfConnectorWithWidenData => new GetMat017ItemsOfConnectorWithWidenData(payload);

  @Dispatch()
  public removeManuallyCreatedMat017Item = (payload: {
    matNumber: string;
    which?: ConnectorSide;
  }): RemoveManuallyCreatedMat017Item => {
    return new RemoveManuallyCreatedMat017Item(payload);
  };

  @Dispatch()
  public updateSort = (payload: { which: ConnectorSide; listInformation: IcalcListInformation }): UpdateSort =>
    new UpdateSort(payload);

  @Dispatch()
  public getFavorites = (payload: { which: ConnectorSide }): GetFavorites => {
    return new GetFavorites(payload);
  };

  @Dispatch()
  public changeQuantityOfMat017ItemWithWidenData = (payload: {
    which: ConnectorSide;
    amount: number;
    matNumber: string;
  }): ChangeQuantityOfMat017ItemWithWidenData => new ChangeQuantityOfMat017ItemWithWidenData(payload);

  @Dispatch()
  public setBothConnectorStates = (payload: {
    leftConnector: Partial<IcalcConnector>;
    rightConnector: Partial<IcalcConnector>;
  }): SetBothConnectorStates => new SetBothConnectorStates(payload);

  public creatingMat017ItemsFailed$(): Observable<HttpErrorResponse> {
    return this.actions$.pipe(
      ofActionSuccessful(Api.CreatingMat017Items.Failed),
      map((action: Api.CreatingMat017Items.Failed) => action.payload)
    );
  }

  public creatingMat017ItemsSucceeded$(): Observable<CreateMat017ItemManuallyResponseDto> {
    return this.actions$.pipe(
      ofActionSuccessful(Api.CreatingMat017Items.Succeeded),
      map((action: Api.CreatingMat017Items.Succeeded) => action.payload.response)
    );
  }

  public getConnectorSelector(which: ConnectorSide): Observable<IcalcConnector> {
    return this.store.select(ConnectorState.connector).pipe(map((whichFunction) => whichFunction(which)));
  }

  public getListInformationSnapshot(which?: 'rightConnector' | 'leftConnector'): IcalcListInformation {
    if (which === 'leftConnector') {
      return this.store.selectSnapshot(ConnectorState.leftListInformation);
    }
    if (which === 'rightConnector') {
      return this.store.selectSnapshot(ConnectorState.rightListInformation);
    }
  }

  public leftConnectorSnapshot(): IcalcConnector {
    return this.store.selectSnapshot(ConnectorState.leftConnector);
  }

  public rightConnectorSnapshot(): IcalcConnector {
    return this.store.selectSnapshot(ConnectorState.rightConnector);
  }
}
