import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalActionsEnum } from './connector-item-price-mismatch-modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-connector-item-price-mismatch-modal',
  templateUrl: './connector-item-price-mismatch-modal.component.html',
  styleUrls: ['./connector-item-price-mismatch-modal.component.scss'],
})
export class ConnectorItemPriceMismatchModalComponent {
  public primaryButtonAction = ModalActionsEnum.cancel;
  public secondaryButtonAction = ModalActionsEnum.update;
  public isFavorites = false;
  public items: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: { isFavorites: boolean; allItemsInOneString: string },
    private dialogRef: MatDialogRef<ConnectorItemPriceMismatchModalComponent>
  ) {
    this.isFavorites = dialogData.isFavorites;
    this.items = dialogData.allItemsInOneString;
  }

  public onActionSelect(selectedAction: ModalActionsEnum): void {
    this.dialogRef.close(selectedAction);
  }
}
