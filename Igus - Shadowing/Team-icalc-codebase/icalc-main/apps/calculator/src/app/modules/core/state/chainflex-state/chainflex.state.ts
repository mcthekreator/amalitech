import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { mergeMap, tap } from 'rxjs';
import {
  CableStructureInformation,
  ChainflexCable,
  IcalcListInformation,
  SingleCableCalculationPriceUpdateReference,
} from '@igus/icalc-domain';
import type { LocalizedStrings } from '@igus/icalc-domain';
import { createGetDefaultStateItemValue } from '../../utils';
import { ChainflexStateModel } from './chainflex-state.model';
import { Chainflex } from '../actions/chainflex';
import { ChainflexApiService } from '../../data-access/chainflex-api.service';
import { Api } from '../actions/api';
import { SetDefaultListInformation } from './chainflex-state.actions';
import { SingleCableCalculationApiService } from '../../data-access/single-cable-calculation-api.service';
import { ProcessStateFacadeService } from '../process-state/process-state-facade.service';

const chainFlexStateDefaults: ChainflexStateModel = {
  error: null,
  isLoading: false,
  chainflexPricesHaveChanged: false,
  chainflexesAndPricesAvailable: true,
  priceUpdateReference: null,
  items: null,
  totalCount: -1,
  chainflexCable: null,
  noItemsFound: false,
  listInformation: {
    orderDirection: 'asc',
    search: '',
    skip: 0,
    take: 100,
    orderBy: 'partNumber',
  },
};

export const getDefaultFromChainFlexState = createGetDefaultStateItemValue(chainFlexStateDefaults);

@State<ChainflexStateModel>({
  name: 'ChainflexState',
  defaults: { ...chainFlexStateDefaults },
})
@Injectable()
export class ChainflexState {
  constructor(
    private store: Store,
    private readonly chainflexApiService: ChainflexApiService,
    private readonly singleCableCalculationApiService: SingleCableCalculationApiService,
    private readonly processStateFacadeService: ProcessStateFacadeService
  ) {}

  @Selector()
  public static chainflexError(state: ChainflexStateModel): string {
    return state.error;
  }

  @Selector()
  public static noItemsFound(state: ChainflexStateModel): boolean {
    return state.noItemsFound;
  }

  @Selector()
  public static chainflexIsLoading(state: ChainflexStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  public static chainflexItems(state: ChainflexStateModel): ChainflexCable[] {
    return state.items;
  }

  @Selector()
  public static chainflexCable(state: ChainflexStateModel): ChainflexCable {
    return state.chainflexCable;
  }

  @Selector()
  public static chainflexPartNumber(state: ChainflexStateModel): string {
    return state.chainflexCable.partNumber;
  }

  @Selector()
  public static chainflexCableStructure(state: ChainflexStateModel): LocalizedStrings {
    return state.chainflexCable.cableStructure;
  }

  @Selector()
  public static chainflexCableStructureInformation(state: ChainflexStateModel): CableStructureInformation {
    return state.chainflexCable.cableStructureInformation;
  }

  @Selector()
  public static listInformation(state: ChainflexStateModel): IcalcListInformation {
    return state.listInformation;
  }

  @Selector()
  public static totalCount(state: ChainflexStateModel): number {
    return state.totalCount;
  }

  @Selector()
  public static chainflexPrice(state: ChainflexStateModel): number {
    return state.chainflexCable.price.germanListPrice;
  }

  @Selector()
  public static chainflexPricesHaveChanged(state: ChainflexStateModel): boolean {
    return state.chainflexPricesHaveChanged;
  }

  @Selector()
  public static chainflexesAndPricesAvailable(state: ChainflexStateModel): boolean {
    return state.chainflexesAndPricesAvailable;
  }

  @Selector()
  public static priceUpdateReference(state: ChainflexStateModel): SingleCableCalculationPriceUpdateReference {
    return state.priceUpdateReference;
  }

  @Action(Chainflex.SearchingChainflex.Started, { cancelUncompleted: true })
  public searchChainflex(context: StateContext<ChainflexStateModel>, action: Chainflex.SearchingChainflex.Started) {
    const { payload } = action;
    let state = context.getState();

    context.patchState({
      isLoading: true,
      listInformation: { ...state.listInformation, ...payload.listInformation },
      items: [],
    });

    state = context.getState();

    return this.chainflexApiService
      .search(state.listInformation)
      .pipe(mergeMap((result) => context.dispatch(new Api.SearchingChainflex.Succeeded(result))));
  }

  @Action(Api.SearchingChainflex.Succeeded)
  public setChainflexItems(context: StateContext<ChainflexStateModel>, action: Api.SearchingChainflex.Succeeded) {
    const { payload } = action;

    context.patchState({
      isLoading: false,
      items: payload.data,
      noItemsFound: payload.data?.length === 0,
      totalCount: payload.totalCount,
    });
  }

  @Action(Chainflex.EnteringChainflexPage.Entered)
  public setChainflexCable(
    context: StateContext<ChainflexStateModel>,
    action: Chainflex.EnteringChainflexPage.Entered
  ) {
    let chainflexCable = action?.payload;

    if (!chainflexCable) {
      chainflexCable = getDefaultFromChainFlexState('chainflexCable');
    }
    context.patchState({
      chainflexCable: chainflexCable === null ? getDefaultFromChainFlexState('chainflexCable') : { ...chainflexCable },
    });
  }

  @Action(Chainflex.EnteringChainflexPage.Entered)
  public checkChainflexAndPriceExistence(
    context: StateContext<ChainflexStateModel>,
    action: Chainflex.EnteringChainflexPage.Entered
  ) {
    const chainflexCable = action?.payload;

    const isLocked = this.processStateFacadeService.isLocked();

    if (!chainflexCable || isLocked) {
      return;
    }

    const selectedSingleCableCalculationId: string =
      this.processStateFacadeService.currentSelectedSingleCableCalculationId();

    const payload = {
      singleCableCalculationIds: [selectedSingleCableCalculationId],
    };

    return this.singleCableCalculationApiService.checkChainflexAndPriceExistence(payload).pipe(
      tap((result) => {
        if (result === null) {
          return;
        }
        context.patchState({
          chainflexPricesHaveChanged: result.chainflexPricesHaveChanged,
          chainflexesAndPricesAvailable: result.chainflexesAndPricesAvailable,
          priceUpdateReference: result.singleCableCalculationPriceUpdateReferences[0],
        });
      })
    );
  }

  @Action(Chainflex.ChoosingChainflexCable.Chosen)
  public setNewChainflexCable(
    context: StateContext<ChainflexStateModel>,
    action: Chainflex.ChoosingChainflexCable.Chosen
  ) {
    const { chainflexCable } = action.payload;

    context.patchState({
      chainflexCable: chainflexCable ? { ...chainflexCable } : getDefaultFromChainFlexState('chainflexCable'),
    });
  }

  @Action(Chainflex.ResettingChainflexCable.Reset)
  public resetChainflexCable(context: StateContext<ChainflexStateModel>) {
    context.patchState({
      chainflexCable: getDefaultFromChainFlexState('chainflexCable'),
    });
  }

  @Action(SetDefaultListInformation)
  public setDefaultListInformation(context: StateContext<ChainflexStateModel>): void {
    context.patchState({
      listInformation: getDefaultFromChainFlexState('listInformation'),
    });
  }

  @Action(Chainflex.LeavingChainflexPage.Started)
  public resetChainflexState(context: StateContext<ChainflexStateModel>): void {
    context.patchState({
      ...chainFlexStateDefaults,
    });
  }
}
