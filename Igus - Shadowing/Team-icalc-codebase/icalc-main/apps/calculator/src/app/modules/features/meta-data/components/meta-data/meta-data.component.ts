import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import type { IcalcStep } from '@icalc/frontend/app/modules/core/state/app-state/app-state.model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

import { AppStateFacadeService } from '@icalc/frontend/state/app-state/app-state-facade.service';
import type {
  MetaDataViewModel,
  MetaDataViewModelCalculation,
  MetaDataViewModelConfiguration,
  SelectedConfigurationRow,
} from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';
import { ConfigurationActionButtonsAction } from '@igus/icalc-domain';
import type {
  FormlyFormSettings,
  SingleCableCalculationBaseData,
  SelectedCalculation,
  SelectedConfiguration,
} from '@igus/icalc-domain';
import { ObjectUtils } from '@igus/icalc-utils';
import { merge, distinctUntilChanged, map, Subject, Subscription, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RemoveLinkBetweenConfigurationAndCalculationDialogComponent } from '@icalc/frontend/app/modules/shared/components/remove-link-between-configuration-and-calculation-dialog/remove-link-between-configuration-and-calculation-dialog.component';
import type { MatSelectChange } from '@angular/material/select';
import { ConfigurationActionButtonsFormGeneratorService } from '@icalc/frontend/app/modules/shared/form-generators';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { CopyOrAssignConfigurationDialogWorkflowService } from '@icalc/frontend/app/modules/shared/components/copy-or-assign-configuration';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.scss'],
})
export class MetaDataComponent implements OnInit, OnDestroy {
  public nextStep$: Observable<IcalcStep>;

  public createNewCalculation = false;
  public createNewConfiguration = false;

  public selectedCalculationId: string = null;
  public selectedConfigurationId: string = null;

  public selectedTabIndex$: Observable<number>;
  public tabIndex: number;

  public selectedCalculationItemFormObject: SelectedCalculation;
  public selectedConfigurationItemFormObject: SelectedConfiguration;

  public metaDataLatestFormValue: MetaDataViewModel;
  public metaDataViewModel: MetaDataViewModel = null;

  public selectedSingleCableCalculationFormObject: SingleCableCalculationBaseData;
  public buttonDisabled = true;

  public isLocked$: Observable<boolean>;
  public footerActionButtons: FormlyFormSettings<{ selectedAction: string }> =
    this.configurationActionButtonsFormGeneratorService.initializeForm();

  public readonly selectedIndexChangeSubject = new Subject<number>();
  private calculationFromState: MetaDataViewModelCalculation;
  private configurationFromState: MetaDataViewModelConfiguration;

