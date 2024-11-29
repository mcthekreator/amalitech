import type { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StringUtils } from '@igus/icalc-domain';
import type {
  CopyConfigurationToExistingCalculationRequestDto,
  FormlyFormSettings,
  SCCWithNewConfiguration,
} from '@igus/icalc-domain';
import type { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormUtils } from '../../../services/form.utils';
import { FormAsyncValidatorsService } from '@icalc/frontend/app/modules/shared/form-async-validators';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { SelectedConfigurationRow } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';

export class CopyConfigurationToExistingCalculationDialogResult {
  private constructor(
    private selectedAction: AssignOrCopyConfigurationActionsEnum,
    private formData: SCCWithNewConfiguration
  ) {}

  public get isConfirmed(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation;
  }

  public get isCanceled(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.cancel;
  }

  public get data(): SCCWithNewConfiguration {
    return this.formData;
  }

  public static create(
    selectedAction: AssignOrCopyConfigurationActionsEnum,
    formData: SCCWithNewConfiguration
  ): CopyConfigurationToExistingCalculationDialogResult {
    return new CopyConfigurationToExistingCalculationDialogResult(selectedAction, formData);
  }
}

export interface CopyConfigurationToExistingCalculationDialogData {
  updatePrices: boolean;
  selectedConfiguration: SelectedConfigurationRow;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-copy-configuration-to-existing-calculation-dialog',
  templateUrl: './copy-configuration-to-existing-calculation-dialog.component.html',
  styleUrls: ['./copy-configuration-to-existing-calculation-dialog.component.scss'],
})
export class CopyConfigurationToExistingCalculationDialogComponent implements OnInit {
  public isLocked = false;
  public isFormReady = false;
  public configurationToExistingCalculationForm: FormlyFormSettings<SCCWithNewConfiguration> = {
    form: new FormGroup({}),
    model: {} as SCCWithNewConfiguration,
    options: {} as FormlyFormOptions,
    fields: [
      {
        parsers: [StringUtils.removeTabsAndSpacesFromString],
        key: 'matNumber',
        type: 'input',
        props: {
          label: 'icalc.meta_data.MAT-NUMBER',
          placeholder: 'icalc.meta_data.MAT-NUMBER',
          translate: true,
          required: true,
          appearance: 'outline',
          attributes: { dataCy: 'config-number-copy-config' },
          disabled: this.isLocked,
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
          disabled: this.isLocked,
          autosize: true,
          label: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
          placeholder: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
          translate: true,
          appearance: 'outline',
          maxLength: 200,
          attributes: {
            dataCy: 'description-copy-config',
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
                    dataCy: 'clear-conf-copy-description',
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
              attributes: { dataCy: 'label-left-copy-config' },
              translate: true,
              appearance: 'outline',
              disabled: this.isLocked,
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
                        dataCy: 'clear-conf-copy-labeling-left',
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
              attributes: { dataCy: 'label-right-copy-config' },
              translate: true,
              disabled: this.isLocked,
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
                        dataCy: 'clear-conf-copy-labeling-right',
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
              disabled: this.isLocked,
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
              disabled: this.isLocked,
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

  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: CopyConfigurationToExistingCalculationDialogData,
    private dialogRef: MatDialogRef<CopyConfigurationToExistingCalculationDialogComponent>,
    private formAsyncValidatorsService: FormAsyncValidatorsService,
    private processStateFacadeService: ProcessStateFacadeService,
    private appStateFacadeService: AppStateFacadeService
  ) {
    this.isLocked = this.processStateFacadeService.isLocked();
  }

  public ngOnInit(): void {
    this.configurationToExistingCalculationForm.model.labelingLeft =
      this.dialogData.selectedConfiguration?.labelingLeft;
    this.configurationToExistingCalculationForm.model.labelingRight =
      this.dialogData.selectedConfiguration?.labelingRight;
    this.configurationToExistingCalculationForm.model.description = this.dialogData.selectedConfiguration?.description;
    this.isFormReady = true;
  }

  public onActionSelect(
    action: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): void {
    const result = CopyConfigurationToExistingCalculationDialogResult.create(
      action,
      this.configurationToExistingCalculationForm.model
    );

    if (result.isConfirmed) {
      this.copyToExistingCalculation(result);
    }
    this.dialogRef.close(result);
  }

  private copyToExistingCalculation(result: CopyConfigurationToExistingCalculationDialogResult): void {
    const { matNumber, labelingLeft, labelingRight, batchSize, chainflexLength } = result.data;

    const params: CopyConfigurationToExistingCalculationRequestDto = {
      newMatNumber: matNumber,
      labelingLeft,
      labelingRight,
      description: result.data.description,
      batchSize,
      chainflexLength,
      configurationId:
        this.dialogData?.selectedConfiguration?.id ||
        this.processStateFacadeService.currentSelectedConfigurationIdSnapshot(),
      createdBy: this.appStateFacadeService.getUserName(),
      calculationId: this.processStateFacadeService.currentSelectedCalculationIdSnapshot(),
      updatePrices: this.dialogData.updatePrices,
    };

    const requiredFields = ['createdBy', 'calculationId', 'configurationId', 'newMatNumber'];

    if (requiredFields.some((field) => !params?.[field])) {
      return;
    }

    this.processStateFacadeService.copyingConfigurationToExistingCalculationSubmitted(params);
  }
}
