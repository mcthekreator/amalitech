import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { EMPTY, forkJoin, of, switchMap, take } from 'rxjs';
import { ProcessStateFacadeService } from '../../../core/state/process-state/process-state-facade.service';
import type { ConfigurationPresentation } from '@igus/icalc-domain';
import {
  CopyWithUpdatedOverridesResult,
  CopyConfigurationWithUpdatedOverridesDialogService,
} from './copy-configuration-with-updated-overrides-dialog';
import type { AssignConfigurationSearchDialogResult } from './assign-configuration-search-dialog';
import { CopyConfigurationToExistingCalculationDialogService } from './copy-configuration-to-existing-calculation-dialog';
import type { CopyConfigurationToExistingCalculationDialogResult } from './copy-configuration-to-existing-calculation-dialog';
import { AssignConfigurationSearchDialogService } from './assign-configuration-search-dialog';
import { AssignExistingConfigurationOrCopyDialogService } from './assign-existing-configuration-or-copy-dialog';
import type { AssignConfigurationDialogResult } from './assign-configuration-dialog';
import { AssignConfigurationDialogService } from './assign-configuration-dialog';
import type { AssignExistingConfigurationOrCopyDialogResult } from './assign-existing-configuration-or-copy-dialog';
import { CalculationApiService } from '../../../core/data-access/calculation-api.service';

@Injectable({
  providedIn: 'root',
})
export class CopyOrAssignConfigurationDialogWorkflowService {
  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private copyWithUpdatedOverridesModalService: CopyConfigurationWithUpdatedOverridesDialogService,
    private copyConfigurationToExistingCalculationDialogService: CopyConfigurationToExistingCalculationDialogService,
    private assignConfigurationSearchDialogService: AssignConfigurationSearchDialogService,
    private assignExistingConfigurationOrCopyDialogService: AssignExistingConfigurationOrCopyDialogService,
    private assignConfigurationDialogService: AssignConfigurationDialogService,
    private calculationApiService: CalculationApiService
  ) {}

  public start(): void {
    this.processStateFacadeService.selectedConfigurationData$
      .pipe(
        take(1),
        switchMap((configurationData) => this.searchForConfigurationToCopy(configurationData)),
        switchMap((result) => this.chooseToAssignOrCopyConfiguration(result)),
        switchMap((result) => this.chooseToCopyWithOutdatedOrNewMat017ItemsPrices(result)),
        switchMap((result) => this.provideConfigurationData(result))
      )
      .subscribe();
  }

  private searchForConfigurationToCopy(
    configurationData: ConfigurationPresentation
  ): Observable<AssignConfigurationSearchDialogResult> {
    return this.assignConfigurationSearchDialogService.open({
      id: configurationData.id,
      matNumber: configurationData.matNumber,
      labelingLeft: configurationData.labelingLeft,
      labelingRight: configurationData.labelingRight,
      description: configurationData.description,
    });
  }

  private chooseToAssignOrCopyConfiguration(
    searchDialogResult: AssignConfigurationSearchDialogResult
  ): Observable<[AssignConfigurationSearchDialogResult, AssignExistingConfigurationOrCopyDialogResult]> {
    if (searchDialogResult.isCanceled) {
      return EMPTY;
    }
    if (searchDialogResult.isConfirmed) {
      const { matNumber } = searchDialogResult.data;

      return forkJoin([of(searchDialogResult), this.assignExistingConfigurationOrCopyDialogService.open(matNumber)]);
    }
  }

  private chooseToCopyWithOutdatedOrNewMat017ItemsPrices([searchConfigurationResult, assignOrCopyResult]: [
    AssignConfigurationSearchDialogResult,
    AssignExistingConfigurationOrCopyDialogResult,
  ]):
    | Observable<
        [
          AssignConfigurationSearchDialogResult,
          AssignExistingConfigurationOrCopyDialogResult,
          CopyWithUpdatedOverridesResult,
        ]
      >
    | Observable<never> {
    if (assignOrCopyResult.isCanceled) {
      return EMPTY;
    }

    const resultWithNoPriceUpdate$ = forkJoin([
      of(searchConfigurationResult),
      of(assignOrCopyResult),
      of(CopyWithUpdatedOverridesResult.create()),
    ]);

    if (assignOrCopyResult.isConfirmedAssign) {
      return resultWithNoPriceUpdate$;
    }

    return this.calculationApiService
      .haveMat017ItemsOverridesChanged({
        configurationIds: [searchConfigurationResult.data.id],
      })
      .pipe(
        switchMap((response) => {
          if (response.hasAmountDividedByPriceUnitChanged) {
            const openPayload = this.copyWithUpdatedOverridesModalService.mapToMat017ItemsWithOutdatedPrices(
              response.configurations.flatMap((config) => config.mat017ItemsChanges)
            );

            return forkJoin([
              of(searchConfigurationResult),
              of(assignOrCopyResult),
              this.copyWithUpdatedOverridesModalService.open(openPayload),
            ]);
          }

          return resultWithNoPriceUpdate$;
        })
      );
  }

  private provideConfigurationData([searchConfigurationResult, assignOrCopyResult, copyWithOverridesResult]: [
    AssignConfigurationSearchDialogResult,
    AssignExistingConfigurationOrCopyDialogResult,
    CopyWithUpdatedOverridesResult,
  ]):
    | Observable<AssignConfigurationDialogResult | CopyConfigurationToExistingCalculationDialogResult>
    | Observable<never> {
    const { data } = searchConfigurationResult || {};

    if (copyWithOverridesResult.isCanceled) {
      return EMPTY;
    }

    const { shouldUpdatePrices } = copyWithOverridesResult;

    if (assignOrCopyResult.isConfirmedCopy) {
      return this.copyConfigurationToExistingCalculationDialogService.open({
        updatePrices: shouldUpdatePrices,
        selectedConfiguration: data,
      });
    }
    if (assignOrCopyResult.isConfirmedAssign) {
      return this.assignConfigurationDialogService.open(data);
    }
  }
}
