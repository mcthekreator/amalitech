import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-formly-action-button',
  templateUrl: './formly-action-button.type.html',
  styleUrls: ['./formly-action-button.type.scss'],
})
export class FormlyActionButtonComponent extends FieldType {
  public onClick($event: Event): void {
    if (this.props.onClick) {
      this.props.onClick($event);
    } else {
      this.props.click(this.field, $event);
    }
  }
}
