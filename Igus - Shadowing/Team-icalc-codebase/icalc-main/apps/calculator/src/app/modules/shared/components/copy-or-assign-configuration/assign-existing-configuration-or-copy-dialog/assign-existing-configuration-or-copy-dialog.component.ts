import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';

export class AssignExistingConfigurationOrCopyDialogResult {
  private constructor(private selectedAction: AssignOrCopyConfigurationActionsEnum) {}

  public get isCanceled(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.cancel;
  }

  public get isConfirmedAssign(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.assignConfiguration;
  }

  public get isConfirmedCopy(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation;
  }

  public static create(
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): AssignExistingConfigurationOrCopyDialogResult {
    return new AssignExistingConfigurationOrCopyDialogResult(selectedDialogAction);
  }
}

export interface AssignExistingConfigurationOrCopyDialogData {
  selectedConfigurationMatNumber: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-assign-existing-configuration-or-copy-dialog',
  templateUrl: './assign-existing-configuration-or-copy-dialog.component.html',
  styleUrls: ['./assign-existing-configuration-or-copy-dialog.component.scss'],
})
export class AssignExistingConfigurationOrCopyDialogComponent {
  public selectedConfigurationMatNumber: string = null;

  public primaryButtonAction = AssignOrCopyConfigurationActionsEnum.assignConfiguration;
  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: AssignExistingConfigurationOrCopyDialogData,
    private dialogRef: MatDialogRef<AssignExistingConfigurationOrCopyDialogComponent>
  ) {
    this.selectedConfigurationMatNumber = this.dialogData.selectedConfigurationMatNumber;
  }

  public onActionSelect(
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): void {
    const result = AssignExistingConfigurationOrCopyDialogResult.create(selectedDialogAction);

    this.dialogRef.close(result);
  }
}
