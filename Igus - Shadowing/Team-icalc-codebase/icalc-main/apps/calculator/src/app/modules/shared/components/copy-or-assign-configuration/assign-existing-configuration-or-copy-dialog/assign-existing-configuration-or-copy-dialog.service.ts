import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, type Observable } from 'rxjs';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import type { AssignExistingConfigurationOrCopyDialogData } from './assign-existing-configuration-or-copy-dialog.component';
import {
  AssignExistingConfigurationOrCopyDialogComponent,
  AssignExistingConfigurationOrCopyDialogResult,
} from './assign-existing-configuration-or-copy-dialog.component';

@Injectable({ providedIn: 'root' })
export class AssignExistingConfigurationOrCopyDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(matNumber: string): Observable<AssignExistingConfigurationOrCopyDialogResult> {
    const dialogRef = this.matDialog.open<
      AssignExistingConfigurationOrCopyDialogComponent,
      AssignExistingConfigurationOrCopyDialogData,
      AssignExistingConfigurationOrCopyDialogResult
    >(AssignExistingConfigurationOrCopyDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
      data: { selectedConfigurationMatNumber: matNumber },
    });

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined
            ? AssignExistingConfigurationOrCopyDialogResult.create(AssignOrCopyConfigurationActionsEnum.cancel)
            : result
        )
      );
  }
}
