import { Injectable } from '@angular/core';
import type {
  CalculationSearchResult,
  ConfigurationSearchResult,
  IcalcMetaData,
  IcalcMetaDataFilter,
} from '@igus/icalc-domain';
import { ObjectUtils, IcalcListInformation, IcalcHTTPError } from '@igus/icalc-domain';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { createGetDefaultStateItemValue } from '../../utils';

import { CalculationSearch } from '../actions/calculation-search';
import type { FilterCalculationsRequestParams } from './search-state-model';
import {
  defaultCalculationListInformation,
  defaultConfigurationListInformation,
  SearchStateModel,
} from './search-state-model';
import { CalculationApiService } from '../../data-access/calculation-api.service';
import { mergeMap } from 'rxjs';

import { Api } from '../actions/api';
import { ConfigurationSearch } from '../actions/configuration-search';
import { ConfigurationApiService } from '../../data-access/configuration-api.service';

const searchStateDefaults: SearchStateModel = {
  configurationListInformation: { ...defaultConfigurationListInformation },
  configurationListFilter: {},
  configurationListOperands: null,
  configurationTotalCount: -1,
  configurationItems: [],
  isLoadingConfigurationItems: false,
  noConfigurationItemsFound: false,
  configurationSearchError: null,

  calculationListInformation: { ...defaultCalculationListInformation },
  calculationListOperands: {},
  calculationListFilter: {},
  calculationTotalCount: -1,
  calculationItems: [],
  isLoadingCalculationItems: false,
  isLoadingCalculationItem: false,
  noCalculationItemsFound: false,
  calculationSearchError: null,
};

export const getDefaultFromSearchState = createGetDefaultStateItemValue(searchStateDefaults);

@State<SearchStateModel>({
  name: 'SearchState',
  defaults: { ...searchStateDefaults },
})
@Injectable()
export class SearchState {
  constructor(
    private calculationApiService: CalculationApiService,
    private configurationApiService: ConfigurationApiService
  ) {}

  @Selector()
  public static selectCalculationItems(state: SearchStateModel): CalculationSearchResult[] {
    return state.calculationItems;
  }

  @Selector()
  public static selectConfigurationItems(state: SearchStateModel): ConfigurationSearchResult[] {
    return state.configurationItems;
  }

  @Selector()
  public static configurationListInformation(state: SearchStateModel): IcalcListInformation {
    return state.configurationListInformation;
  }

  @Selector()
  public static calculationListInformation(state: SearchStateModel): IcalcListInformation {
    return state.calculationListInformation;
  }

  @Selector()
  public static configurationTotalCount(state: SearchStateModel): number {
    return state.configurationTotalCount;
  }

  @Selector()
  public static calculationTotalCount(state: SearchStateModel): number {
    return state.calculationTotalCount;
  }

  @Selector()
  public static isLoadingConfigurationItems(state: SearchStateModel): boolean {
    return state.isLoadingConfigurationItems;
  }

  @Selector()
  public static isLoadingCalculationItems(state: SearchStateModel): boolean {
    return state.isLoadingCalculationItems;
  }

  @Selector()
  public static calculationSearchError(state: SearchStateModel): IcalcHTTPError {
    return state.calculationSearchError;
  }

  @Selector()
  public static configurationSearchError(state: SearchStateModel): IcalcHTTPError {
    return state.configurationSearchError;
  }

  @Selector()
  public static noConfigurationItemsFound(state: SearchStateModel): boolean {
    return state.noConfigurationItemsFound;
  }

  @Selector()
  public static noCalculationItemsFound(state: SearchStateModel): boolean {
    return state.noCalculationItemsFound;
  }

