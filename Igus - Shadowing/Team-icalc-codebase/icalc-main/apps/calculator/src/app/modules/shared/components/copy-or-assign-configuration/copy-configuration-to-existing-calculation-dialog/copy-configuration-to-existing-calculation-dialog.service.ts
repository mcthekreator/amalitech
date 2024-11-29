import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import type { CopyConfigurationToExistingCalculationDialogData } from './copy-configuration-to-existing-calculation-dialog.component';
import {
  CopyConfigurationToExistingCalculationDialogComponent,
  CopyConfigurationToExistingCalculationDialogResult,
} from './copy-configuration-to-existing-calculation-dialog.component';
import type { SelectedConfigurationRow } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';

interface DialogData {
  updatePrices: boolean;
  selectedConfiguration?: SelectedConfigurationRow;
}
@Injectable({ providedIn: 'root' })
export class CopyConfigurationToExistingCalculationDialogService {
  constructor(private matDialog: MatDialog) {}

  public open({
    updatePrices,
    selectedConfiguration,
  }: DialogData): Observable<CopyConfigurationToExistingCalculationDialogResult> {
    const dialogRef = this.matDialog.open<
      CopyConfigurationToExistingCalculationDialogComponent,
      CopyConfigurationToExistingCalculationDialogData,
      CopyConfigurationToExistingCalculationDialogResult
    >(CopyConfigurationToExistingCalculationDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
      data: { updatePrices, selectedConfiguration },
    });

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined
            ? CopyConfigurationToExistingCalculationDialogResult.create(AssignOrCopyConfigurationActionsEnum.cancel, {})
            : result
        )
      );
  }
}
