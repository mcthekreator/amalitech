import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActionSelectType, StringUtils } from '@igus/icalc-domain';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';

interface MultiLevelDropdownOption {
  value: string;
  label: string;
  children?: MultiLevelDropdownOption[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-formly-multi-level-dropdown',
  templateUrl: './formly-multi-level-dropdown.type.html',
  styleUrls: ['./formly-multi-level-dropdown.type.scss'],
  host: {
    class: 'multi-level-dropdown',
  },
})
export class FormlyMultiLevelDropdownComponent extends FieldType<FieldTypeConfig> implements OnInit {
  public optionsMap = new Map<string, MultiLevelDropdownOption>();
  public selectedClassification: unknown;

  private subscription: Subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  public get subActionValue(): string | undefined {
    return this.field.parent.form.get('subActionSelect')?.value;
  }

  public get selectOptions(): MultiLevelDropdownOption[] {
    return this.field.props.options as MultiLevelDropdownOption[];
  }

  public get currentValue(): string {
    return (this.formControl.value as string) || 'none';
  }

  public get disabled(): boolean {
    return this.field.props.disabled;
  }

  public get dataCy(): string | undefined {
    const dataCyAttr = this.field.props.attributes['dataCy'];

    return dataCyAttr ? StringUtils.coerceString(dataCyAttr) : undefined;
  }

  public onValueSelect(actionValue: string, subActionValue?: string): void {
    this.formControl.setValue(actionValue);
    if (subActionValue) {
      this.field.parent.form.get('subActionSelect')?.setValue(subActionValue);
    } else {
      this.field.parent.form.get('subActionSelect')?.setValue(undefined);
    }
  }

  public ngOnInit(): void {
    this.setOptionsMap();
    // ensures that change detection will be triggered when form was reset from outside
    this.markForCheckAfterFormReset();
  }

  private markForCheckAfterFormReset(): void {
    this.subscription.add(
      this.formControl.valueChanges.subscribe((value: ActionSelectType) => {
        // either if values are reset or set with automatic actions component needs to rerender
        if (value === 'none' || value === 'placeOnJacket' || value === 'setOnContact') {
          this.cdr.markForCheck();
        }
      })
    );
  }

  private setOptionsMap(): void {
    this.selectOptions.forEach((option) => {
      this.optionsMap.set(option.value, option);
      if (option.children) {
        option.children.forEach((subOption) => {
          this.optionsMap.set(`${option.value}.${subOption.value}`, subOption);
        });
      }
    });
  }
}
