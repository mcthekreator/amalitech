import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import type { SelectedConfigurationRow } from '../../../../core/state/process-state/process-state.model';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';

export class AssignConfigurationSearchDialogResult {
  private constructor(
    private selectedConfiguration: SelectedConfigurationRow,
    private selectedAction: AssignOrCopyConfigurationActionsEnum
  ) {}

  public get isCanceled(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.cancel;
  }

  public get isConfirmed(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.assignConfiguration;
  }

  public get data(): SelectedConfigurationRow {
    return this.selectedConfiguration;
  }

  public static create(
    data: SelectedConfigurationRow,
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): AssignConfigurationSearchDialogResult {
    return new AssignConfigurationSearchDialogResult(data, selectedDialogAction);
  }
}

export interface AssignConfigurationSearchDialogData {
  selectedConfiguration: SelectedConfigurationRow;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-assign-configuration-search-dialog',
  templateUrl: './assign-configuration-search-dialog.component.html',
  styleUrls: ['./assign-configuration-search-dialog.component.scss'],
})
export class AssignConfigurationSearchDialogComponent {
  public filterConfigurations = true; // this flag is used to trigger filtering of configurations in the config search component, the filtering loads config items into the table
  public primaryButtonAction = AssignOrCopyConfigurationActionsEnum.cancel;
  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.assignConfiguration;
  public selectedRow: SelectedConfigurationRow;

  constructor(
    private dialogRef: MatDialogRef<AssignConfigurationSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AssignConfigurationSearchDialogData
  ) {
    this.selectedRow = dialogData.selectedConfiguration;
  }

  public onActionSelect(
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): void {
    this.dialogRef.close(
      AssignConfigurationSearchDialogResult.create(
        {
          ...this.selectedRow,
        },
        selectedDialogAction
      )
    );
  }

  public onConfigurationSelected(selectedRow: SelectedConfigurationRow): void {
    this.selectedRow = selectedRow;
  }
}
