import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { LinkExistingConfigurationDialogData } from './assign-configuration-dialog.component';
import {
  AssignConfigurationDialogComponent,
  AssignConfigurationDialogResult,
} from './assign-configuration-dialog.component';
import type { SelectedConfigurationRow } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';

@Injectable({ providedIn: 'root' })
export class AssignConfigurationDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(selectedConfiguration: SelectedConfigurationRow): Observable<AssignConfigurationDialogResult> {
    const dialogRef = this.matDialog.open<
      AssignConfigurationDialogComponent,
      LinkExistingConfigurationDialogData,
      AssignConfigurationDialogResult
    >(AssignConfigurationDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
      data: { selectedConfiguration },
    });

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined
            ? AssignConfigurationDialogResult.create(undefined, AssignOrCopyConfigurationActionsEnum.cancel)
            : result
        )
      );
  }
}
