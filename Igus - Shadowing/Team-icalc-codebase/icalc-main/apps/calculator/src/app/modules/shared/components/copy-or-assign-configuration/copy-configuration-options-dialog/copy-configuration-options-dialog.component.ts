import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

export class CopyConfigurationOptionsDialogResult {
  private constructor(private selectedAction: AssignOrCopyConfigurationActionsEnum) {}

  public get copyToExistingCalculation(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation;
  }

  public get copyToNewCalculation(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.copyToNewCalculation;
  }

  public static create(
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): CopyConfigurationOptionsDialogResult {
    return new CopyConfigurationOptionsDialogResult(selectedDialogAction);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-copy-configuration-options-dialog',
  templateUrl: './copy-configuration-options-dialog.component.html',
  styleUrls: ['./copy-configuration-options-dialog.component.scss'],
})
export class CopyConfigurationOptionsDialogComponent {
  public isLocked: boolean;
  public primaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation;
  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyToNewCalculation;

  constructor(
    private dialogRef: MatDialogRef<CopyConfigurationOptionsDialogComponent>,
    private processStateFacadeService: ProcessStateFacadeService
  ) {
    this.isLocked = this.processStateFacadeService.isLocked();
  }

  public onActionSelect(selectedDialogAction: AssignOrCopyConfigurationActionsEnum): void {
    this.dialogRef.close(CopyConfigurationOptionsDialogResult.create(selectedDialogAction));
  }
}
