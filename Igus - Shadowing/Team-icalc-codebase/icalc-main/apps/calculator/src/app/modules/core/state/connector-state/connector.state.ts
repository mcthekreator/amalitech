import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArrayUtils } from '@igus/icalc-utils';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { getEnvironment } from '../../../../../environments/environment';
import { ObjectUtils, IcalcListInformation, Mat017ItemOverridesEnum, Mat017ItemStatus } from '@igus/icalc-domain';
import { Observable, catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
import {
  IcalcConnector,
  IcalcListResponseInformation,
  ConnectorStateModel,
  createMat017ItemWithWidenDataStatus,
} from './connector-state.model';
import type {
  Favorites,
  IcalcListResult,
  Mat017ItemSearchResult,
  Mat017ItemWithWidenData,
  UpdateMat017ItemsOverridesInConfigurationsResponseDto,
  UpdateMat017OverridesRequestDto,
  ConnectorSide,
  CreateMat017ItemManuallyRequestDto,
  CreateMat017ItemManuallyResponseDto,
  Mat017ItemCreationData,
  Mat017ItemListFilter,
} from '@igus/icalc-domain';
import { ItemListLimitReachedComponent } from '../../../shared/components/itemlist-limit-reached/itemlist-limit-reached.component';
import { LeftConnector } from '../actions/left-connector';
import { RightConnector } from '../actions/right-connector';
import { ProcessStateSelectors } from '../process-state/process-state.selectors';
import { Api } from '../actions/api';
import { CalculationApiService } from '../../data-access/calculation-api.service';
import { patch } from '@ngxs/store/operators';
import { Mat017ItemApiService } from '../../data-access/mat017-item-api.service';
import { CreateMat017ItemsDialog } from '../actions/create-mat017-items-dialog';

const environment = getEnvironment();

const defaultConnectorState: IcalcConnector = {
  addedMat017Items: {},
  checkedMat017Items: {},
  listResponseInformation: null,
  mat017ItemListWithWidenData: [],
  items: [],
  isLoading: false,
  selectedTab: 'recommendations',
  totalCount: -1,
  listInformation: {
    orderDirection: 'desc',
    search: '',
    skip: 0,
    take: 100,
    orderBy: 'score',
  },
  filterInformation: { showZeroMatches: false, showOnlyManuallyCreated: false },
  favorites: [],
  favoritesLoaded: false,
  favoritesIsLoading: true,
};

@State<ConnectorStateModel>({
  name: 'ConnectorState',
  defaults: {
    leftConnector: { ...defaultConnectorState },
    rightConnector: {
      ...defaultConnectorState,
    },
  },
})
@Injectable()
export class ConnectorState {
  constructor(
    private http: HttpClient,
    private matSnackBar: MatSnackBar,
    private store: Store,
    private calculationApiService: CalculationApiService,
    private mat017ItemApiService: Mat017ItemApiService
  ) {}

  @Selector()
  public static connector(state: ConnectorStateModel) {
    return (which: ConnectorSide): IcalcConnector => {
      return state[which] || null;
    };
  }

  @Selector()
  public static leftConnector(state: ConnectorStateModel): IcalcConnector {
    return state.leftConnector;
  }

  @Selector()
  public static rightConnector(state: ConnectorStateModel): IcalcConnector {
    return state.rightConnector;
  }

  @Selector()
  public static isRightConnectorValid(state: ConnectorStateModel): boolean {
    return (
      Object.keys(state.rightConnector.addedMat017Items)?.length > 0 &&
      ArrayUtils.isNotEmpty(state.rightConnector?.mat017ItemListWithWidenData)
    );
  }

  @Selector()
  public static rightAddedMat017Items(state: ConnectorStateModel): { [id: string]: number } {
    return state.rightConnector?.addedMat017Items;
  }

  @Selector()
  public static leftAddedMat017Items(state: ConnectorStateModel): { [id: string]: number } {
    return state.leftConnector?.addedMat017Items;
  }

  @Selector()
  public static rightCheckedMat017Items(state: ConnectorStateModel): { [id: string]: boolean } {
    return state.rightConnector?.checkedMat017Items;
  }

  @Selector()
  public static leftCheckedMat017Items(state: ConnectorStateModel): { [id: string]: boolean } {
    return state.leftConnector?.checkedMat017Items;
  }

  @Selector()
  public static leftItemList(state: ConnectorStateModel): Mat017ItemWithWidenData[] {
    return state.leftConnector?.mat017ItemListWithWidenData;
  }

  @Selector()
  public static rightItemList(state: ConnectorStateModel): Mat017ItemWithWidenData[] {
    return state.rightConnector?.mat017ItemListWithWidenData;
  }

  @Selector()
  public static leftFavorites(state: ConnectorStateModel): Favorites[] {
    return state.leftConnector?.favorites;
  }

  @Selector()
  public static rightFavorites(state: ConnectorStateModel): Favorites[] {
    return state.rightConnector?.favorites;
  }

  @Selector()
  public static leftFavoritesIsLoading(state: ConnectorStateModel): boolean {
    return state.leftConnector?.favoritesIsLoading;
  }

  @Selector()
  public static rightFavoritesIsLoading(state: ConnectorStateModel): boolean {
    return state.rightConnector?.favoritesIsLoading;
  }

  @Selector()
  public static leftTotalCount(state: ConnectorStateModel): number {
    return state.leftConnector?.totalCount;
  }

  @Selector()
  public static rightTotalCount(state: ConnectorStateModel): number {
    return state.rightConnector?.totalCount;
  }

  @Selector()
  public static leftListInformation(state: ConnectorStateModel): IcalcListInformation {
    return state.leftConnector?.listInformation;
  }

  @Selector()
  public static rightListInformation(state: ConnectorStateModel): IcalcListInformation {
    return state.rightConnector?.listInformation;
  }

  @Selector()
  public static leftListResponseInformation(state: ConnectorStateModel): IcalcListResponseInformation {
    return state.leftConnector?.listResponseInformation;
  }

  @Selector()
  public static rightListResponseInformation(state: ConnectorStateModel): IcalcListResponseInformation {
    return state.rightConnector?.listResponseInformation;
  }

  @Action(LeftConnector.EnteringLeftConnectorPage.Entered)
  public setLeftConnector(
    context: StateContext<ConnectorStateModel>,
    action: LeftConnector.EnteringLeftConnectorPage.Entered
  ) {
    const { getState, patchState } = context;
    const state = getState();
    const {
      payload: { leftConnector },
    } = action;

    if (leftConnector === null) {
      patchState({
        leftConnector: { ...defaultConnectorState },
      });
      return;
    }

    const currentConnector = state.leftConnector;

    patchState({
      leftConnector: { ...currentConnector, ...action.payload.leftConnector },
    });
    return this.updateMat017ItemsGroupsIfChanged(context, 'leftConnector');
  }

  @Action(RightConnector.EnteringRightConnectorPage.Entered)
  public setRightConnector(
    context: StateContext<ConnectorStateModel>,
    action: RightConnector.EnteringRightConnectorPage.Entered
  ) {
    const { getState, patchState } = context;
    const state = getState();
    const {
      payload: { rightConnector },
    } = action;

    if (rightConnector === null) {
      patchState({
        rightConnector: { ...defaultConnectorState },
      });
      return;
    }

    const currentConnector = state.rightConnector;

    patchState({
      rightConnector: { ...currentConnector, ...action.payload.rightConnector },
    });

    return this.updateMat017ItemsGroupsIfChanged(context, 'rightConnector');
  }

  @Action(SetConnector)
  public setConnector(context: StateContext<ConnectorStateModel>, action: SetConnector): void {
    if (
      action.payload &&
      (action.payload.which === 'rightConnector' || action.payload.which === 'leftConnector') &&
      action.payload.connector
    ) {
      const state = context.getState();
      const currentConnector = state[action.payload.which];

      context.patchState({
        [action.payload.which]: { ...currentConnector, ...action.payload.connector },
      });
    }
  }

  @Action(GetFavorites)
  public getFavorites(
    context: StateContext<ConnectorStateModel>,
    action: GetFavorites
  ): undefined | Observable<Favorites[]> {
    const state = context.getState();
    const currentConnector = state[action.payload.which];

    if (currentConnector.favoritesLoaded) {
      return;
    }

    return this.http.get<Favorites[]>(environment.dataServiceUrl + 'favorites').pipe(
      catchError((_: unknown) => {
        return of([]);
      }),
      tap((result: Favorites[]) => {
        result.forEach((favorites) => {
          favorites.favoritesToMat017Items.forEach((item) => {
            item.checked = true;
          });
        });
        context.patchState({
          [action.payload.which]: {
            ...currentConnector,
            favorites: result,
            favoritesLoaded: true,
            favoritesIsLoading: false,
          } as IcalcConnector,
        });
      })
    );
  }

  @Action(AddToMat017ItemListWithWidenData)
  public addToMat017ItemListWithWidenData(
    context: StateContext<ConnectorStateModel>,
    action: AddToMat017ItemListWithWidenData
  ): undefined | void {
    if (
      !action.payload ||
      (action.payload.which !== 'rightConnector' &&
        action.payload.which !== 'leftConnector' &&
        !action.payload.mat017ItemsWithWidenData)
    ) {
      return;
    }

    const state = context.getState();
    const currentConnector = state[action.payload.which];
    const addedMat017Items = { ...currentConnector.addedMat017Items };
    let currentItemList = currentConnector.mat017ItemListWithWidenData;
    let newMat017ItemList = [];

    action.payload.mat017ItemsWithWidenData
      .filter((mat017ItemWithWidenData) => mat017ItemWithWidenData.matNumber)
      .forEach((mat017ItemWithWidenData) => {
        if (!addedMat017Items[mat017ItemWithWidenData.matNumber]) {
          // Item is new to the item list
          addedMat017Items[mat017ItemWithWidenData.matNumber] = mat017ItemWithWidenData.quantity
            ? mat017ItemWithWidenData.quantity
            : 1;

          const addedMat017Item = ObjectUtils.cloneDeep<Mat017ItemWithWidenData>({
            ...mat017ItemWithWidenData,
            quantity: mat017ItemWithWidenData.quantity ? mat017ItemWithWidenData.quantity : 1,
            status: action.payload.which === 'leftConnector' ? 'left' : 'right',
          });

          newMat017ItemList = [...newMat017ItemList, addedMat017Item];
        } else {
          // Item was already in the item list
          addedMat017Items[mat017ItemWithWidenData.matNumber] =
            addedMat017Items[mat017ItemWithWidenData.matNumber] + mat017ItemWithWidenData.quantity;

          const isItemInCurrentList = !!currentItemList.find(
            (item) => item.matNumber === mat017ItemWithWidenData.matNumber
          );

          if (isItemInCurrentList) {
            currentItemList = currentItemList.map((item) => ({
              ...item,
              quantity:
                item.matNumber === mat017ItemWithWidenData.matNumber
                  ? item.quantity + mat017ItemWithWidenData.quantity
                  : item.quantity,
            }));
          } else {
            newMat017ItemList = newMat017ItemList.map((item) => ({
              ...item,
              quantity:
                item.matNumber === mat017ItemWithWidenData.matNumber
                  ? item.quantity + mat017ItemWithWidenData.quantity
                  : item.quantity,
            }));
          }
        }
      });

    let listLength;

    if (action.payload.which === 'leftConnector') {
      listLength =
        currentItemList.length + newMat017ItemList.length + state.leftConnector.mat017ItemListWithWidenData.length;
    } else {
      listLength =
        currentItemList.length + newMat017ItemList.length + state.rightConnector.mat017ItemListWithWidenData.length;
    }

    // check if limit is reached
    if (listLength > 36) {
      this.matSnackBar.openFromComponent(ItemListLimitReachedComponent, {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'icalc-snackbar-panel',
      });
      return;
    }

    context.patchState({
      [action.payload.which]: {
        ...currentConnector,
        mat017ItemListWithWidenData: [...currentItemList, ...newMat017ItemList],
        addedMat017Items,
      } as IcalcConnector,
    });
  }

  @Action(Api.CreatingMat017Items.Succeeded)
  public addManuallyCreatedMat017ItemsToBom(
    context: StateContext<ConnectorStateModel>,
    action: Api.CreatingMat017Items.Succeeded
  ) {
    const { getState, dispatch } = context;
    const { response, which, mat017ItemsToCreate } = action.payload;
    const state = getState();
    const currentConnector = state[which];

    const itemsAddedToBomMap = ArrayUtils.transformToMapByKey<Mat017ItemCreationData>(
      mat017ItemsToCreate.filter((item) => item.addToBomOnCreate),
      'matNumber'
    );

    const mat017ItemsWithWidenDataToAdd = response
      .filter((createdMat017Item) => itemsAddedToBomMap.get(createdMat017Item.matNumber))
      .map<Mat017ItemWithWidenData>((item) => {
        const { amountDividedByPriceUnit, mat017ItemGroup } = item || {};

        return {
          ...item,
          overrides: {
            amountDividedByPriceUnit,
            mat017ItemGroup,
          },
          status: createMat017ItemWithWidenDataStatus(currentConnector, item, which),
          quantity: 1,
        };
      });

    dispatch([
      new AddToMat017ItemListWithWidenData({ which, mat017ItemsWithWidenData: mat017ItemsWithWidenDataToAdd }),
    ]);
  }

  @Action(RemoveFromMat017ItemListWithWidenData)
  public removeFromMat017ItemListWithWidenData(
    context: StateContext<ConnectorStateModel>,
    action: RemoveFromMat017ItemListWithWidenData
  ): void {
    if (
      action.payload &&
      (action.payload.which === 'rightConnector' || action.payload.which === 'leftConnector') &&
      action.payload.mat017ItemWithWidenData &&
      action.payload.mat017ItemWithWidenData.matNumber
    ) {
      const state = context.getState();
      const currentConnector = state[action.payload.which];

      const addedMat017Items = { ...currentConnector.addedMat017Items };

      const isMat017ItemAdded = addedMat017Items[action.payload.mat017ItemWithWidenData.matNumber];

      if (isMat017ItemAdded) {
        delete addedMat017Items[action.payload.mat017ItemWithWidenData.matNumber];
      }

      const itemToRemove = ObjectUtils.cloneDeep<Mat017ItemWithWidenData>({
        ...action.payload.mat017ItemWithWidenData,
        quantity: 1,
        status: action.payload.which === 'leftConnector' ? 'left' : 'right',
      });

      itemToRemove.quantity = null;
      itemToRemove.status = null;

      const mat017ItemListWithWidenData = currentConnector.mat017ItemListWithWidenData.filter(
        (item) => item.matNumber !== itemToRemove.matNumber
      );

      context.patchState({
        [action.payload.which]: {
          ...currentConnector,
          mat017ItemListWithWidenData,
          addedMat017Items,
          checkedMat017Items: {},
        },
      });
    }
  }

  @Action([LeftConnector.LeavingLeftConnectorPage.Started])
  public resetLeftConnectorState(context: StateContext<ConnectorStateModel>): void {
    context.patchState({
      leftConnector: {
        ...defaultConnectorState,
      },
    });
  }

  @Action([RightConnector.LeavingRightConnectorPage.Started])
  public resetRightConnectorState(context: StateContext<ConnectorStateModel>): void {
    context.patchState({
      rightConnector: {
        ...defaultConnectorState,
      },
    });
  }

  @Action(SetBothConnectorStates)
  public setBothConnectorStates(
    context: StateContext<ConnectorStateModel>,
    action: SetBothConnectorStates
  ): undefined | void {
    if (action.payload === null) {
      context.patchState({
        leftConnector: { ...defaultConnectorState },
        rightConnector: {
          ...defaultConnectorState,
        },
      });
      return;
    }
    if (!action.payload) {
      return;
    }
    const state = context.getState();

    context.patchState({
      leftConnector: { ...state.leftConnector, ...(action.payload?.leftConnector || {}) },
      rightConnector: { ...state.rightConnector, ...(action.payload?.rightConnector || {}) },
    });
  }

  @Action(RemoveManuallyCreatedMat017Item)
  public removeManuallyCreatedMat017Item(
    context: StateContext<ConnectorStateModel>,
    action: RemoveManuallyCreatedMat017Item
  ): Observable<IcalcListResult<Mat017ItemSearchResult> | void> {
    const { payload } = action;
    const { getState, patchState } = context;
    const state = getState();

    return this.mat017ItemApiService.delete(payload.matNumber).pipe(
      tap(() => {
        const { leftConnector: updatedLeftConnectorItems, rightConnector: updatedRightConnectorItems } =
          this.updateBomItemStatusOnManuallyCreatedItemRemoval(state, payload.matNumber) || {};

        patchState({
          leftConnector: {
            ...state.leftConnector,
            mat017ItemListWithWidenData: [...updatedLeftConnectorItems],
          },
          rightConnector: {
            ...state.rightConnector,
            mat017ItemListWithWidenData: [...updatedRightConnectorItems],
          },
        });

        context.dispatch(
          new GetMat017ItemsOfConnectorWithWidenData({
            which: payload.which,
            listInformation: { skip: 0 },
          })
        );
      })
    );
  }

  @Action([
    GetMat017ItemsOfConnectorWithWidenData,
    Api.CreatingMat017Items.Succeeded,
    Api.DeletingManuallyCreatedMat017Item.Succeeded,
  ])
  public getMat017ItemsOfConnectorWithWidenData(
    context: StateContext<ConnectorStateModel>,
    action: GetMat017ItemsOfConnectorWithWidenData | Api.CreatingMat017Items.Succeeded
  ): undefined | Observable<IcalcListResult<Mat017ItemSearchResult>> {
    if (action.payload && (action.payload.which === 'rightConnector' || action.payload.which === 'leftConnector')) {
      let state = context.getState();
      let currentConnector = ObjectUtils.cloneDeep<IcalcConnector>(state[action.payload.which]);
      const partNumber = this.store.selectSnapshot(ProcessStateSelectors.chainflexCable()).partNumber;

      if (!partNumber) {
        context.patchState({
          [action.payload.which]: {
            ...currentConnector,
            listResponseInformation: {
              severity: 'warning',
              text: 'icalc.connector-mat017-items-table.SELECT_CHAINFLEX_WARNING',
            },
          } as IcalcConnector,
        });
        return;
      }

      let listInformationPayload: Partial<IcalcListInformation> = currentConnector.listInformation;
      let filterInformationPayload: Partial<Mat017ItemListFilter> = currentConnector.filterInformation;

      if (action instanceof GetMat017ItemsOfConnectorWithWidenData) {
        listInformationPayload = action.payload.listInformation ?? listInformationPayload;
        filterInformationPayload = action.payload.filterInformation ?? filterInformationPayload;
      }

      context.patchState({
        [action.payload.which]: {
          ...currentConnector,
          listResponseInformation: null,
          listInformation: { ...currentConnector.listInformation, ...listInformationPayload },
          filterInformation: { ...filterInformationPayload },
          isLoading: true,
          items: [],
        } as IcalcConnector,
      });

      state = context.getState();
      currentConnector = ObjectUtils.cloneDeep<IcalcConnector>(state[action.payload.which]);
      const listInformation = currentConnector.listInformation;
      const filterInformation = currentConnector.filterInformation;
      const params = new HttpParams({
        fromObject: {
          ...listInformation,
          ...filterInformation,
          partNumber,
          items: ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
            currentConnector.mat017ItemListWithWidenData
          ).map((item) => item.matNumber),
        },
      });

      return this.http
        .get<IcalcListResult<Mat017ItemSearchResult>>(`${environment.dataServiceUrl}mat017-item`, {
          params,
        })
        .pipe(
          catchError((_: unknown) =>
            of({ data: [], totalCount: 0, listParameter: state.leftConnector.listInformation })
          ),
          tap((result: IcalcListResult<Mat017ItemSearchResult>) => {
            state = context.getState();
            currentConnector = ObjectUtils.cloneDeep<IcalcConnector>(state[action.payload.which]);
            context.patchState({
              [action.payload.which]: {
                ...currentConnector,
                isLoading: false,
                items: result.data.map((item) => ({
                  ...item,
                  status: createMat017ItemWithWidenDataStatus(currentConnector, item, action.payload.which),
                })),
                totalCount: result.totalCount,
              },
            });
          })
        );
    }
  }

  @Action(ChangeQuantityOfMat017ItemWithWidenData)
  public changeQuantityOfMat017ItemWithWidenData(
    context: StateContext<ConnectorStateModel>,
    action: ChangeQuantityOfMat017ItemWithWidenData
  ): void {
    if (
      action.payload &&
      (action.payload.which === 'rightConnector' ||
        (action.payload.which === 'leftConnector' && action.payload.matNumber && action.payload.amount))
    ) {
      const state = context.getState();
      const currentConnector = state[action.payload.which];

      const mat017ItemListWithWidenData = currentConnector.mat017ItemListWithWidenData.map((item) => {
        if (item.matNumber === action.payload.matNumber) {
          return { ...item, quantity: +action.payload.amount };
        }
        return { ...item };
      });

      context.patchState({
        [action.payload.which]: {
          ...currentConnector,
          mat017ItemListWithWidenData,
          addedMat017Items: { ...currentConnector.addedMat017Items, [action.payload.matNumber]: action.payload.amount },
        } as IcalcConnector,
      });
    }
  }

  @Action(UpdateSort)
  public updateSort(context: StateContext<ConnectorStateModel>, action: UpdateSort): void {
    if (action.payload && action.payload.which && action.payload.listInformation) {
      const state = context.getState();
      const currentConnector = state[action.payload.which];

      context.patchState({
        [action.payload.which]: {
          ...currentConnector,
          listInformation: { ...action.payload.listInformation },
        } as IcalcConnector,
      });
    }
  }

  @Action(CreateMat017ItemsDialog.CreatingMat017Items.Submitted)
  public createMatItems(
    context: StateContext<ConnectorStateModel>,
    action: CreateMat017ItemsDialog.CreatingMat017Items.Submitted
  ) {
    const { dispatch } = context;
    const { which, mat017ItemsToCreate } = action.payload;

    const payload = this.mapToCreateManualItemRequest(mat017ItemsToCreate);

    return this.mat017ItemApiService.createMat017Item(payload).pipe(
      tap((response: CreateMat017ItemManuallyResponseDto) => {
        if (response instanceof HttpErrorResponse) {
          dispatch(new Api.CreatingMat017Items.Failed(response as HttpErrorResponse));
          return;
        }

        dispatch([new Api.CreatingMat017Items.Succeeded({ response, which, mat017ItemsToCreate })]);
      })
    );
  }

  private mapToCreateManualItemRequest(items: Mat017ItemCreationData[]) {
    return items
      .filter((item) => !this.modelHasNoValues(item))
      .map((item): CreateMat017ItemManuallyRequestDto => {
        const {
          matNumber,
          mat017ItemGroup,
          itemDescription1,
          itemDescription2,
          supplierItemNumber,
          amount,
          priceUnit,
        } = item;

        return {
          matNumber,
          mat017ItemGroup,
          itemDescription1,
          itemDescription2,
          supplierItemNumber,
          amount,
          priceUnit,
        };
      });
  }

  private modelHasNoValues(model: Mat017ItemCreationData): boolean {
    return Object.keys(model).every((key) => {
      const value = model[key as keyof Mat017ItemCreationData];

      if (typeof value === 'string') {
        return !value.trim() || !value.length;
      }
      if (typeof value === 'boolean') {
        return true;
      }
      return value == null;
    });
  }

  private updateMat017ItemsGroupsIfChanged(
    context: StateContext<ConnectorStateModel>,
    which: ConnectorSide
  ): Observable<UpdateMat017ItemsOverridesInConfigurationsResponseDto> {
    const { getState, dispatch } = context;
    const state = getState();
    const selectedScc = this.store.selectSnapshot(ProcessStateSelectors.selectedSingleCableCalculation());
    const { calculationId, configurationId } = selectedScc || {};

    const mat017ItemList = state[which].mat017ItemListWithWidenData;
    const updateIsRequired = this.getIsItemGroupUpdateRequired(mat017ItemList);

    if (!updateIsRequired) {
      return;
    }

    const payload: UpdateMat017OverridesRequestDto = {
      calculationId,
      configurationIds: [configurationId],
      updateProperties: [Mat017ItemOverridesEnum.mat017ItemGroup],
    };

    return this.calculationApiService.updateMat017ItemOverrides(payload).pipe(
      tap((response: UpdateMat017ItemsOverridesInConfigurationsResponseDto) => {
        if (response === null) {
          return;
        }
        this.updateOverridesInState(context, response, which);

        dispatch(new Api.UpdatingConnectorOverrides.Succeeded(response));
      })
    );
  }

  private cacheBustImageUrl(picUrl: string): undefined | string {
    return picUrl && picUrl.length > 0 ? `${picUrl}&cb=${new Date().getTime()}` : '';
  }

  private updateItemListElement(
    update: Partial<Mat017ItemWithWidenData>,
    matNumber: string,
    context: StateContext<ConnectorStateModel>
  ): void {
    const state = context.getState();

    const connectorObject = {
      leftConnector: {
        ...state.leftConnector,
        mat017ItemListWithWidenData: state.leftConnector.mat017ItemListWithWidenData.map((item) => {
          if (item.matNumber === matNumber) {
            return { ...item, ...update };
          }
          return { ...item };
        }),
      },
      rightConnector: {
        ...state.rightConnector,
        mat017ItemListWithWidenData: state.rightConnector.mat017ItemListWithWidenData.map((item) => {
          if (item.matNumber === matNumber) {
            return { ...item, ...update };
          }
          return { ...item };
        }),
      },
    };

    context.patchState(connectorObject);
  }

  private updateOverridesInState(
    context: StateContext<ConnectorStateModel>,
    response: UpdateMat017ItemsOverridesInConfigurationsResponseDto,
    which: ConnectorSide
  ): void {
    const updatedMat017Items = response?.[0]?.connectorState[which]?.mat017ItemListWithWidenData || [];

    context.setState(
      patch({
        [which]: patch({
          mat017ItemListWithWidenData: updatedMat017Items,
        }),
      })
    );
  }

  private getIsItemGroupUpdateRequired(items: Mat017ItemWithWidenData[]) {
    return items.some(
      (item) => item.itemStatus === Mat017ItemStatus.active && item.mat017ItemGroup !== item.overrides.mat017ItemGroup
    );
  }

  private updateBomItemStatusOnManuallyCreatedItemRemoval(
    state: ConnectorStateModel,
    removedItemMatNumber: string
  ): { [key: string]: Mat017ItemWithWidenData[] } {
    return ['leftConnector', 'rightConnector'].reduce(
      (acc, curr) => {
        const updatedConnectorSide =
          state[curr]?.mat017ItemListWithWidenData?.map((item: Mat017ItemWithWidenData) => {
            return item.matNumber === removedItemMatNumber ? { ...item, itemStatus: Mat017ItemStatus.removed } : item;
          }) || [];

        acc[curr as ConnectorSide] = updatedConnectorSide;
        return acc;
      },
      {} as { [key in ConnectorSide]: Mat017ItemWithWidenData[] }
    );
  }
}
