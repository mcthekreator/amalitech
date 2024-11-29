import { Injectable } from '@angular/core';
import type {
  CableStructureInformation,
  ChainflexCable,
  IcalcListInformation,
  LocalizedStrings,
  SingleCableCalculationPriceUpdateReference,
} from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { SetChainflexCable, SetDefaultListInformation } from './chainflex-state.actions';
import { ChainflexState } from './chainflex.state';
import { Chainflex } from '../actions/chainflex';

@Injectable({
  providedIn: 'root',
})
export class ChainflexStateFacadeService {
  @Select(ChainflexState.chainflexError)
  public chainflexError$: Observable<string>;

  @Select(ChainflexState.noItemsFound)
  public noItemsFound$: Observable<boolean>;

  @Select(ChainflexState.chainflexIsLoading)
  public chainflexIsLoading$: Observable<boolean>;

  @Select(ChainflexState.chainflexItems)
  public chainflexItems$: Observable<ChainflexCable[]>;

  @Select(ChainflexState.chainflexCable)
  public chainflexCable$: Observable<ChainflexCable>;

  @Select(ChainflexState.chainflexCableStructure)
  public chainflexCableStructure$: Observable<LocalizedStrings>;

  @Select(ChainflexState.totalCount)
  public totalCount$: Observable<number>;

  @Select(ChainflexState.chainflexPricesHaveChanged)
  public chainflexPricesHaveChanged$: Observable<boolean>;

  @Select(ChainflexState.chainflexesAndPricesAvailable)
  public chainflexesAndPricesAvailable$: Observable<boolean>;

  @Select(ChainflexState.priceUpdateReference)
  public priceUpdateReference$: Observable<SingleCableCalculationPriceUpdateReference>;

  @Select(ChainflexState.listInformation)
  public listInformation$: Observable<IcalcListInformation>;

  constructor(private store: Store) {}

  @Dispatch()
  public searchingChainflexStarted = (listInformation: Partial<IcalcListInformation>) =>
    new Chainflex.SearchingChainflex.Started({ listInformation });

  @Dispatch()
  public chainflexCableChosen = (chainflexCable: ChainflexCable) =>
    new Chainflex.ChoosingChainflexCable.Chosen({ chainflexCable });

  @Dispatch()
  public enteringChainflexPageStarted = () => new Chainflex.EnteringChainflexPage.Started();

  @Dispatch()
  public enteringChainflexPageEntered = (chainflexCable: ChainflexCable) =>
    new Chainflex.EnteringChainflexPage.Entered(chainflexCable);

  @Dispatch()
  public leavingChainflexPageStarted = (chainflexCableLength: number, chainflexCable: ChainflexCable) =>
    new Chainflex.LeavingChainflexPage.Started({ chainflexCableLength, chainflexCable });

  @Dispatch()
  public setChainflexCable = (chainflexCable: ChainflexCable): SetChainflexCable =>
    new SetChainflexCable(chainflexCable);

  @Dispatch()
  public setDefaultListInformation = (): SetDefaultListInformation => new SetDefaultListInformation();

  @Dispatch()
  public chainflexCableReset = () => new Chainflex.ResettingChainflexCable.Reset();

  public getChainflexPartNumber(): string {
    return this.store.selectSnapshot(ChainflexState.chainflexPartNumber);
  }

  public getChainflexCable(): ChainflexCable {
    return this.store.selectSnapshot(ChainflexState.chainflexCable);
  }

  public getChainflexPrice(): number {
    return this.store.selectSnapshot(ChainflexState.chainflexPrice);
  }

  public getChainflexCableStructure(): LocalizedStrings {
    return this.store.selectSnapshot(ChainflexState.chainflexCableStructure);
  }

  public getChainflexCableStructureInformation(): CableStructureInformation {
    return this.store.selectSnapshot(ChainflexState.chainflexCableStructureInformation);
  }
}
