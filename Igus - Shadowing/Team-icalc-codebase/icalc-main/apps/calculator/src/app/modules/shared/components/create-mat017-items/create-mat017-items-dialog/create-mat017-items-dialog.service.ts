import { Injectable } from '@angular/core';
import { CreateMat017ItemsDialogComponent } from './create-mat017-items-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';

import { ConnectorSide } from '@igus/icalc-domain';
import { DialogConfirmOrCancelEnum } from '../../../types';

@Injectable({ providedIn: 'root' })
export class CreateMat017ItemsDialogService {
  constructor(private matDialog: MatDialog) {}

  public start(whichConnector: ConnectorSide): void {
    this.openCreateMat017ItemsDialog(whichConnector);
  }

  private openCreateMat017ItemsDialog(whichConnector: ConnectorSide): Observable<DialogConfirmOrCancelEnum> {
    const dialogRef = this.matDialog.open<CreateMat017ItemsDialogComponent>(CreateMat017ItemsDialogComponent, {
      minWidth: 1400,
      minHeight: 600,
      maxWidth: 1400,
      maxHeight: '95vh',
      panelClass: 'mat-dialog',
      data: {
        whichConnector,
      },
    });

    return dialogRef.afterClosed().pipe(
      map((result) => {
        return result === undefined ? DialogConfirmOrCancelEnum.cancelAction : result;
      })
    );
  }
}
