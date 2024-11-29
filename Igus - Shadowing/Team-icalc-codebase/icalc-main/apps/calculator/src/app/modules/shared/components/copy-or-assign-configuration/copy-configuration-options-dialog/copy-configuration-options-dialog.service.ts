import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { CopyConfigurationOptionsDialogResult } from './copy-configuration-options-dialog.component';
import { CopyConfigurationOptionsDialogComponent } from './copy-configuration-options-dialog.component';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CopyConfigurationOptionsDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(): Observable<CopyConfigurationOptionsDialogResult> {
    const dialogRef = this.matDialog.open<
      CopyConfigurationOptionsDialogComponent,
      unknown,
      CopyConfigurationOptionsDialogResult
    >(CopyConfigurationOptionsDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
    });

    return dialogRef.afterClosed();
  }
}
