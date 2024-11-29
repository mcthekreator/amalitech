import type { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import type { MatSelectChange } from '@angular/material/select';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { handleDecimalDigitInput } from '@icalc/frontend/app/modules/shared/directives/decimal-digit-input.directive';
import type {
  FormlyFormSettings,
  CalculationPresentation,
  ConfigurationPresentation,
  SingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { TranslateService } from '@ngx-translate/core';
import type { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import type { Observable } from 'rxjs';
import { startWith, debounceTime, Subject, takeUntil, filter, Subscription, map, distinctUntilChanged } from 'rxjs';

import { FormatLengthWithFallBackPipe } from '@icalc/frontend/app/modules/shared/pipes/format-length-with-fallback';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { FormUtils } from '@icalc/frontend/app/modules/shared/services/form.utils';
import { FormAsyncValidatorsService } from '@icalc/frontend/app/modules/shared/form-async-validators';
import {
  DuplicateCalculationViewModel,
  MetaDataViewModel,
  SelectedCalculationRow,
} from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';
import { CopyConfigurationToNewOrExistingCalculationDialogWorkflowService } from '@icalc/frontend/app/modules/shared/components';
import { CalculationNumberInputGenerator } from '@icalc/frontend/app/modules/shared/form-generators';
import { StringUtils } from '@igus/icalc-domain';
import { shouldRerenderForm } from './meta-data-form-utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-meta-data-form',
  templateUrl: './meta-data-form.component.html',
  styleUrls: ['./meta-data-form.component.scss'],
})
export class MetaDataFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public metaDataModelFromParent: MetaDataViewModel;

  @Input()
  public isDisplayed: boolean;

  @Input()
  public selectedCalculationId: string;

  @Input()
  public selectedConfigurationId: string;

  @Input()
  public createNewConfiguration: boolean;

  @Output()
  public readonly startCalculationButtonDisabledEvent = new EventEmitter<boolean>();

  @Output()
  public readonly metaDataFormValueChanged = new EventEmitter<MetaDataViewModel>();

  @ViewChild('duplicateCalculationDialog', { static: true }) public duplicateCalculationDialog: TemplateRef<unknown>;

  public metaDataForm: FormlyFormSettings<MetaDataViewModel> = {
    form: new FormGroup({}),
    model: {
      selectedCalculationItem: null,
      selectedConfigurationItem: null,
      selectedSingleCableCalculationItem: null,
    },
    options: {} as FormlyFormOptions,
    fields: [] as FormlyFieldConfig[],
  };

  public isLocked = false;
  public isLoading$: Observable<boolean>;
  public destroy$ = new Subject<void>();
  public enableCopyCalculation$: Observable<boolean>;

  public newCalculationForm: FormlyFormSettings<DuplicateCalculationViewModel>;
  public createNewCalculation = true;

  // Dialog
  public isFormReady = false;
  public subscription = new Subscription();

  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private processStateFacadeService: ProcessStateFacadeService,
    private configurationDialog: MatDialog,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private formatLengthWithFallBackPipe: FormatLengthWithFallBackPipe,
    private formAsyncValidatorsService: FormAsyncValidatorsService,
    private copyConfigurationToNewOrExistingCalculationDialogWorkflowService: CopyConfigurationToNewOrExistingCalculationDialogWorkflowService,
    private calculationNumberInputGenerator: CalculationNumberInputGenerator
  ) {
    this.isLoading$ = this.processStateFacadeService.isSingleCableCalculationLoading$;
  }

  public ngOnInit(): void {
    this.startCalculationButtonDisabledEvent.emit(this.metaDataForm.form.status !== 'VALID');
    this.subscription.add(
      this.metaDataForm.form.statusChanges.pipe(distinctUntilChanged()).subscribe((value) => {
        this.startCalculationButtonDisabledEvent.emit(value !== 'VALID');
      })
    );

    this.subscription.add(
      this.metaDataForm.form.valueChanges
        .pipe(
          /*
           * When formly populates the form with data it causes an emit for each field separatetly
           * With the debounce it will be reduced to one emit with the complete values
           */
          debounceTime(100),
          takeUntil(this.destroy$)
        )
        .subscribe((value) => {
          this.metaDataFormValueChanged.emit(value);
        })
    );
    this.subscription.add(
      this.processStateFacadeService.copyingConfigurationToExistingCalculationResult$().subscribe((result) => {
        if (result.hasSucceeded) {
          this.configurationDialog.getDialogById('duplicateConfigurationDialog')?.close?.();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.metaDataModelFromParent) {
      const metaDataModel = changes.metaDataModelFromParent?.currentValue;

      this.createNewCalculation = !metaDataModel?.selectedCalculationItem?.id;
      this.initializeForm(metaDataModel);
    }

    // Since the MetaDataFormComponent is toggled between visible and hidden states using MatTabGroup,
    // we cannot rely on the OnInit hook to trigger actions every time the component becomes visible.
    // To address this, an additional field `isDisplayed` is used.
    // Additionally, a slight delay in rerendering the form is necessary to allow the autosizing of the
    // description textarea to calculate the correct height based on the initially provided values.
    if (shouldRerenderForm(changes)) {
      this.rerenderWithDelay(100);
    }
  }

  public assignConfigurationItemsToCopiedCalculation(): void {
    const params = {
      calculationId: this.selectedCalculationId,
      newQuoteNumber: this.newCalculationForm.model?.newQuoteNumber,
      newCustomer: this.newCalculationForm.model?.newCustomer,
      newCalculationNumber: this.newCalculationForm.model?.newCalculationNumber,
      singleCableCalculationIds: this.newCalculationForm.model?.singleCableCalculationIds,
      createdBy: this.appStateFacadeService.getUserName(),
    };

    if (
      ArrayUtils.isEmpty(params.singleCableCalculationIds) ||
      !params.newCalculationNumber ||
      !params.createdBy ||
      !params.calculationId
    ) {
      return;
    }

    this.processStateFacadeService.duplicatingCalculationSubmitted(params);
    this.configurationDialog.getDialogById('duplicateCalculationDialog')?.close?.();
  }

  public openCopyConfigurationDialog(): void {
    this.copyConfigurationToNewOrExistingCalculationDialogWorkflowService.start();
  }

  private rerenderWithDelay(delay: number): void {
    setTimeout(() => {
      this.metaDataForm.options.resetModel(this.metaDataForm.model);
    }, delay);
  }

  private initializeForm(metaDataModel: MetaDataViewModel): void {
    this.isLocked = metaDataModel?.selectedCalculationItem?.isLocked ?? false;

    if (metaDataModel) {
      this.selectedConfigurationId = metaDataModel.selectedConfigurationItem?.id;
      this.selectedCalculationId = metaDataModel.selectedCalculationItem?.id;
      this.createNewCalculation = !metaDataModel.selectedCalculationItem.id;

      this.generateForm(metaDataModel);
    } else {
      this.generateForm({} as MetaDataViewModel);
    }

    this.isFormReady = true;
    this.changeDetectorRef.detectChanges();
  }

  private generateForm(metaData: MetaDataViewModel): void {
    this.metaDataForm.model = metaData ? { ...metaData } : {};
    const selectedCalculationId = metaData?.selectedCalculationItem?.id ?? null;
    const selectedConfigurationId = metaData?.selectedConfigurationItem?.id ?? null;
    const selectedSingleCableCalculationId = metaData?.selectedSingleCableCalculationItem?.id ?? null;
    const selectedSnapshotId = metaData?.selectedSingleCableCalculationItem?.snapshotId ?? null;

    const defaultValue = selectedSingleCableCalculationId;

    this.metaDataForm.fields = [
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'selectedCalculationItem.calculationNumber',
            type: 'input',
            id: 'selected-calculation-number',
            className: this.isLocked ? 'grow-1 calculation-locked' : 'grow-1 calculation-unlocked',
            parsers: [StringUtils.removeTabsAndSpacesFromString],
            props: {
              label: 'icalc.meta_data.CALCULATION-NUMBER',
              placeholder: 'icalc.meta_data.CALCULATION-NUMBER',
              translate: true,
              required: true,
              disabled: this.createNewConfiguration,
              appearance: 'outline',
              attributes: {
                dataCy: 'assign-calculation-number',
              },
              keyup: (field: FormlyFieldConfig) => {
                field.formControl?.setErrors?.(null);
              },
              addonLeft: {
                icon: this.isLocked ? 'lock' : '',
                props: {
                  attributes: {
                    dataCy: 'calculation-input-lock-icon',
                  },
                },
              },
            },
            expressions: {
              hide: () => selectedCalculationId && !this.createNewConfiguration,
            },
            modelOptions: {
              updateOn: 'blur',
            },
            asyncValidators: {
              uniqueCalculationNumber: this.formAsyncValidatorsService.checkUniqueCalculationNumber(),
            },
          },
          {
            type: 'action-button',
            className: selectedCalculationId ? '' : 'display-none',
            props: {
              tooltip: this.translate.instant('icalc.meta_data_form.TOOLTIP_CALCULATION_NUMBER'),
              icon: selectedCalculationId ? 'content_copy' : '',
              attributes: {
                dataCy: 'copy-calculation-action-button',
              },
              onClick: () => {
                if (this.createNewCalculation || this.createNewConfiguration) {
                  return;
                }

                this.generateCopyCalculationForm(metaData.selectedCalculationItem as SelectedCalculationRow);
                this.configurationDialog.open(this.duplicateCalculationDialog, {
                  id: 'duplicateCalculationDialog',
                  minWidth: 745,
                });
              },
            },
            expressions: {
              hide: () => selectedCalculationId && !this.createNewConfiguration,
            },
          },
          {
            key: 'selectedCalculationItem.quoteNumber',
            type: 'input',
            className: selectedCalculationId ? 'display-none' : 'grow-1',
            props: {
              disabled: this.isLocked,
              attributes: {
                dataCy: 'assign-calculation-item-quote-number',
              },
              label: 'icalc.meta_data.QUOTE-NUMBER',
              placeholder: 'icalc.meta_data.QUOTE-NUMBER',
              translate: true,
              appearance: 'outline',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-10',
        fieldGroup: [
          {
            key: 'selectedSingleCableCalculationItem.id',
            type: 'select',
            defaultValue,
            className: this.isLocked ? 'grow-1 calculation-locked' : 'grow-1 calculation-unlocked',
            id: 'metaDataSelectCalculationItems',
            props: {
              label: 'icalc.meta_data.CALCULATION-NUMBER',
              placeholder: 'icalc.meta_data.CALCULATION-NUMBER',
              required: true,
              translate: true,
              attributes: {
                dataCy: 'calculation-items-input-select',
              },
              addonLeft: {
                icon: this.isLocked ? 'lock' : '',
              },
              options: this.processStateFacadeService.relatedSingleCableCalculationsOfConfiguration$.pipe(
                filter((v) => !!v),
                map((value) =>
                  value.map((scc) => ({
                    // Locked calculations are wrapped in a group element so that they can be styled separately.
                    ...(!scc.snapshotId && { label: scc.calculationNumber, value: scc.id }),
                    ...(scc.snapshotId && {
                      label: scc.calculationNumber,
                      group: [{ label: scc.calculationNumber, value: scc.id }],
                    }),
                  }))
                )
              ),
              change: (field: FormlyFieldConfig, event?: MatSelectChange) => {
                if (!event.value) {
                  return;
                }
                this.processStateFacadeService.selectingCalculationInMetaDataStarted({
                  singleCableCalculationId: event.value,
                });
              },
            },
            expressions: {
              hide: () => !selectedCalculationId || this.createNewConfiguration,
            },
          },
          {
            type: 'action-button',
            className: selectedCalculationId ? 'center-icon' : 'display-none',
            props: {
              tooltip: this.translate.instant('icalc.meta_data_form.TOOLTIP_CALCULATION_NUMBER'),
              icon: selectedCalculationId ? 'content_copy' : '',
              attributes: {
                dataCy: 'copy-calculation-action-button',
              },
              onClick: () => {
                if (this.createNewCalculation || this.createNewConfiguration) {
                  return;
                }
                this.generateCopyCalculationForm(metaData.selectedCalculationItem as SelectedCalculationRow);
                this.configurationDialog.open(this.duplicateCalculationDialog, {
                  id: 'duplicateCalculationDialog',
                  minWidth: 745,
                });
              },
            },
            expressions: {
              hide: () => !selectedCalculationId || this.createNewConfiguration,
            },
          },
          {
            key: 'selectedCalculationItem.quoteNumber',
            type: 'input',
            className: selectedCalculationId ? 'grow-1' : 'display-none',
            props: {
              disabled: this.isLocked,
              attributes: {
                dataCy: 'assign-selected-calculation-item-quote-number',
              },
              label: 'icalc.meta_data.QUOTE-NUMBER',
              placeholder: 'icalc.meta_data.QUOTE-NUMBER',
              translate: true,
              appearance: 'outline',
            },
          },
        ],
      },
      {
        key: 'selectedCalculationItem.customer',
        type: 'input',
        className: 'grow-1',
        props: {
          disabled: this.isLocked,
          attributes: {
            dataCy: 'assign-selected-calculation-item-customer',
          },
          label: 'icalc.meta_data.CUSTOMER',
          placeholder: 'icalc.meta_data.CUSTOMER',
          translate: true,
          appearance: 'outline',
        },
      },
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'selectedCalculationItem.customerType',
            type: 'select',
            className: 'grow-1',
            props: {
              label: 'icalc.meta_data.CUSTOMER-TYPE',
              placeholder: 'icalc.meta_data.CUSTOMER-TYPE',
              required: true,
              translate: true,
              disabled: this.isLocked,
              attributes: {
                dataCy: 'choose-selected-calc-customer-type',
              },
              options: [
                {
                  key: 'selected-calc-customer-type-select-option-serial',
                  value: 'serialCustomer',
                  label: 'icalc.meta_data.CUSTOMER-SERIAL-CUSTOMER',
                },
                {
                  value: 'betriebsMittler',
                  label: 'icalc.meta_data.CUSTOMER-BETRIEBSMITTLER',
                },
              ],
            },
          },
          {
            key: 'selectedCalculationItem.calculationFactor',
            type: 'input',
            className: 'grow-1',
            hooks: {
              onInit: (field: FormlyFieldConfig) => {
                if (field.formControl.value && this.translate.currentLang === 'de') {
                  field.formControl.patchValue(`${field.formControl.value}`.replace('.', ','));
                }
              },
            },
            props: {
              disabled: this.isLocked,
              attributes: {
                pattern: '[0-9]+([.,][0-9]+)?',
                dataCy: 'assign-selected-calculation-item-calculation-factor',
              },
              label: 'icalc.meta_data.CALCULATION-FACTOR',
              placeholder: 'icalc.meta_data.CALCULATION-FACTOR',
              translate: true,
              required: true,
              appearance: 'outline',
              keypress: (_: FormlyFieldConfig, event?: KeyboardEvent) => {
                handleDecimalDigitInput(event, this.translate.currentLang);
              },
            },
          },
        ],
      },
      {
        className: 'display-none',
        key: 'selectedCalculationItem.id',
        defaultValue: selectedCalculationId,
      },
      {
        template: `<div class="kopla-font-headline-6 sub-headline">${this.translate.instant(
          'icalc.meta_data_form.SUB-HEADLINE_CONFIGURATION'
        )}</div>`,
      },
      {
        fieldGroupClassName: 'flex-action-button',
        fieldGroup: [
          {
            key: 'selectedConfigurationItem.matNumber',
            type: 'input',
            parsers: [StringUtils.removeTabsAndSpacesFromString],
            props: {
              label: 'icalc.meta_data.MAT-NUMBER',
              placeholder: 'icalc.meta_data.MAT-NUMBER',
              translate: true,
              required: true,
              appearance: 'outline',
              attributes: {
                dataCy: 'assign-selected-config-item-config-number',
              },
              keyup: (field: FormlyFieldConfig) => {
                field.formControl?.setErrors?.(null);
              },
            },
            expressions: {
              hide: () => !!selectedConfigurationId || !!selectedSnapshotId,
            },
            modelOptions: {
              updateOn: 'blur',
            },
            asyncValidators: {
              uniqueMatNumber: this.formAsyncValidatorsService.checkUniqueMatNumber(),
            },
          },
          {
            type: 'action-button',
            className: selectedConfigurationId ? '' : 'display-none',
            props: {
              attributes: {
                dataCy: 'open-duplicate-configuration-dialog',
              },
              tooltip: this.translate.instant('icalc.meta_data_form.TOOLTIP_MAT_NUMBER'),
              icon: selectedConfigurationId ? 'content_copy' : '',
              onClick: () => {
                this.openCopyConfigurationDialog();
              },
            },
            expressions: {
              hide: () => !!selectedConfigurationId || !!selectedSnapshotId,
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'flex-action-button',
        fieldGroup: [
          {
            key: 'selectedSingleCableCalculationItem.id',
            type: 'select',
            defaultValue: selectedSingleCableCalculationId,
            props: {
              label: 'icalc.meta_data.MAT-NUMBER',
              placeholder: 'icalc.meta_data.MAT-NUMBER',
              attributes: {
                dataCy: 'select-config-number',
              },
              required: true,
              translate: true,
              options: this.processStateFacadeService.relatedSingleCableCalculationsOfCalculation$.pipe(
                filter((list) => !!list),
                map((sccList) => this.mapSingleCableCalculationsToListOfConfigurationsOptions(sccList))
              ),
              change: (field: FormlyFieldConfig, event?: MatSelectChange) => {
                if (!event.value) {
                  return;
                }
                this.processStateFacadeService.selectingConfigurationInMetaDataStarted({
                  singleCableCalculationId: event.value,
                });
              },
            },
            expressions: {
              hide: () => !selectedConfigurationId && !selectedSnapshotId,
            },
          },
          {
            type: 'action-button',
            props: {
              tooltip: this.translate.instant('icalc.meta_data_form.TOOLTIP_MAT_NUMBER'),
              icon: selectedConfigurationId ? 'content_copy' : '',
              onClick: () => {
                this.openCopyConfigurationDialog();
              },
              attributes: {
                dataCy: 'open-duplicate-configuration-dialog',
              },
            },
            expressions: {
              hide: () => !selectedConfigurationId && !selectedSnapshotId,
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'flex-action-button',
        fieldGroup: [
          {
            key: 'selectedConfigurationItem.description',
            type: 'textarea',
            parsers: [StringUtils.removeNewlinesFromString],
            props: {
              disabled: this.isLocked,
              label: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
              placeholder: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
              translate: true,
              appearance: 'outline',
              autosize: true,
              maxLength: 200,
              attributes: {
                dataCy: 'assign-selected-config-description',
              },
              keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                if (event.key === 'Enter') event.preventDefault();
              },
            },
          },
          {
            type: 'action-button',
            props: {
              tooltip: this.translate.instant('icalc.meta_data_form.TOOLTIP_CONFIGURATION_DESCRIPTION'),
              icon: 'info',
              attributes: {
                dataCy: 'assign-selected-config-description-info-icon',
              },
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30 margin-right-2',
        fieldGroup: [
          {
            key: 'selectedConfigurationItem.labelingLeft',
            type: 'input',
            className: 'grow-1',
            props: {
              disabled: this.isLocked,
              label: 'icalc.meta_data.LABELING-LEFT',
              placeholder: 'icalc.meta_data.LABELING-LEFT',
              translate: true,
              appearance: 'outline',
              attributes: {
                dataCy: 'assign-selected-config-labeling-left',
              },
              addonRight: {
                onClick: (first, second: { field: FormlyFieldConfig }) => {
                  if (second?.field?.formControl?.value) {
                    const current =
                      (
                        this.metaDataForm?.form?.value as {
                          selectedCalculationItem?: CalculationPresentation;
                          selectedConfigurationItem?: ConfigurationPresentation;
                        }
                      )?.selectedConfigurationItem ?? {};

                    this.metaDataForm.form.patchValue({
                      selectedConfigurationItem: { ...current, labelingRight: second?.field?.formControl?.value },
                    });
                  }
                },
                tooltip: this.translate.instant('icalc.meta_data_form.TOOLTIP'),
                icon: 'arrow_forward',
                props: {
                  disabled: this.isLocked,
                  attributes: {
                    dataCy: 'selected-config-copy-labeling-left-to-right',
                  },
                },
              },
            },
          },
          {
            key: 'selectedConfigurationItem.labelingRight',
            type: 'input',
            className: 'grow-1',
            props: {
              disabled: this.isLocked,
              label: 'icalc.meta_data.LABELING-RIGHT',
              placeholder: 'icalc.meta_data.LABELING-RIGHT',
              attributes: {
                dataCy: 'assign-selected-config-labeling-right',
              },
              translate: true,
              appearance: 'outline',
            },
          },
        ],
      },
      {
        key: 'selectedSingleCableCalculationItem.batchSize',
        type: 'input',
        props: {
          type: 'number',
          min: 1,
          keydown: FormUtils.checkNumeric,
          required: true,
          disabled: this.isLocked,
          attributes: {
            dataCy: 'assign-selected-config-batch-size',
            onpaste: 'return false;',
          },
          label: 'icalc.meta_data.BATCH-SIZE',
          placeholder: 'icalc.meta_data.BATCH-SIZE',
          translate: true,
          appearance: 'outline',
        },
      },
    ];

    this.isFormReady = true;
  }

  private mapSingleCableCalculationsToListOfConfigurationsOptions(
    singleCableCalculations: SingleCableCalculationPresentation[]
  ): { label: string; value: string }[] {
    return singleCableCalculations.map((item) => ({
      label: `${item.matNumber} (${this.translate.instant(
        'icalc.meta_data.CHAINFLEX_LENGTH'
      )}: ${this.formatLengthWithFallBackPipe.transform(item.chainflexLength)} ${this.translate.instant(
        'icalc.meta_data.BATCH-SIZE'
      )}: ${item.batchSize})`,
      value: item.id,
    }));
  }

  private generateCopyCalculationForm(selectedCalculation: SelectedCalculationRow): void {
    this.newCalculationForm = {
      form: new FormGroup({}),
      model: {
        newCalculationNumber: null,
        newQuoteNumber: null,
        newCustomer: selectedCalculation.customer || null,
        singleCableCalculationIds: [],
      },
      options: {} as FormlyFormOptions,
      fields: [
        {
          fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
          fieldGroup: [
            this.calculationNumberInputGenerator.createCalculationNumberInput(),
            {
              key: 'newQuoteNumber',
              type: 'input',
              className: 'grow-1',
              props: {
                attributes: {
                  dataCy: 'new-calculation-quote-number-form-input',
                },
                label: 'icalc.meta_data.QUOTE-NUMBER',
                placeholder: 'icalc.meta_data.QUOTE-NUMBER',
                translate: true,
                appearance: 'outline',
              },
            },
          ],
        },
        {
          key: 'newCustomer',
          type: 'input',
          className: 'grow-1',
          props: {
            attributes: {
              dataCy: 'new-calculation-customer-form-input',
            },
            label: 'icalc.meta_data.CUSTOMER',
            placeholder: 'icalc.meta_data.CUSTOMER',
            translate: true,
            appearance: 'outline',
            addonRight: {},
          },
          expressionProperties: {
            ['props.addonRight']: (model, formState, field) => {
              const control = field.formControl;

              if (control && control.value) {
                return {
                  onClick: (first, second: { field: FormlyFieldConfig }): void => {
                    const fieldControl = second?.field?.formControl;

                    if (fieldControl && fieldControl.value) {
                      fieldControl.setValue('');
                    }
                  },
                  props: {
                    attributes: {
                      dataCy: 'clear-calc-copy-customer',
                    },
                  },
                  tooltip: this.translate.instant('icalc.meta_data_form.CLEAR-DATA-TOOLTIP'),
                  icon: 'clear',
                };
              } else {
                return undefined;
              }
            },
          },
        },
        {
          key: 'singleCableCalculationIds',
          type: 'select',
          props: {
            label: 'icalc.meta_data_form.SELECT_Configuration_ITEMS',
            placeholder: 'Placeholder',
            attributes: { dataCy: 'select-scc-copy-calc' },
            translate: true,
            required: true,
            multiple: true,
            selectAllOption: 'icalc.meta_data_form.SELECT_Configuration_ITEMS_ALL',
            options: this.processStateFacadeService.relatedSingleCableCalculationsOfCalculation$.pipe(
              filter((list) => !!list),
              map((sccList) => this.mapSingleCableCalculationsToListOfConfigurationsOptions(sccList))
            ),
          },
        },
      ] as FormlyFieldConfig[],
    };

    this.enableCopyCalculation$ = this.newCalculationForm.form.statusChanges.pipe(
      startWith(() => this.newCalculationForm.form.status),
      map((status) => status === 'VALID')
    );
  }
}
