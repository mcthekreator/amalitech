import { Injectable } from '@angular/core';
import type {
  CalculationSearchResult,
  ConfigurationSearchResult,
  IcalcCalculationOperands,
  IcalcHTTPError,
  IcalcListInformation,
  IcalcMetaData,
} from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';

import { CalculationSearch } from '../actions/calculation-search';
import { ConfigurationSearch } from '../actions/configuration-search';
import { SearchState } from './search-state';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchStateFacadeService {
  @Select(SearchState.selectCalculationItems)
  public calculationItems$: Observable<CalculationSearchResult[]>;

  @Select(SearchState.selectConfigurationItems)
  public configurationItems$: Observable<ConfigurationSearchResult[]>;

  @Select(SearchState.configurationListInformation)
  public configurationListInformation$: Observable<IcalcListInformation>;

  @Select(SearchState.calculationListInformation)
  public calculationListInformation$: Observable<IcalcListInformation>;

  @Select(SearchState.configurationTotalCount)
  public configurationTotalCount$: Observable<number>;

  @Select(SearchState.calculationTotalCount)
  public calculationTotalCount$: Observable<number>;

  @Select(SearchState.isLoadingConfigurationItems)
  public isLoadingConfigurationItems$: Observable<boolean>;

  @Select(SearchState.isLoadingCalculationItems)
  public isLoadingCalculationItems$: Observable<boolean>;

  @Select(SearchState.calculationSearchError)
  public calculationSearchError$: Observable<IcalcHTTPError>;

  @Select(SearchState.configurationSearchError)
  public configurationSearchError$: Observable<IcalcHTTPError>;

  @Select(SearchState.noConfigurationItemsFound)
  public noConfigurationItemsFound$: Observable<boolean>;

  @Select(SearchState.noCalculationItemsFound)
  public noCalculationItemsFound$: Observable<boolean>;

  @Dispatch()
  public filteringCalculationsSubmitted = (payload: {
    calculationListFilter?: Partial<IcalcMetaData>;
    calculationListOperands?: IcalcCalculationOperands;
    listInformation?: Partial<IcalcListInformation>;
  }) => new CalculationSearch.FilteringCalculations.Submitted(payload);

  @Dispatch()
  public filteringConfigurationsSubmitted = (payload: {
    configurationListFilter?: Partial<IcalcMetaData>;
    configurationListOperands?: IcalcCalculationOperands;
    listInformation?: Partial<IcalcListInformation>;
  }) => new ConfigurationSearch.FilteringConfigurations.Submitted(payload);
}