  private readonly subscription = new Subscription();
  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private processStateFacadeService: ProcessStateFacadeService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private assignmentDialog: MatDialog,
    private configurationActionButtonsFormGeneratorService: ConfigurationActionButtonsFormGeneratorService,
    private copyOrAssignConfigurationDialogWorkflowService: CopyOrAssignConfigurationDialogWorkflowService
  ) {
    this.processStateFacadeService.enteringMetaDataPageStarted();
    this.isLocked$ = this.processStateFacadeService.isLocked$;
    this.generateFooterActionButtonsForm();
  }

  public ngOnInit(): void {
    this.selectedTabIndex$ = this.processStateFacadeService.selectedTabIndex$();

    this.processStateFacadeService.enteringMetaDataPageEntered();
    this.nextStep$ = this.appStateFacadeService.nextStep$;

    this.subscription.add(
      this.selectedTabIndex$.subscribe((value) => {
        this.tabIndex = value;
      })
    );

    this.subscription.add(
      merge(
        this.processStateFacadeService.hasCreatedConfigurationForExistingCalculationSuccessfully$(),
        this.processStateFacadeService.hasCreatedNewCalculationAndConfigurationSuccessfully$()
      ).subscribe(() => {
        this.router.navigate([this.appStateFacadeService.getNextStepSnapShot()?.route]);
      })
    );

    this.subscription.add(
      this.processStateFacadeService.metaDataViewModel$
        .pipe(distinctUntilChanged((previous, next) => ObjectUtils.isEqualJSONRepresentation(previous, next) === true))
        .subscribe((metaDataViewModel) => {
          this.metaDataViewModel = metaDataViewModel;
          this.metaDataLatestFormValue = this.metaDataViewModel;

          this.selectedConfigurationId = metaDataViewModel?.selectedConfigurationItem?.id;
          this.selectedCalculationId = metaDataViewModel?.selectedCalculationItem.id;

          this.calculationFromState = metaDataViewModel?.selectedCalculationItem;
          this.configurationFromState = metaDataViewModel?.selectedConfigurationItem;

          this.setViewMode(this.metaDataViewModel);
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public resetSelection(): void {
    this.processStateFacadeService.resettingSelectionSubmitted();
  }

  public onSelectedIndexChange(tabIndex: number): void {
    this.processStateFacadeService.changeSelectedTab(tabIndex);
    this.selectedIndexChangeSubject.next(tabIndex);
  }

  public onButtonDisabled(status: boolean): void {
    this.buttonDisabled = status;
  }

  public onMetaDataFormValueChanged(formValue: MetaDataViewModel): void {
    this.metaDataLatestFormValue = formValue;
  }

  public startCalculation(): void {
    if (this.createNewCalculation) {
      this.createCalculationAndConfiguration();
      return;
    } else if (this.createNewConfiguration) {
      this.createNewConfigurationForExistingCalculation();
      return;
    }

    this.processStateFacadeService.updatingMetaDataStarted(this.metaDataLatestFormValue);
  }

  public resetFormView(): void {
    const metaDataModel: MetaDataViewModel = {
      selectedCalculationItem: { id: null },
      selectedConfigurationItem: { id: null },
      selectedSingleCableCalculationItem: { id: null },
    };

    this.processStateFacadeService.resettingSelectionSubmitted();
    this.setViewMode(metaDataModel);
  }

  public startNewConfiguration(): void {
    // the view model of form is set explicitly only with selectedCalculationItem, so that new configuration data can be provided
    const metaDataModel: MetaDataViewModel = {
      selectedCalculationItem: this.calculationFromState,
      selectedConfigurationItem: { id: null },
      selectedSingleCableCalculationItem: { id: null },
    };

    this.processStateFacadeService.resettingSelectionSubmitted();
    this.setViewMode(metaDataModel);

    if (this.tabIndex !== 0) {
      this.onSelectedIndexChange(0);
    }
  }

  public openRemoveLinkBetweenConfigurationAndCalculationDialog(): void {
    this.assignmentDialog.open(RemoveLinkBetweenConfigurationAndCalculationDialogComponent, {
      id: 'removeLinkBetweenConfigurationAndCalculationDialog',
      minWidth: 745,
    });
  }

  public assignConfiguration(): void {
    this.copyOrAssignConfigurationDialogWorkflowService.start();
  }

  public onConfigurationSelected(event: SelectedConfigurationRow): void {
    this.processStateFacadeService.selectingConfigurationInConfigurationSearchStarted({
      configurationId: event.id,
    });
  }

  /*
   * Depending on the informations provided in viewModel the component can handle creating a new calculation,
   * creating a new configuration for existing calculation or editing existing calculation and configuration
   */
  private setViewMode(metaDataViewModel: MetaDataViewModel): void {
    this.createNewCalculation =
      !metaDataViewModel?.selectedCalculationItem?.id && !metaDataViewModel?.selectedConfigurationItem?.matNumber;
    this.createNewConfiguration =
      metaDataViewModel?.selectedCalculationItem?.id && !metaDataViewModel?.selectedConfigurationItem?.id;

    this.metaDataViewModel = ObjectUtils.cloneDeep<MetaDataViewModel>(metaDataViewModel);
  }

  private createNewConfigurationForExistingCalculation(): void {
    const { selectedCalculationItem, selectedConfigurationItem, selectedSingleCableCalculationItem } =
      this.metaDataLatestFormValue;

    this.processStateFacadeService.createNewConfigurationForExistingCalculationSubmitted({
      calculationId: selectedCalculationItem?.id,
      configuration: {
        matNumber: selectedConfigurationItem?.matNumber,
        labelingLeft: selectedConfigurationItem?.labelingLeft,
        labelingRight: selectedConfigurationItem?.labelingRight,
        description: selectedConfigurationItem?.description,
      },
      singleCableCalculation: {
        batchSize: selectedSingleCableCalculationItem.batchSize,
        chainflexLength: null,
      },
    });
  }

  private createCalculationAndConfiguration(): void {
    const { selectedCalculationItem, selectedConfigurationItem, selectedSingleCableCalculationItem } =
      this.metaDataLatestFormValue;

    this.processStateFacadeService.creatingNewCalculationAndNewConfigurationSubmitted({
      calculation: {
        calculationFactor: selectedCalculationItem.calculationFactor,
        customerType: selectedCalculationItem.customerType,
        calculationNumber: selectedCalculationItem.calculationNumber,
        quoteNumber: selectedCalculationItem.quoteNumber,
        customer: selectedCalculationItem.customer,
      },
      configuration: {
        matNumber: selectedConfigurationItem.matNumber,
        labelingLeft: selectedConfigurationItem.labelingLeft,
        labelingRight: selectedConfigurationItem.labelingRight,
        description: selectedConfigurationItem.description,
      },
      singleCableCalculation: {
        batchSize: selectedSingleCableCalculationItem.batchSize,
        chainflexLength: null,
      },
    });
  }

  private generateFooterActionButtonsForm(): void {
    const isDisabled$ = this.shouldConfigurationActionButtonsBeDisabled();

    this.footerActionButtons.fields = [
      ...this.configurationActionButtonsFormGeneratorService.generateFields(
        isDisabled$,
        this.onConfigurationActionButtonsChanged.bind(this)
      ),
    ];
  }

  private shouldConfigurationActionButtonsBeDisabled(): Observable<boolean> {
    return this.isLocked$.pipe(
      switchMap((isLocked) =>
        this.selectedTabIndex$.pipe(
          map((tabIndex) => {
            const isCurrentlyInSearch = tabIndex > 0;

            return this.createNewCalculation || isCurrentlyInSearch || isLocked;
          })
        )
      )
    );
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
        this.startNewConfiguration();
        break;
      default:
        return;
    }
    this.footerActionButtons.form.reset({ selectedAction: '' });
  }
}
