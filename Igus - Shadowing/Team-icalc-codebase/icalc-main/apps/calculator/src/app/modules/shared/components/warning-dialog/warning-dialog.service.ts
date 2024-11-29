import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent, WarningDialogData, WarningDialogResult } from './warning-dialog.component';
import { DialogConfirmOrCancelEnum } from '../../types';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WarningDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(dialogData: WarningDialogData): Observable<WarningDialogResult> {
    const dialogRef = this.matDialog.open<WarningDialogComponent, WarningDialogData, WarningDialogResult>(
      WarningDialogComponent,
      {
        maxWidth: 900,
        data: {
          ...dialogData,
        },
      }
    );

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined ? WarningDialogResult.create(DialogConfirmOrCancelEnum.cancelAction) : result
        )
      );
  }
}
