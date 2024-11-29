import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmOrCancelEnum } from '../../types';

export interface WarningDialogData {
  header: string;
  message: string;
}

export class WarningDialogResult {
  private constructor(private selectedAction: DialogConfirmOrCancelEnum) {}

  public get isCanceled(): boolean {
    return this.selectedAction === DialogConfirmOrCancelEnum.cancelAction;
  }

  public get isConfirmed(): boolean {
    return this.selectedAction === DialogConfirmOrCancelEnum.confirmAction;
  }

  public static create(selectedAction: DialogConfirmOrCancelEnum): WarningDialogResult {
    return new WarningDialogResult(selectedAction);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {
  public confirmButton = DialogConfirmOrCancelEnum.confirmAction;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: WarningDialogData,
    public dialogRef: MatDialogRef<WarningDialogComponent>
  ) {}

  public onActionSelect(selectedDialogAction: DialogConfirmOrCancelEnum): void {
    const result = WarningDialogResult.create(selectedDialogAction);

    this.dialogRef.close(result);
  }
}
