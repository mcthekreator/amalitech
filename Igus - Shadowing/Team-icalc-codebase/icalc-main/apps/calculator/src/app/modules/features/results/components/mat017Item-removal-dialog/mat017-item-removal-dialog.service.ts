import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { Mat017ItemRemovalDialogComponent } from './mat017-item-removal-dialog.component';

@Injectable({ providedIn: 'root' })
export class Mat017ItemRemovalDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(): Observable<unknown> {
    const dialogRef = this.matDialog.open<Mat017ItemRemovalDialogComponent>(Mat017ItemRemovalDialogComponent, {
      panelClass: 'removeMat017ItemDialog',
      minWidth: 1700,
      maxWidth: 1700,
    });

    return dialogRef.afterClosed();
  }
}
