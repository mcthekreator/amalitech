import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { take, tap } from 'rxjs';
import { formatMat017ItemDetailsTooltip } from './format-mat017-item-details-tooltip';
import { Mat017ItemPickerDialogData } from './mat017-item-picker-dialog.component';
import { Mat017ItemPickerDialogService } from './mat017-item-picker-dialog.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-formly-mat017-item-picker',
  templateUrl: './formly-mat017-item-picker.type.html',
  styleUrls: ['./formly-mat017-item-picker.type.scss'],
})
export class FormlyMat017ItemPickerComponent extends FieldType<FieldTypeConfig> {
  constructor(private mat017ItemPickerDialogService: Mat017ItemPickerDialogService) {
    super();
  }

  public get hasMat017Items(): boolean {
    return this.props.items.length > 0;
  }

  public get selectedMat017ItemDetails(): string {
    return formatMat017ItemDetailsTooltip(this.props.items, this.formControl);
  }

  public openDialog(): void {
    this.mat017ItemPickerDialogService
      .open(this.getDialogData())
      .pipe(
        take(1),
        tap((selectedMatNumber) => {
          this.formControl.setValue(selectedMatNumber);
        })
      )
      .subscribe();
  }

  public resetSelection(): void {
    this.formControl.setValue(undefined);
  }

  private getDialogData(): Mat017ItemPickerDialogData {
    return {
      mat017Items: this.props.items,
    };
  }
}
