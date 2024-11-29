import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-confirm-technical-work-step-overrides-reset-dialog',
  templateUrl: './confirm-technical-work-step-overrides-reset-dialog.component.html',
  styleUrls: ['./confirm-technical-work-step-overrides-reset-dialog.component.scss'],
})
export class ConfirmTechnicalWorkStepOverridesResetDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmTechnicalWorkStepOverridesResetDialogComponent, { reset: boolean }>
  ) {}

  public acceptReset(): void {
    this.dialogRef.close({ reset: true });
  }

  public close(): void {
    this.dialogRef.close({ reset: false });
  }
}
