import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>
      {{ 'icalc.ITEMLIST_LIMIT_REACHED.MESSAGE' | translate }}
    </p>

    <p class="override-info-close" (click)="onClose()">{{ 'icalc.SNACKBARS.CLOSE' | translate }}</p>
  `,
  styles: [
    `
      p.override-info-close {
        text-align: end;
        cursor: pointer;
        font-weight: bold;
      }
    `,
  ],
})
export class ItemListLimitReachedComponent {
  constructor(private matSnackBar: MatSnackBar) {}

  public onClose(): void {
    this.matSnackBar.dismiss();
  }
}