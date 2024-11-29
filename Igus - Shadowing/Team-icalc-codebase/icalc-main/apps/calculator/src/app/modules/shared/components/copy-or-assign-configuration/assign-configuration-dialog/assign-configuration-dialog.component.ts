import type { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import type { FormlyFormSettings, SCCWithNewConfiguration, SingleCableCalculationBaseData } from '@igus/icalc-domain';
import { StringUtils } from '@igus/icalc-domain';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import type { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { ProcessStateFacadeService } from '../../../../core/state/process-state/process-state-facade.service';
import { FormUtils } from '../../../services/form.utils';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import type { SelectedConfigurationRow } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';

export class AssignConfigurationDialogResult {
  private constructor(
    private singleCableCalculationBaseData: SingleCableCalculationBaseData,
    private selectedDialogAction: AssignOrCopyConfigurationActionsEnum
  ) {}

  public get isConfirmed(): boolean {
    return this.selectedDialogAction === AssignOrCopyConfigurationActionsEnum.assignConfiguration;
  }

  public get isCanceled(): boolean {
    return this.selectedDialogAction === AssignOrCopyConfigurationActionsEnum.cancel;
  }

  public get data(): SingleCableCalculationBaseData {
    return this.singleCableCalculationBaseData;
  }

  public static create(
    singleCableCalculationBaseData: SingleCableCalculationBaseData,
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): AssignConfigurationDialogResult {
    return new AssignConfigurationDialogResult(singleCableCalculationBaseData, selectedDialogAction);
  }
}

export interface LinkExistingConfigurationDialogData {
  selectedConfiguration: SelectedConfigurationRow;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-assign-configuration-dialog',
  templateUrl: './assign-configuration-dialog.component.html',
  styleUrls: ['./assign-configuration-dialog.component.scss'],
})
export class AssignConfigurationDialogComponent implements OnInit {
  public selectedConfigurationId: string = null;
  public isFormReady = false;

  public primaryButtonAction = AssignOrCopyConfigurationActionsEnum.cancel;
  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.assignConfiguration;

  public destroy$ = new Subject<void>();

  public assignConfigurationToExistingCalculationForm: FormlyFormSettings<SCCWithNewConfiguration> = {
    form: new FormGroup({}),
    model: {} as SCCWithNewConfiguration,
    options: {} as FormlyFormOptions,
    fields: [
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        parsers: [StringUtils.removeTabsAndSpacesFromString],
        fieldGroup: [
          {
            key: 'matNumber',
            type: 'input',
            defaultValue: 'matNumber',
            className: 'grow-1',
            props: {
              disabled: true,
              label: 'icalc.meta_data.MAT-NUMBER',
              placeholder: 'icalc.meta_data.MAT-NUMBER',
              translate: true,
              appearance: 'outline',
              attributes: { dataCy: 'config-mat-number-link-config-to-existing-calc' },
            },
            modelOptions: {
              updateOn: 'blur',
            },
          },
        ],
      },
      {
        key: 'description',
        type: 'textarea',
        props: {
          disabled: true,
          autosize: true,
          label: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
          placeholder: 'icalc.meta_data.CONFIGURATION_DESCRIPTION',
          translate: true,
          appearance: 'outline',
          maxLength: 200,
        },
      },
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'labelingLeft',
            type: 'input',
            defaultValue: 'labelingLeft',
            className: 'grow-1',
            props: {
              disabled: true,
              label: 'icalc.meta_data.LABELING-LEFT',
              placeholder: 'icalc.meta_data.LABELING-LEFT',
              attributes: { dataCy: 'label-left-link-config-to-existing-calc' },
              translate: true,
              appearance: 'outline',
            },
          },
          {
            key: 'labelingRight',
            type: 'input',
            defaultValue: 'labelingRight',
            className: 'grow-1',
            props: {
              disabled: true,
              label: 'icalc.meta_data.LABELING-RIGHT',
              placeholder: 'icalc.meta_data.LABELING-RIGHT',
              attributes: { dataCy: 'label-right-link-config-to-existing-calc' },
              translate: true,
              appearance: 'outline',
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
                dataCy: 'batch-size-link-existing-config-to-existing-calc',
              },
              label: 'icalc.meta_data.BATCH-SIZE',
              placeholder: 'icalc.meta_data.BATCH-SIZE',
              translate: true,
              appearance: 'outline',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
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
                dataCy: 'chainflex-length-link-existing-config-to-existing-calc',
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

  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private dialogRef: MatDialogRef<AssignConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: LinkExistingConfigurationDialogData
  ) {}

  public ngOnInit(): void {
    const data = this.dialogData.selectedConfiguration;

    this.selectedConfigurationId = data?.id;
    this.assignConfigurationToExistingCalculationForm.model.matNumber = data?.matNumber;
    this.assignConfigurationToExistingCalculationForm.model.labelingLeft = data?.labelingLeft;
    this.assignConfigurationToExistingCalculationForm.model.labelingRight = data?.labelingRight;
    this.assignConfigurationToExistingCalculationForm.model.description = data?.description;
    this.isFormReady = true;
  }

  public onActionSelect(
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): void {
    const { batchSize, chainflexLength } = this.assignConfigurationToExistingCalculationForm.model || {};
    const singleCableCalculationData: SingleCableCalculationBaseData = {
      batchSize,
      chainflexLength,
    };

    const result = AssignConfigurationDialogResult.create(singleCableCalculationData, selectedDialogAction);

    if (result.isConfirmed) {
      this.assignConfigurationWithExistingCalculation(result);
    }

    this.dialogRef.close(result);
  }

  private assignConfigurationWithExistingCalculation(result: AssignConfigurationDialogResult): void {
    this.processStateFacadeService.assignConfigurationToExistingCalculation({
      configurationId: this.selectedConfigurationId,
      singleCableCalculationBaseData: result.data,
    });
  }
}
