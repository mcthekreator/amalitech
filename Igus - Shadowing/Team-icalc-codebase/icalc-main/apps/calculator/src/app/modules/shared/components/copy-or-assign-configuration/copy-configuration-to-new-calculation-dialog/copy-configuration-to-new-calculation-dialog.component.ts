import type { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StringUtils } from '@igus/icalc-domain';
import type {
  FormlyFormSettings,
  CustomerTypeEnum,
  SCCWithNewConfiguration,
  CopyConfigurationToNewCalculationDto,
} from '@igus/icalc-domain';
import type { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';
import { handleDecimalDigitInput } from '../../../directives/decimal-digit-input.directive';
import { FormAsyncValidatorsService } from '../../../form-async-validators';
import { FormUtils } from '../../../services/form.utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { CalculationNumberInputGenerator } from '../../../form-generators';
import {
  SelectedCalculationRow,
  SelectedConfigurationRow,
} from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';

export class CopyConfigurationToNewCalculationDialogResult {
  private constructor(private selectedAction: AssignOrCopyConfigurationActionsEnum) {}

  public get isConfirmed(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.copyToNewCalculation;
  }

  public get isCanceled(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.cancel;
  }

  public static create(
    selectedAction?: AssignOrCopyConfigurationActionsEnum
  ): CopyConfigurationToNewCalculationDialogResult {
    return new CopyConfigurationToNewCalculationDialogResult(selectedAction);
  }
}

export interface CopyConfigurationToNewCalculationDialogData {
  updatePrices: boolean;
  selectedCalculation: SelectedCalculationRow;
  selectedConfiguration: SelectedConfigurationRow;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-copy-configuration-to-new-calculation-dialog',
  templateUrl: './copy-configuration-to-new-calculation-dialog.component.html',
  styleUrls: ['./copy-configuration-to-new-calculation-dialog.component.scss'],
})
export class CopyConfigurationToNewCalculationDialogComponent implements OnInit {
  public configurationToNewCalculationForm: FormlyFormSettings<
    {
      newCalculationNumber?: string;
      customerType?: CustomerTypeEnum;
      calculationFactor?: number;
      quoteNumber?: string;
      customer?: string;
    } & SCCWithNewConfiguration
  >;

  public isFormReady = false;
  public isLocked: boolean;

  public primaryButtonAction = AssignOrCopyConfigurationActionsEnum.cancel;
  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyToNewCalculation;

