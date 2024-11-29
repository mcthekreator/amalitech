import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import type { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { IcalcStep } from '@icalc/frontend/app/modules/core/state/app-state/app-state.model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

import type {
  IcalcStepsState,
  SelectedProcessResult,
  WorkStepOverridesEntityRecord,
} from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';
import { handleDecimalDigitInput } from '@icalc/frontend/app/modules/shared/directives/decimal-digit-input.directive';
import type {
  ChainflexPriceDeviation,
  ChainflexPriceDeviationContainer,
  CustomerTypeEnum,
  FormlyFormSettings,
  IcalcHTTPError,
  ProcessResult,
  ProcessResultWorkStepItem,
  SelectedCalculation,
  SelectedConfiguration,
  SelectedSCCCalculationFactorAndConfigurationDescription,
  SingleCableCalculationPresentation,
  WorkStepType,
} from '@igus/icalc-domain';
import {
  ConfigurationActionButtonsAction,
  FileFormatEnum,
  isCommercialWorkStepType,
  RISK_FACTORS,
  WorkStepCategory,
  WorkStepSet,
  FileDownloadButtonsActionEnum,
  fileDownloadOptions,
} from '@igus/icalc-domain';
import { ArrayUtils, ObjectUtils, StringUtils } from '@igus/icalc-utils';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import type { Observable } from 'rxjs';
import { combineLatest, delay, EMPTY, filter, map, Subscription, switchMap, take, tap } from 'rxjs';

import { WorkStepInformationComponent } from './work-step-information.component';
import { Router } from '@angular/router';
import { RemoveLinkBetweenConfigurationAndCalculationDialogComponent } from '@icalc/frontend/app/modules/shared/components/remove-link-between-configuration-and-calculation-dialog/remove-link-between-configuration-and-calculation-dialog.component';
import type { MatSelectChange } from '@angular/material/select';
import {
  ConfigurationActionButtonsFormGeneratorService,
  MatPlanDownloadButtonsFormGeneratorService,
} from '@icalc/frontend/app/modules/shared/form-generators';
import { FilterWorkStepsByCategory } from '@icalc/frontend/modules/features/results/pipes/filter-work-steps-by-type.pipe';
import { ConfirmTechnicalWorkStepOverridesResetDialogComponent } from '@icalc/frontend/app/modules/shared/components/confirm-technical-work-step-overrides-reset-dialog/confirm-technical-work-step-overrides-reset-dialog.component';
import { CopyOrAssignConfigurationDialogWorkflowService } from '@icalc/frontend/app/modules/shared/components/copy-or-assign-configuration';
import { Mat017ItemRemovalDialogService } from '../mat017Item-removal-dialog/mat017-item-removal-dialog.service';

type CombinedProcessState = [
  IcalcStepsState,
  SingleCableCalculationPresentation,
  SingleCableCalculationPresentation[],
  SelectedProcessResult,
];

interface CalculationFormModel {
  calculationFactor?: number;
  customerType?: CustomerTypeEnum;
  mat017ItemAndWorkStepRiskFactor?: number;
  mat017ItemRiskFactor?: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  // CF price deviation
  @ViewChild('updateChainflexPricesDialog', { static: true })
  public updateChainflexPricesDialog: TemplateRef<unknown>;

  @ViewChild('removeChainflexCablesDialog', { static: true })
  public removeChainflexCablesDialog: TemplateRef<unknown>;

  @ViewChild('downloadExcelDialog', { static: true })
  private downloadExcelDialog: TemplateRef<unknown>;

  public readonly workStepCategory = WorkStepCategory;
  public readonly workStepSet = WorkStepSet;

  public calculationForm: FormlyFormSettings<CalculationFormModel> = {
    form: new FormGroup({}),
    model: null,
    options: {},
    fields: [],
  };

  public sccForm: FormlyFormSettings<SelectedSCCCalculationFactorAndConfigurationDescription> = {
    form: new FormGroup({}),
    model: null,
    options: {},
    fields: [],
  };

  public defaultMat017ItemRiskFactor: number = RISK_FACTORS.defaultMat017ItemRiskFactor;
  public defaultMat017ItemAndWorkStepRiskFactor: number = RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor;

  // CF price deviation
  public chainflexRemovalByMatNumberForm: FormGroup = new FormGroup({});
  public enableRemovalButton = false;

  // Mat017Item removal
  public showListOfInvalidOrRemovedMat017ItemInfo$: Observable<boolean>;
  public hasInvalidOrRemovedItems$: Observable<boolean>;

  public chainflexesAndPricesAvailable$: Observable<boolean>;
  public chainflexPricesHaveChanged$: Observable<boolean>;
  public chainflexListWithNewPrices$: Observable<ChainflexPriceDeviation[]>;
  public chainflexListWithNoPrices$: Observable<ChainflexPriceDeviationContainer[]>;

  public workStepSetSelectForm: FormGroup = new FormGroup({
    workStepSet: new FormControl(this.workStepSet.standard),
  });

  public workStepsFormsBySccId: Record<string, FormGroup> = {};
  public currentlyEditedWorkStepsSccId: string = null;
  public previousStep$: Observable<IcalcStep>;
  public processResults: ProcessResult[] = [];
  public selectedProcessResult: SelectedProcessResult;
  public technicalWorkSteps: ProcessResultWorkStepItem[] = [];
  public commercialWorkSteps: ProcessResultWorkStepItem[] = [];
  public calculationTotalPrice$: Observable<number>;
  public allResultsValid$: Observable<boolean>;
  public processServerError$: Observable<IcalcHTTPError>;
  public editSectionName: 'commercial' | 'technical' | 'calculation' | 'scc' = null;
  public isCalculationReady = false;
  public isProcessing$: Observable<boolean>;
  public isLocked$: Observable<boolean>;
  public isLocked: boolean;
  public commercialWorkStepOverrides: WorkStepOverridesEntityRecord = {};
  public technicalWorkStepOverrides: WorkStepOverridesEntityRecord = {};
  public excelNotDownloadable$: Observable<boolean>;
  public isExcelFileDownloading$: Observable<boolean>;

  public showNewChainflexPricesInfo$: Observable<boolean>;
  public showChainflexListWithNoPricesInfo$: Observable<boolean>;

  // final results:
  public selectedCalculationItem = null as SelectedCalculation;
  // scc
  public selectedSingleCableCalculation: SingleCableCalculationPresentation;
  public relatedSingleCableCalculations: SingleCableCalculationPresentation[];
  public footerActionButtons: FormlyFormSettings<{ selectedAction: string }> =
    this.configurationActionButtonsFormGeneratorService.initializeForm();

  public matPlanDownloadOptionsButtons: FormlyFormSettings<{ selectedAction: string }> =
    this.matPlanDownloadButtonsFormGeneratorService.initializeForm();

  public matPlanDownloadOptions = {
    xlsOption: FileFormatEnum.xls,
    xlsxOption: FileFormatEnum.xlsx,
    showXlsxOption: false,
  };

  private selectedWorkStepSetChanges$: Observable<WorkStepSet> =
    this.workStepSetSelectForm.controls['workStepSet'].valueChanges;

  private lastSelectedWorkStepSet: WorkStepSet;
  private workStepsForm: FormGroup;
  private processResultsByKey: Record<string, ProcessResult> = {};
  private workStepsStateClone: ProcessResultWorkStepItem[];
  private selectedConfigurationItem = null as SelectedConfiguration;
  private subscription = new Subscription();

  constructor(
    private confirmTechnicalWorkStepOverridesResetDialog: MatDialog,
    private processStateFacadeService: ProcessStateFacadeService,
    private appStateFacadeService: AppStateFacadeService,
    private matSnackBar: MatSnackBar,
    private translate: TranslateService,
    private excelDialog: MatDialog,
    private updateCFPricesDialog: MatDialog,
    private removeCFCablesDialog: MatDialog,
    private removeMatItemDialog: MatDialog,
    private assignmentDialog: MatDialog,
    public router: Router,
    private configurationActionButtonsFormGeneratorService: ConfigurationActionButtonsFormGeneratorService,
    private filterWorkStepsByCategoryPipe: FilterWorkStepsByCategory,
    private cdr: ChangeDetectorRef,
    private copyOrAssignConfigurationDialogWorkflowService: CopyOrAssignConfigurationDialogWorkflowService,
    public mat017ItemRemovalDialogService: Mat017ItemRemovalDialogService,
    public matPlanDownloadButtonsFormGeneratorService: MatPlanDownloadButtonsFormGeneratorService
  ) {
    this.processStateFacadeService.enteringResultsPageStarted();
  }

  public get currentWorkStepSet(): WorkStepSet {
    return this.workStepSetSelectForm.get('workStepSet').value;
  }

  public static areProcessResultsAndRelatedSingleCableCalculationsFullyLoaded([
    processState,
    _selectedSingleCableCalculation,
    relatedSingleCableCalculations,
    selectedProcessResult,
  ]: CombinedProcessState): boolean {
    return (
      ArrayUtils.isNotEmpty(processState.processResults) &&
      ArrayUtils.isNotEmpty(relatedSingleCableCalculations) &&
      processState.processResults.length === relatedSingleCableCalculations.length &&
      !!selectedProcessResult
    );
  }

  public static isSingleCableCalculationInProcessResults([
    processState,
    selectedSingleCableCalculation,
    _relatedSingleCableCalculations,
    _selectedProcessResult,
  ]: CombinedProcessState): boolean {
    return (
      !!selectedSingleCableCalculation &&
      processState.processResults
        .map((value) => value.configurationReference.sccId)
        .includes(selectedSingleCableCalculation.id)
    );
  }

  public static groupProcessResultsBySccId(results: ProcessResult[]): Record<string, ProcessResult> {
    return results.reduce((prev, curr) => {
      prev[curr.configurationReference.sccId] = curr;
      return prev;
    }, {});
  }

  public ngOnInit(): void {
    this.isProcessing$ = this.processStateFacadeService.isProcessing$();
    this.processServerError$ = this.processStateFacadeService.processServerError$();

    this.processStateFacadeService.enteringResultsPageEntered();
    this.previousStep$ = this.appStateFacadeService.previousStep$;
    this.calculationTotalPrice$ = this.processStateFacadeService.calculationTotalPrice$();
    this.allResultsValid$ = this.processStateFacadeService.allResultsValid$();
    this.chainflexPricesHaveChanged$ = this.processStateFacadeService.chainflexPricesHaveChanged$;
    this.chainflexesAndPricesAvailable$ = this.processStateFacadeService.chainflexesAndPricesAvailable$;
    this.chainflexListWithNewPrices$ = this.processStateFacadeService.chainflexListWithNewPrices$;
    this.hasInvalidOrRemovedItems$ = this.processStateFacadeService.hasInvalidOrRemovedItems$;
    this.isExcelFileDownloading$ = this.processStateFacadeService.isExcelFileDownloading$;
    this.chainflexListWithNoPrices$ = this.processStateFacadeService.chainflexListWithNoPrices$.pipe(
      tap((itemsWithNoNewPrices) => {
        itemsWithNoNewPrices.forEach((item) => {
          this.chainflexRemovalByMatNumberForm.setControl(item.configurationMatNumber, new FormControl(false));
        });
      })
    );

    this.subscription.add(
      this.selectedWorkStepSetChanges$.subscribe((newWorkStepSet) => {
        this.onChangeWorkStepSet(this.selectedProcessResult.configurationReference.sccId, newWorkStepSet);
      })
    );

    this.subscription.add(
      combineLatest([
        this.processStateFacadeService.processState$(),
        this.processStateFacadeService.selectedSingleCableCalculation$,
        this.processStateFacadeService.relatedSingleCableCalculationsOfCalculation$,
        this.processStateFacadeService.selectedProcessResult$,
      ])
        .pipe(
          filter((value) => ResultsComponent.areProcessResultsAndRelatedSingleCableCalculationsFullyLoaded(value)),
          filter((value) => ResultsComponent.isSingleCableCalculationInProcessResults(value))
        )
        .subscribe(
          ([processState, selectedSingleCableCalculation, relatedSingleCableCalculations, selectedProcessResult]) => {
            this.processResults = [...processState.processResults];
            this.processResultsByKey = ResultsComponent.groupProcessResultsBySccId(this.processResults);
            this.selectedSingleCableCalculation = selectedSingleCableCalculation;

            const { calculation, configuration, snapshot } = this.selectedSingleCableCalculation;

            this.selectedCalculationItem = calculation;
            this.selectedConfigurationItem = configuration || snapshot.configurationData;
            this.commercialWorkStepOverrides = this.selectedSingleCableCalculation.commercialWorkStepOverrides;
            this.technicalWorkStepOverrides = this.selectedConfigurationItem.state.workStepOverrides;
            this.lastSelectedWorkStepSet = this.selectedConfigurationItem.state.workStepSet;
            this.workStepSetSelectForm.patchValue({ workStepSet: this.lastSelectedWorkStepSet }, { emitEvent: false });

            this.selectedProcessResult = selectedProcessResult;
            this.relatedSingleCableCalculations = relatedSingleCableCalculations;

            this.technicalWorkSteps = this.filterWorkStepsByCategoryPipe.transform(
              this.selectedProcessResult?.workSteps,
              WorkStepCategory.technical
            );

            this.commercialWorkSteps = this.filterWorkStepsByCategoryPipe.transform(
              this.selectedProcessResult?.workSteps,
              WorkStepCategory.commercial
            );

            this.isCalculationReady = true;
            this.cdr.detectChanges();
          }
        )
    );

    this.subscription.add(
      this.processStateFacadeService
        .informUserAboutWorkSteps$()
        .pipe(
          filter((value) => ArrayUtils.isNotEmpty(value)),
          take(1),
          delay(500)
        )
        .subscribe((informUserAboutWorkSteps) => {
          const data = { informUserAboutWorkSteps };

          this.matSnackBar.openFromComponent(WorkStepInformationComponent, {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'icalc-snackbar-panel',
            data,
          });
        })
    );
    this.isLocked$ = this.processStateFacadeService.isLocked$;

    this.excelNotDownloadable$ = combineLatest([this.isLocked$, this.allResultsValid$]).pipe(
      map(([isLocked, allResultsValid]) => !isLocked && !allResultsValid)
    );

    this.generateFooterActionButtonsForm();

    this.subscription.add(
      this.isLocked$.pipe(filter((isLocked) => isLocked !== null)).subscribe((value) => {
        this.isLocked = value;

        if (this.isLocked) {
          this.workStepSetSelectForm.disable({ emitEvent: false });
        }
      })
    );

    this.subscription.add(
      this.chainflexRemovalByMatNumberForm.valueChanges.subscribe((value: Record<string, boolean>) => {
        this.enableRemovalButton = ArrayUtils.hasTruthyValues(Object.values(value));
      })
    );

    this.showNewChainflexPricesInfo$ = combineLatest([this.isLocked$, this.chainflexPricesHaveChanged$]).pipe(
      map(([isLocked, chainflexPricesHaveChanged]) => {
        return isLocked !== true && chainflexPricesHaveChanged;
      })
    );

    this.showChainflexListWithNoPricesInfo$ = combineLatest([this.isLocked$, this.chainflexesAndPricesAvailable$]).pipe(
      map(([isLocked, chainflexesAndPricesAvailable]) => {
        return isLocked !== true && chainflexesAndPricesAvailable === false;
      })
    );

    this.showListOfInvalidOrRemovedMat017ItemInfo$ = combineLatest([
      this.isLocked$,
      this.hasInvalidOrRemovedItems$,
    ]).pipe(
      map(([isLocked, mat017ItemPricesBeenRemoved]) => {
        return isLocked !== true && mat017ItemPricesBeenRemoved === true;
      })
    );

    this.showDialogsAfterEnteringResultsPage();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.processStateFacadeService.leavingResultsPageStarted();
  }

  public onStartNewCalculation(): void {
    this.processStateFacadeService.startingNewCalculationFromResultsSubmitted();
    this.router.navigate(['app', IcalcRoutes.metaData]);
  }

  public async onStartNewConfiguration(): Promise<void> {
    this.processStateFacadeService.startingNewConfigurationFromResultsStarted();
    this.router.navigate(['app', IcalcRoutes.metaData]);
  }

  public toggleXlsxOption(): void {
    this.matPlanDownloadOptions = {
      ...this.matPlanDownloadOptions,
      showXlsxOption: !this.matPlanDownloadOptions.showXlsxOption,
    };
  }

  public onExportCalculationExcel(): void {
    this.processStateFacadeService.exportExcelFile({
      calculation: true,
      selectedDownloadOption: fileDownloadOptions[FileDownloadButtonsActionEnum.fullXLSX],
    });
  }

  public exportProductionPlanExcel(option: FileDownloadButtonsActionEnum): void {
    this.matPlanDownloadOptions.showXlsxOption = false;
    const fileDownloadOption = fileDownloadOptions?.[option];

    if (!fileDownloadOption) return;

    this.processStateFacadeService.exportExcelFile({
      productionPlan: true,
      selectedDownloadOption: fileDownloadOption,
    });
  }

  public assignConfiguration(): void {
    this.copyOrAssignConfigurationDialogWorkflowService.start();
  }

  public onEditCalculation(): void {
    this.generateCalculationForm();
    this.editSectionName = 'calculation';
  }

  public onCancelCalculationDataEdit(): void {
    this.editSectionName = null;
  }

  public onSubmitMetaData(): void {
    this.processStateFacadeService.updatingCalculationDataSubmitted({
      calculationNumber: this.selectedCalculationItem.calculationNumber,
      ...this.calculationForm?.model,
    });
    this.editSectionName = null;
  }

  public onResetMat017ItemRiskFactor(): void {
    this.calculationForm.form.get('mat017ItemRiskFactor').setValue(RISK_FACTORS.defaultMat017ItemRiskFactor);
    this.processStateFacadeService.updatingCalculationDataSubmitted({
      calculationNumber: this.selectedCalculationItem.calculationNumber,
      ...this.calculationForm?.model,
    });
    this.editSectionName = null;
  }

  public onResetMat017ItemAndWorkStepRiskFactor(): void {
    this.calculationForm.form
      .get('mat017ItemAndWorkStepRiskFactor')
      .setValue(RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor);
    this.processStateFacadeService.updatingCalculationDataSubmitted({
      calculationNumber: this.selectedCalculationItem.calculationNumber,
      ...this.calculationForm?.model,
    });
    this.editSectionName = null;
  }

  public onEditSCC(): void {
    this.generateSCCForm();
    this.editSectionName = 'scc';
  }

  public onCancelSCCDataEdit(): void {
    this.editSectionName = null;
  }

  public onSubmitSCCData(): void {
    this.processStateFacadeService.updatingSingleCableCalculationAndConfigurationData({
      calculationFactor: this.sccForm.model.calculationFactor,
      description: this.sccForm.model.description,
    });

    this.editSectionName = null;
  }

  public onResetSCCCalculationFactor(): void {
    this.processStateFacadeService.updatingSingleCableCalculationAndConfigurationData({
      calculationFactor: null,
    });
    this.editSectionName = null;
  }

  public onEditWorkSteps(sccId: string, workStepCategory: WorkStepCategory = null): void {
    if (workStepCategory) {
      this.editSectionName = workStepCategory;
    }
    const workStepsById = this.processResultsByKey[sccId];

    this.workStepsStateClone = ObjectUtils.cloneDeep<ProcessResultWorkStepItem[]>(workStepsById?.workSteps);
    this.workStepsForm = new FormGroup({});
    this.workStepsFormsBySccId[sccId] = new FormGroup({});
    this.workStepsStateClone.forEach((step) => {
      this.workStepsForm.addControl(
        step.name,
        new FormControl(this.translate.currentLang === 'de' ? `${step.quantity}`.replace('.', ',') : step.quantity)
      );
    });

    this.workStepsStateClone.forEach((step) => {
      this.workStepsFormsBySccId[sccId].addControl(
        step.name,
        new FormControl(this.translate.currentLang === 'de' ? `${step.quantity}`.replace('.', ',') : step.quantity)
      );
    });

    this.currentlyEditedWorkStepsSccId = sccId;
  }

  public getFormGroupById(configurationId: string): FormGroup {
    return this.workStepsFormsBySccId[configurationId] || new FormGroup({});
  }

  public onCancelWorkStepsEdit(): void {
    this.editSectionName = null;
    this.currentlyEditedWorkStepsSccId = null;

    this.onSelectSCC(this.selectedSingleCableCalculation.id, false);
  }

  public submitWorkStepsForm(sccId: string): void {
    const configurationId = this.selectedSingleCableCalculation.configurationId;
    const overrides = ObjectUtils.cloneDeep(this.workStepsFormsBySccId[sccId]?.value);

    this.processStateFacadeService.submittingWorkStepsFormSubmitted({ configurationId, overrides, sccId });

    this.editSectionName = null;
    this.currentlyEditedWorkStepsSccId = null;
  }

  public onResetWorkStepQuantity(sccId: string, workStepName: WorkStepType): void {
    const currentForm = this.getFormGroupById(sccId);

    currentForm.markAsDirty();
    currentForm.patchValue({
      [workStepName]: this.processResultsByKey[sccId].quantitiesWithoutOverrides[workStepName],
    });
    const isCommercialWorkStep = isCommercialWorkStepType(workStepName);

    if (isCommercialWorkStep) {
      this.commercialWorkStepOverrides = ObjectUtils.omitKeys(this.commercialWorkStepOverrides, [workStepName]);
    } else {
      this.technicalWorkStepOverrides = ObjectUtils.omitKeys(this.technicalWorkStepOverrides, [workStepName]);
    }
  }

  public onChangeWorkStepSet(sccId: string, newWorkStepSet: WorkStepSet): void {
    const keysOfTechnicalWorkStepOverrides = Object.keys(this.technicalWorkStepOverrides ?? {});
    const hasTechnicalWorkStepOverrides = keysOfTechnicalWorkStepOverrides.length > 0;

    if (!hasTechnicalWorkStepOverrides) {
      this.processStateFacadeService.changingWorkStepsSetsStarted({
        workStepSet: newWorkStepSet,
      });

      return;
    }

    this.subscription.add(
      this.confirmTechnicalWorkStepOverridesResetDialog
        .open(ConfirmTechnicalWorkStepOverridesResetDialogComponent)
        .afterClosed()
        .subscribe((result) => {
          if (result?.reset) {
            this.processStateFacadeService.changingWorkStepsSetsStarted({
              workStepSet: newWorkStepSet,
            });
            this.resetWorkStepOverridesInFormById(sccId, keysOfTechnicalWorkStepOverrides);
          } else {
            this.workStepSetSelectForm.patchValue({ workStepSet: this.lastSelectedWorkStepSet }, { emitEvent: false });
          }
        })
    );
  }

  public onResetAllWorkStepQuantities(sccId: string, workStepCategory: WorkStepCategory): void {
    let keysOfTechnicalWorkStepOverrides: string[] = [];
    let keysOfCommercialWorkStepOverrides: string[] = [];

    switch (workStepCategory) {
      case WorkStepCategory.technical:
        keysOfTechnicalWorkStepOverrides = Object.keys(this.technicalWorkStepOverrides ?? {});
        this.technicalWorkStepOverrides = {};
        break;
      case WorkStepCategory.commercial:
        keysOfCommercialWorkStepOverrides = Object.keys(this.commercialWorkStepOverrides ?? {});
        this.commercialWorkStepOverrides = {};
        break;
      default:
        return;
    }

    this.resetWorkStepOverridesInFormById(sccId, [
      ...keysOfCommercialWorkStepOverrides,
      ...keysOfTechnicalWorkStepOverrides,
    ]);
  }

  public onAdjustConfigurationButtonClicked(sccId: string): void {
    this.onSelectSCC(sccId);
  }

  public scrollTo(itemId: string): void {
    document.querySelector(itemId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  public onSelectSCC(sccId: string, shouldScroll = true): void {
    // cancel edit mode in all editable sections
    if (this.workStepsForm) {
      this.workStepsForm.reset();
    }
    this.editSectionName = null;
    this.currentlyEditedWorkStepsSccId = null;

    this.processStateFacadeService.selectingSingleCableCalculationResultsStarted({ singleCableCalculationId: sccId });

    if (shouldScroll) {
      this.scrollTo('#calculation-wrapper');
    }

    this.isCalculationReady = false;
    this.cdr.detectChanges();
  }

  public onElementsListUpdate(): void {
    this.scrollTo(this.createNavigationItemId(this.selectedConfigurationItem.id));
  }

  public openDownloadExcelDialog(): void {
    this.generateMatPlanDownloadButtonsForm();
    this.excelDialog.open(this.downloadExcelDialog, {
      id: 'downloadExcelDialog',
      maxWidth: 910,
    });
  }

  public openUpdateChainflexPricesDialog(): void {
    this.updateCFPricesDialog.open(this.updateChainflexPricesDialog, {
      id: 'updateChainflexPricesDialog',
      minWidth: 800,
      maxWidth: 800,
    });
  }

  public openRemoveChainflexCablesDialog(): MatDialogRef<unknown> {
    return this.removeCFCablesDialog.open(this.removeChainflexCablesDialog, {
      id: 'removeChainflexCablesDialog',
      minWidth: 900,
      maxWidth: 900,
    });
  }

  public openRemoveLinkBetweenConfigurationAndCalculationDialog(): void {
    this.assignmentDialog.open(RemoveLinkBetweenConfigurationAndCalculationDialogComponent, {
      data: {
        reProcess: true,
      },
      id: 'removeLinkBetweenConfigurationAndCalculationDialog',
      minWidth: 745,
    });
  }

  public onUpdateChainflexPrices(): void {
    this.chainflexListWithNewPrices$
      .pipe(
        take(1),
        map((v) => v.map((cfPriceRef) => cfPriceRef.sccId))
      )
      .subscribe((sccIds) => this.processStateFacadeService.updatingChainflexPricesSubmitted(sccIds));
  }

  public onRemoveChainflexCables(): void {
    const formValue: Record<string, boolean> = this.chainflexRemovalByMatNumberForm.value;
    const selectedMatNumbers = Object.keys(formValue).filter((key) => formValue[key]);

    this.chainflexListWithNoPrices$
      .pipe(
        take(1),
        map(
          (itemsWithNoNewPrices) =>
            itemsWithNoNewPrices
              .filter((item) => selectedMatNumbers.includes(item.configurationMatNumber))
              .reduce((acc, item) => {
                const sccIds = item.chainflexPriceDeviations.map((deviation) => deviation.sccId);

                return acc.concat(sccIds);
              }, []) as string[]
        )
      )
      .subscribe((sccIdsToRemoveCFsFrom) =>
        this.processStateFacadeService.removingChainflexDataFromConfigurationsSubmitted(sccIdsToRemoveCFsFrom)
      );
  }

  private showDialogsAfterEnteringResultsPage(): void {
    this.subscription.add(
      this.processStateFacadeService
        .hasCheckedNewChainflexPricesAndMat017ItemsOverridesChangesSuccessfully$()
        .pipe(
          take(1),
          switchMap(() =>
            combineLatest([
              this.processStateFacadeService.shouldInformAboutMissingChainflexPrices$,
              this.processStateFacadeService.shouldInformAboutMissingMat017ItemPrices$,
            ])
          ),
          take(1),
          switchMap(([shouldInformAboutMissingChainflexPrices, shouldInformAboutMissingMat017ItemPrices]) => {
            if (shouldInformAboutMissingChainflexPrices && shouldInformAboutMissingMat017ItemPrices) {
              return this.openRemoveChainflexCablesDialog()
                .afterClosed()
                .pipe(switchMap(() => this.mat017ItemRemovalDialogService.open()));
            }

            if (shouldInformAboutMissingChainflexPrices) {
              return this.openRemoveChainflexCablesDialog().afterClosed();
            }

            if (shouldInformAboutMissingMat017ItemPrices) {
              return this.mat017ItemRemovalDialogService.open();
            }

            return EMPTY;
          }),
          take(1)
        )
        .subscribe()
    );
  }

  private resetWorkStepOverridesInFormById(sccId: string, listOfWorkSteps: string[]): void {
    const currentForm = this.getFormGroupById(sccId);

    currentForm.markAsDirty();
    const patch = {};

    listOfWorkSteps.forEach(
      (workStep) => (patch[workStep] = this.processResultsByKey[sccId].quantitiesWithoutOverrides[workStep])
    );
    currentForm.patchValue(patch);
  }

  private generateCalculationForm(): void {
    this.calculationForm.form = new FormGroup({});
    const { calculationFactor, mat017ItemAndWorkStepRiskFactor, mat017ItemRiskFactor, customerType } =
      this.selectedCalculationItem;

    this.calculationForm.model = ObjectUtils.cloneDeep<CalculationFormModel>({
      calculationFactor,
      mat017ItemAndWorkStepRiskFactor,
      mat017ItemRiskFactor,
      customerType,
    });

    this.calculationForm.fields = [
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-5',
        fieldGroup: [
          {
            key: 'customerType',
            type: 'select',
            props: {
              label: 'icalc.meta_data.CUSTOMER-TYPE',
              placeholder: 'icalc.meta_data.CUSTOMER-TYPE',
              required: true,
              translate: true,
              options: [
                { value: 'serialCustomer', label: 'icalc.meta_data.CUSTOMER-SERIAL-CUSTOMER' },
                { value: 'betriebsMittler', label: 'icalc.meta_data.CUSTOMER-BETRIEBSMITTLER' },
              ],
            },
          },
          {
            key: 'calculationFactor',
            type: 'input',
            hooks: {
              onInit: (field: FormlyFieldConfig): void => {
                if (field.formControl.value && this.translate.currentLang === 'de') {
                  field.formControl.patchValue(`${field.formControl.value}`.replace('.', ','));
                }
              },
            },
            props: {
              attributes: {
                dataCy: 'calculation-factor-input',
                pattern: '[0-9]+([.,][0-9]+)?',
              },
              label: 'icalc.meta_data.CALCULATION-FACTOR',
              placeholder: 'icalc.meta_data.CALCULATION-FACTOR',
              translate: true,
              required: true,
              appearance: 'outline',
              keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                handleDecimalDigitInput(event, this.translate.currentLang);
              },
            },
          },
          {
            type: 'action-button',
            className: 'center-icon-vertically margin-left-30',
            props: {
              tooltip: this.translate.instant('icalc.results.RISK_FACTOR_DEFAULT_DEVIATION-INFO'),
              icon: 'info',
            },
            expressions: {
              hide: () => this.selectedCalculationItem.mat017ItemRiskFactor === this.defaultMat017ItemRiskFactor,
            },
          },
          {
            type: 'action-button',
            className: 'center-icon-vertically',
            props: {
              tooltip: this.translate.instant('icalc.results.CLICK_TO_RESET'),
              icon: 'replay',
              onClick: (): void => {
                this.onResetMat017ItemRiskFactor();
              },
            },
            expressions: {
              hide: () => this.selectedCalculationItem.mat017ItemRiskFactor === this.defaultMat017ItemRiskFactor,
            },
          },
          {
            key: 'mat017ItemRiskFactor',
            type: 'input',
            hooks: {
              onInit: (field: FormlyFieldConfig): void => {
                if (field.formControl.value && this.translate.currentLang === 'de') {
                  field.formControl.patchValue(`${field.formControl.value}`.replace('.', ','));
                }
              },
            },
            props: {
              attributes: { dataCy: 'mat017Item-risk-factor-input' },
              label: 'icalc.results.MAT017_ITEM_RISK_FACTOR',
              placeholder: 'icalc.results.MAT017_ITEM_RISK_FACTOR',
              translate: true,
              required: true,
              appearance: 'outline',
              keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                handleDecimalDigitInput(event, this.translate.currentLang);
              },
            },
          },
          {
            type: 'action-button',
            className: 'center-icon-vertically margin-left-30',
            props: {
              tooltip: this.translate.instant('icalc.results.RISK_FACTOR_DEFAULT_DEVIATION-INFO'),
              icon: 'info',
            },
            expressions: {
              hide: () =>
                this.selectedCalculationItem.mat017ItemAndWorkStepRiskFactor ===
                this.defaultMat017ItemAndWorkStepRiskFactor,
            },
          },
          {
            type: 'action-button',
            className: 'center-icon-vertically',
            props: {
              tooltip: this.translate.instant('icalc.results.CLICK_TO_RESET'),
              icon: 'replay',
              onClick: (): void => {
                this.onResetMat017ItemAndWorkStepRiskFactor();
              },
            },
            expressions: {
              hide: () =>
                this.selectedCalculationItem.mat017ItemAndWorkStepRiskFactor ===
                this.defaultMat017ItemAndWorkStepRiskFactor,
            },
          },
          {
            key: 'mat017ItemAndWorkStepRiskFactor',
            type: 'input',
            hooks: {
              onInit: (field: FormlyFieldConfig): void => {
                if (field.formControl.value && this.translate.currentLang === 'de') {
                  field.formControl.patchValue(`${field.formControl.value}`.replace('.', ','));
                }
              },
            },
            props: {
              attributes: { dataCy: 'mat017Item-and-work-step-risk-factor-input' },
              label: 'icalc.results.MAT017_ITEM_AND_WORK_STEP_RISK_FACTOR',
              placeholder: 'icalc.results.MAT017_ITEM_AND_WORK_STEP_RISK_FACTOR',
              translate: true,
              required: true,
              appearance: 'outline',
              keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                handleDecimalDigitInput(event, this.translate.currentLang);
              },
            },
          },
        ],
      },
    ];
  }

  private generateSCCForm(): void {
    this.sccForm.form = new FormGroup({});
    this.sccForm.model = {
      calculationFactor: this.selectedSingleCableCalculation.calculationFactor,
      description: this.selectedConfigurationItem.description,
    };
    this.sccForm.fields = [
      {
        fieldGroupClassName: 'scc-edit-mode',
        fieldGroup: [
          {
            type: 'action-button',
            props: {
              tooltip: this.translate.instant('icalc.results.SCC_CALC_FACTOR_VALUE_IS_OVERRIDDEN'),
              icon: this.selectedSingleCableCalculation.calculationFactor ? 'info' : '',
              attributes: {
                dataCy: 'assign-selected-config-description-info-icon',
              },
            },
          },
          {
            type: 'action-button',
            props: {
              tooltip: this.translate.instant('icalc.results.CLICK_TO_RESET_OVERRIDDEN'),
              icon: this.selectedSingleCableCalculation.calculationFactor ? 'replay' : '',
              attributes: {
                dataCy: 'assign-selected-config-description-info-icon',
              },
              onClick: () => {
                this.onResetSCCCalculationFactor();
              },
            },
          },
          {
            key: 'calculationFactor',
            type: 'input',
            hooks: {
              onInit: (field: FormlyFieldConfig): void => {
                if (field.formControl.value && this.translate.currentLang === 'de') {
                  field.formControl.patchValue(`${field.formControl.value}`.replace('.', ','));
                }
              },
            },
            props: {
              attributes: {
                dataCy: 'assignment-calculation-factor-input',
                pattern: '[0-9]+([.,][0-9]+)?',
              },
              label: 'icalc.results.SCC-CALC_FACTOR',
              placeholder: 'icalc.results.SCC-CALC_FACTOR',
              translate: true,
              appearance: 'outline',
              keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                handleDecimalDigitInput(event, this.translate.currentLang);
              },
            },
          },
          {
            key: 'description',
            type: 'textarea',
            className: 'grow-1',
            parsers: [StringUtils.removeNewlinesFromString],
            props: {
              disabled: this.isLocked,
              label: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
              autosize: true,
              placeholder: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
              translate: true,
              appearance: 'outline',
              maxLength: 200,
              attributes: {
                dataCy: 'assign-selected-config-description-input',
              },
              keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                if (event.key === 'Enter') event.preventDefault();
              },
            },
          },
        ],
      },
    ];
  }

  private createNavigationItemId(id: string): string {
    return `#navigation-item${id}`;
  }

  private generateFooterActionButtonsForm(): void {
    this.footerActionButtons.fields = [
      ...this.configurationActionButtonsFormGeneratorService.generateFields(
        this.isLocked$,
        this.onConfigurationActionButtonsChanged.bind(this)
      ),
    ];
  }

  private onConfigurationActionButtonsChanged(_: FormlyFieldConfig, event?: MatSelectChange): void {
    switch (event.value) {
      case ConfigurationActionButtonsAction.removeConf:
        this.openRemoveLinkBetweenConfigurationAndCalculationDialog();
        break;
      case ConfigurationActionButtonsAction.assignConf:
        this.assignConfiguration();
        break;
      case ConfigurationActionButtonsAction.startConf:
        this.onStartNewConfiguration();
        break;
      default:
        return;
    }
    this.footerActionButtons.form.reset({ selectedAction: '' });
  }

  private generateMatPlanDownloadButtonsForm(): void {
    this.matPlanDownloadOptionsButtons.fields = [
      ...this.matPlanDownloadButtonsFormGeneratorService.generateFields(
        this.isExcelFileDownloading$,
        this.onMatPlanDownloadButtonsChanged.bind(this)
      ),
    ];
  }

  private onMatPlanDownloadButtonsChanged(_: FormlyFieldConfig, event?: MatSelectChange): void {
    this.exportProductionPlanExcel(event.value);
    this.matPlanDownloadOptionsButtons.form.reset({ selectedAction: '' });
  }
}
