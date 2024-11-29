import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

// formly wrapper to display icon on one side of the form field and handle its click event.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-formly-wrapper-addons',
  templateUrl: './formly-icon-addons.component.html',
  styleUrls: ['./formly-icon-addons.component.scss'],
})
export class FormlyIconAddonsComponent extends FieldWrapper {
  public addonRightClick($event): void {
    this.props?.addonRight?.onClick?.(this.props, this, $event);
  }

  public addonLeftClick($event): void {
    this.props?.addonLeft?.onClick?.(this.props, this, $event);
  }
}