  @Action(CalculationSearch.FilteringCalculations.Submitted, { cancelUncompleted: true })
  public searchCalculations(
    context: StateContext<SearchStateModel>,
    action: CalculationSearch.FilteringCalculations.Submitted
  ) {
    const { dispatch, getState, patchState } = context;

    const state = getState();

    let { listInformation, calculationListOperands, calculationListFilter } = action.payload;

    if (!listInformation) {
      listInformation = getDefaultFromSearchState('calculationListInformation');
    }

    if (!calculationListOperands) {
      calculationListOperands = getDefaultFromSearchState('calculationListOperands');
    }

    if (!calculationListFilter) {
      calculationListFilter = ObjectUtils.cloneDeep<Partial<IcalcMetaDataFilter>>(state.calculationListFilter);
    }

    const calculationListInformation = { ...state.calculationListInformation, ...listInformation };

    const filterParams: FilterCalculationsRequestParams = {
      calculationListInformation,
      calculationListOperands,
      calculationListFilter,
    };

    patchState({ isLoadingCalculationItems: true, calculationTotalCount: -1, ...filterParams });

    return this.calculationApiService.filterCalculations(filterParams).pipe(
      mergeMap((response) => {
        if (response === null) {
          return dispatch(new Api.FilteringCalculations.Failed(response));
        }

        return dispatch(new Api.FilteringCalculations.Succeeded(response));
      })
    );
  }

  @Action(Api.FilteringCalculations.Succeeded, { cancelUncompleted: false })
  public setFilterCalculationsResults(
    context: StateContext<SearchStateModel>,
    action: Api.FilteringCalculations.Succeeded
  ) {
    const { payload } = action;

    context.patchState({
      calculationItems: payload.data,
      isLoadingCalculationItems: false,
      calculationTotalCount: payload.totalCount,
      noCalculationItemsFound: payload.totalCount === 0,
    });
  }

  @Action(Api.FilteringCalculations.Failed, { cancelUncompleted: true })
  public setFilterCalculationsError(context: StateContext<SearchStateModel>) {
    context.patchState({
      isLoadingCalculationItems: true,
      calculationItems: getDefaultFromSearchState('calculationItems'),
      calculationTotalCount: getDefaultFromSearchState('calculationTotalCount'),
    });
  }

  @Action(ConfigurationSearch.FilteringConfigurations.Submitted, { cancelUncompleted: true })
  public searchConfigurations(
    context: StateContext<SearchStateModel>,
    action: ConfigurationSearch.FilteringConfigurations.Submitted
  ) {
    const { dispatch, getState, patchState } = context;

    const state = getState();

    const mergedDefaultsWithPayload = {
      listInformation: getDefaultFromSearchState('configurationListInformation'),
      configurationListOperands: getDefaultFromSearchState('configurationListOperands'),
      configurationListFilter: ObjectUtils.cloneDeep<Partial<IcalcMetaData>>(state.configurationListFilter),
      ...action.payload,
    };

    const { listInformation, configurationListOperands, configurationListFilter } = mergedDefaultsWithPayload;

    const filterParams = {
      configurationListInformation: action.payload.listInformation
        ? { ...state.configurationListInformation, ...listInformation }
        : getDefaultFromSearchState('configurationListInformation'),
      configurationListOperands,
      configurationListFilter,
    };

    patchState({
      isLoadingConfigurationItems: true,
      configurationTotalCount: -1,
      ...filterParams,
    });

    return this.configurationApiService.filterConfigurations(filterParams).pipe(
      mergeMap((response) => {
        if (response === null) {
          return dispatch(new Api.FilteringConfigurations.Failed(response));
        }

        return dispatch(new Api.FilteringConfigurations.Succeeded(response));
      })
    );
  }

  @Action(Api.FilteringConfigurations.Succeeded, { cancelUncompleted: false })
  public setFilterConfigurationsResults(
    context: StateContext<SearchStateModel>,
    action: Api.FilteringConfigurations.Succeeded
  ) {
    const { payload } = action;

    context.patchState({
      configurationItems: [...payload.data],
      isLoadingConfigurationItems: false,
      configurationTotalCount: payload.totalCount,
      noConfigurationItemsFound: payload.totalCount === 0,
    });
  }

  @Action(Api.FilteringCalculations.Failed, { cancelUncompleted: true })
  public setFilterConfigurationsError(context: StateContext<SearchStateModel>) {
    context.patchState({
      isLoadingConfigurationItems: true,
      configurationItems: getDefaultFromSearchState('configurationItems'),
      calculationTotalCount: getDefaultFromSearchState('calculationTotalCount'),
    });
  }
}
