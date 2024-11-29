import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { AssignConfigurationSearchDialogData } from './assign-configuration-search-dialog.component';
import {
  AssignConfigurationSearchDialogComponent,
  AssignConfigurationSearchDialogResult,
} from './assign-configuration-search-dialog.component';
import type { SelectedConfigurationRow } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';

@Injectable({ providedIn: 'root' })
export class AssignConfigurationSearchDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(
    initialSelectedConfiguration: SelectedConfigurationRow
  ): Observable<AssignConfigurationSearchDialogResult> {
    const dialogRef = this.matDialog.open<
      AssignConfigurationSearchDialogComponent,
      AssignConfigurationSearchDialogData,
      AssignConfigurationSearchDialogResult
    >(AssignConfigurationSearchDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
      data: { selectedConfiguration: initialSelectedConfiguration },
    });

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined
            ? AssignConfigurationSearchDialogResult.create(null, AssignOrCopyConfigurationActionsEnum.cancel)
            : result
        )
      );
  }
}
