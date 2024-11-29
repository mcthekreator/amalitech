import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import type { CopyConfigurationToNewCalculationDialogData } from './copy-configuration-to-new-calculation-dialog.component';
import {
  CopyConfigurationToNewCalculationDialogResult,
  CopyConfigurationToNewCalculationDialogComponent,
} from './copy-configuration-to-new-calculation-dialog.component';
import {
  SelectedCalculationRow,
  SelectedConfigurationRow,
} from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';

@Injectable({ providedIn: 'root' })
export class CopyConfigurationToNewCalculationDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(
    updatePrices: boolean,
    selectedCalculation: SelectedCalculationRow,
    selectedConfiguration: SelectedConfigurationRow
  ): Observable<CopyConfigurationToNewCalculationDialogResult> {
    const dialogRef = this.matDialog.open<
      CopyConfigurationToNewCalculationDialogComponent,
      CopyConfigurationToNewCalculationDialogData,
      CopyConfigurationToNewCalculationDialogResult
    >(CopyConfigurationToNewCalculationDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
      data: { updatePrices, selectedCalculation, selectedConfiguration },
    });

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined
            ? CopyConfigurationToNewCalculationDialogResult.create(AssignOrCopyConfigurationActionsEnum.cancel)
            : result
        )
      );
  }
}