  private updatePrice = false;
  private configurationId: string;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: CopyConfigurationToNewCalculationDialogData,
    private dialogRef: MatDialogRef<CopyConfigurationToNewCalculationDialogComponent>,
    private formAsyncValidatorsService: FormAsyncValidatorsService,
    private processStateFacadeService: ProcessStateFacadeService,
    private appStateFacadeService: AppStateFacadeService,
    private calculationNumberInputGenerator: CalculationNumberInputGenerator
  ) {}

  public ngOnInit(): void {
    this.isLocked = this.processStateFacadeService.isLocked();
    this.generateConfigurationToNewCalculationForm();

    this.configurationToNewCalculationForm.model.labelingLeft = this.dialogData.selectedConfiguration?.labelingLeft;
    this.configurationToNewCalculationForm.model.labelingRight = this.dialogData.selectedConfiguration?.labelingRight;
    this.configurationToNewCalculationForm.model.description = this.dialogData.selectedConfiguration?.description;
    this.configurationToNewCalculationForm.model.customer = this.dialogData.selectedCalculation?.customer;
    this.updatePrice = this.dialogData.updatePrices;
    this.configurationId = this.dialogData.selectedConfiguration?.id;

    this.isFormReady = true;
  }

  public onActionSelect(selectedDialogAction: AssignOrCopyConfigurationActionsEnum): void {
    const result = CopyConfigurationToNewCalculationDialogResult.create(selectedDialogAction);

    if (result.isConfirmed) {
      this.copyConfigurationToNewCalculation();
    }

    this.dialogRef.close(result);
  }

  private copyConfigurationToNewCalculation(): void {
    const model = this.configurationToNewCalculationForm.model || {};
    const calculationFactor = +(`${model.calculationFactor}` ?? '0').replace(',', '.');

    const params: CopyConfigurationToNewCalculationDto = {
      calculationNumber: this.configurationToNewCalculationForm.model?.newCalculationNumber,
      customerType: model?.customerType,
      quoteNumber: model?.quoteNumber,
      customer: model?.customer,
      calculationFactor,
      newMatNumber: model.matNumber,
      labelingLeft: model.labelingLeft,
      labelingRight: model.labelingRight,
      description: model.description,
      batchSize: model.batchSize,
      chainflexLength: model.chainflexLength,
      createdBy: this.appStateFacadeService.getUserName(),
      configurationId: this.configurationId,
      updatePrices: !!this.updatePrice,
    };

    const requiredFields = [
      'calculationNumber',
      'createdBy',
      'calculationFactor',
      'customerType',
      'configurationId',
      'newMatNumber',
    ];

    if (requiredFields.some((field) => !params?.[field])) {
      return;
    }

    this.processStateFacadeService.copyingConfigurationToNewCalculationInMetaDataSubmitted(params);
  }

  private generateConfigurationToNewCalculationForm(): void {
    const headline = this.translate.instant('icalc.meta_data_form.CREATE_CONFIGURATION');
    const hint = this.translate.instant('icalc.meta_data_form.NEW_MAT_NUMBER_NEEDED');

    this.configurationToNewCalculationForm = {
      form: new FormGroup({}),
      model: {},
      options: {} as FormlyFormOptions,
      fields: [
        {
          fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
          fieldGroup: [
            this.calculationNumberInputGenerator.createCalculationNumberInput(),
            {
              key: 'quoteNumber',
              type: 'input',
              className: 'grow-1',
              props: {
                attributes: {
                  dataCy: 'generate-calculation-quote-number',
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
          key: 'customer',
          type: 'input',
          className: 'grow-1',
          props: {
            attributes: {
              dataCy: 'generate-calculation-customer',
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
          fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
          fieldGroup: [
            {
              key: 'customerType',
              type: 'select',
              className: 'grow-1',
              props: {
                label: 'icalc.meta_data.CUSTOMER-TYPE',
                placeholder: 'icalc.meta_data.CUSTOMER-TYPE',
                required: true,
                attributes: {
                  dataCy: 'generate-conf-customer-type-select',
                },
                translate: true,
                options: [
                  {
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
              key: 'calculationFactor',
              type: 'input',
              className: 'grow-1',
              hooks: {
                onInit: (field: FormlyFieldConfig): void => {
                  if (field.formControl.value && this.translate.currentLang === 'de') {
                    field.formControl.patchValue(`${field.formControl.value}`.replace('.', ','));
                  }
                },
              },
              props: {
                attributes: {
                  pattern: '[0-9]+([.,][0-9]+)?',
                  dataCy: 'generate-conf-calculation-factor',
                },
                label: 'icalc.meta_data.CALCULATION-FACTOR',
                placeholder: 'icalc.meta_data.CALCULATION-FACTOR',
                translate: true,
                required: true,
                appearance: 'outline',
                keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
                  handleDecimalDigitInput(event, this.translate.currentLang, 2);
                },
              },
            },
          ],
        },
        {
          template: `<h3>${headline}</h3><p>${hint}</p>`,
        },
        {
          key: 'matNumber',
          type: 'input',
          parsers: [StringUtils.removeTabsAndSpacesFromString],
          props: {
            label: 'icalc.meta_data.MAT-NUMBER',
            placeholder: 'icalc.meta_data.MAT-NUMBER',
            attributes: {
              dataCy: 'config-number-copy-config',
            },
            translate: true,
            required: true,
            appearance: 'outline',
            keyup: (field: FormlyFieldConfig) => {
              field.formControl?.setErrors?.(null);
            },
          },
          modelOptions: {
            updateOn: 'blur',
          },
          asyncValidators: {
            uniqueMatNumber: this.formAsyncValidatorsService.checkUniqueMatNumber(),
          },
        },
        {
          key: 'description',
          type: 'textarea',
          parsers: [StringUtils.removeNewlinesFromString],
          props: {
            label: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
            autosize: true,
            placeholder: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
            translate: true,
            appearance: 'outline',
            maxLength: 200,
            attributes: {
              dataCy: 'generate-conf-description',
            },
            addonRight: {},
            keypress: (field: FormlyFieldConfig, event?: KeyboardEvent): void => {
              if (event.key === 'Enter') event.preventDefault();
            },
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
                      dataCy: 'clear-calc-copy-description',
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
          fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
          fieldGroup: [
            {
              key: 'labelingLeft',
              type: 'input',
              className: 'grow-1',
              props: {
                label: 'icalc.meta_data.LABELING-LEFT',
                placeholder: 'icalc.meta_data.LABELING-LEFT',
                attributes: {
                  dataCy: 'labeling-left-copy-config',
                },
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
                          dataCy: 'clear-calc-copy-labeling-left',
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
              key: 'labelingRight',
              type: 'input',
              className: 'grow-1',
              props: {
                label: 'icalc.meta_data.LABELING-RIGHT',
                placeholder: 'icalc.meta_data.LABELING-RIGHT',
                attributes: {
                  dataCy: 'labeling-right-copy-config',
                },
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
                          dataCy: 'clear-calc-copy-labeling-right',
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
          ],
        },
        {
          fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
          fieldGroup: [
            {
              key: 'batchSize',
              type: 'input',
              className: 'grow-1',
              props: {
                type: 'number',
                min: 1,
                keydown: FormUtils.checkNumeric,
                required: true,
                attributes: {
                  onpaste: 'return false;',
                  dataCy: 'batch-size-copy-config',
                },
                label: 'icalc.meta_data.BATCH-SIZE',
                placeholder: 'icalc.meta_data.BATCH-SIZE',
                translate: true,
                appearance: 'outline',
              },
            },
            {
              key: 'chainflexLength',
              type: 'input',
              className: 'grow-1',
              props: {
                type: 'number',
                min: 0,
                max: 10000.0,
                step: 0.01,
                required: true,
                keydown: FormUtils.checkNumeric,
                attributes: {
                  onpaste: 'return false;',
                  dataCy: 'chainflex-length-copy-config',
                },
                label: 'icalc.meta_data.CHAINFLEX-LENGTH',
                placeholder: 'icalc.meta_data.CHAINFLEX-LENGTH',
                translate: true,
                appearance: 'outline',
              },
            },
          ],
        },
      ] as FormlyFieldConfig[],
    };
  }
}
