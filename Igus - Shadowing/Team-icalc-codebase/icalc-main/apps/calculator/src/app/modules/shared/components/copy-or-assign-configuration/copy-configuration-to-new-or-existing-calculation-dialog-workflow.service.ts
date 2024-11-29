import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { EMPTY, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ProcessStateFacadeService } from '../../../core/state/process-state/process-state-facade.service';
import type { CopyConfigurationOptionsDialogResult } from './copy-configuration-options-dialog';
import {
  CalculationPresentation,
  ConfigurationPresentation,
  getUniqueMat017ItemsWithOutdatedPricesFromOneConfiguration,
  type Mat017ItemWithWidenData,
  type SingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import {
  CopyWithUpdatedOverridesResult,
  CopyConfigurationWithUpdatedOverridesDialogService,
} from './copy-configuration-with-updated-overrides-dialog';
import { CopyConfigurationOptionsDialogService } from './copy-configuration-options-dialog';
import { CopyConfigurationToExistingCalculationDialogService } from './copy-configuration-to-existing-calculation-dialog';
import type { CopyConfigurationToExistingCalculationDialogResult } from './copy-configuration-to-existing-calculation-dialog';
import type { CopyConfigurationToNewCalculationDialogResult } from './copy-configuration-to-new-calculation-dialog';
import { CopyConfigurationToNewCalculationDialogService } from './copy-configuration-to-new-calculation-dialog';
import {
  SelectedCalculationRow,
  SelectedConfigurationRow,
} from '../../../core/state/process-state/process-state.model';

@Injectable({
  providedIn: 'root',
})
export class CopyConfigurationToNewOrExistingCalculationDialogWorkflowService {
  public isLocked = false;
  public selectedConfiguration: Partial<ConfigurationPresentation>;
  public selectedCalculation: Partial<CalculationPresentation>;

  public mat017ItemsWithOutdatedPrices: Mat017ItemWithWidenData[];
  public hasMat017ItemsWithUpdatedPrices: boolean;

  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private copyConfigurationOptionsDialogService: CopyConfigurationOptionsDialogService,
    private copyWithUpdatedOverridesModalService: CopyConfigurationWithUpdatedOverridesDialogService,
    private copyToExistingCalculationDialogService: CopyConfigurationToExistingCalculationDialogService,
    private copyConfigurationToNewCalculationDialogService: CopyConfigurationToNewCalculationDialogService
  ) {}

  public start(): void {
    this.processStateFacadeService.selectedSingleCableCalculation$
      .pipe(
        take(1),
        tap((scc) => this.setSelectedConfigurationData(scc)),
        switchMap(() => this.chooseToCopyToExistingOrNewCalculation()),
        switchMap((response) => this.chooseToCopyWithOutdatedOrNewMat017ItemsPrices(response)),
        switchMap((response) => this.provideConfigurationData(response))
      )
      .subscribe();
  }

  private chooseToCopyToExistingOrNewCalculation(): Observable<CopyConfigurationOptionsDialogResult> {
    return this.copyConfigurationOptionsDialogService.open();
  }

  private chooseToCopyWithOutdatedOrNewMat017ItemsPrices(
    copyConfigurationOptionsDialogResult: CopyConfigurationOptionsDialogResult
  ): Observable<[CopyConfigurationOptionsDialogResult, CopyWithUpdatedOverridesResult]> | Observable<never> {
    if (!copyConfigurationOptionsDialogResult) {
      return EMPTY;
    }

    if (this.hasMat017ItemsWithUpdatedPrices && !this.isLocked) {
      const openPayload = this.copyWithUpdatedOverridesModalService.mapToMat017ItemsWithOutdatedPrices(
        this.mat017ItemsWithOutdatedPrices
      );

      return forkJoin([
        of(copyConfigurationOptionsDialogResult),
        this.copyWithUpdatedOverridesModalService.open(openPayload),
      ]);
    }

    return forkJoin([of(copyConfigurationOptionsDialogResult), of(CopyWithUpdatedOverridesResult.create())]);
  }

  private provideConfigurationData([copyConfigurationOptionsDialogResult, overridesResponse]: [
    CopyConfigurationOptionsDialogResult,
    CopyWithUpdatedOverridesResult,
  ]):
    | Observable<CopyConfigurationToNewCalculationDialogResult | CopyConfigurationToExistingCalculationDialogResult>
    | Observable<never> {
    if (overridesResponse.isCanceled) {
      return EMPTY;
    }

    const { shouldUpdatePrices } = overridesResponse;

    if (copyConfigurationOptionsDialogResult.copyToExistingCalculation) {
      return this.copyToExistingCalculationDialogService.open({
        updatePrices: shouldUpdatePrices,
        selectedConfiguration: this.selectedConfiguration as SelectedConfigurationRow,
      });
    }
    if (copyConfigurationOptionsDialogResult.copyToNewCalculation) {
      return this.copyConfigurationToNewCalculationDialogService.open(
        shouldUpdatePrices,
        this.selectedCalculation as SelectedCalculationRow,
        this.selectedConfiguration as SelectedConfigurationRow
      );
    }
  }

  private setSelectedConfigurationData(scc: SingleCableCalculationPresentation): void {
    this.isLocked = scc.calculation.isLocked;

    if (this.isLocked) {
      this.selectedCalculation = scc.calculation;
      this.selectedConfiguration = scc.snapshot.configurationData;
      return;
    }
    this.selectedCalculation = scc.calculation;
    this.selectedConfiguration = scc.configuration;

    const mat017ItemsWithOutdatedPrices = getUniqueMat017ItemsWithOutdatedPricesFromOneConfiguration(scc.configuration);

    this.hasMat017ItemsWithUpdatedPrices = mat017ItemsWithOutdatedPrices.length > 0;

    if (this.hasMat017ItemsWithUpdatedPrices) {
      this.mat017ItemsWithOutdatedPrices = mat017ItemsWithOutdatedPrices;
    }
  }
}
