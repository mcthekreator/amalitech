import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mat017ItemPickerDialogComponent, Mat017ItemPickerDialogData } from './mat017-item-picker-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Mat017ItemPickerDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(data: Mat017ItemPickerDialogData): Observable<string | undefined> {
    return this.matDialog
      .open<Mat017ItemPickerDialogComponent, Mat017ItemPickerDialogData, string>(Mat017ItemPickerDialogComponent, {
        minWidth: 1400,
        maxWidth: 1400,
        data,
      })
      .afterClosed()
      .pipe(map((value) => (value === '' ? undefined : value)));
  }
}
