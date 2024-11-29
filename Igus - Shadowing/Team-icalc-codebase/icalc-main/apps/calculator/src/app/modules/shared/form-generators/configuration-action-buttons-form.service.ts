import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { FormlyFormSettings } from '@igus/icalc-domain';
import { ConfigurationActionButtonsAction } from '@igus/icalc-domain';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationActionButtonsFormGeneratorService {
  public initializeForm(): FormlyFormSettings<{ selectedAction: string }> {
    return {
      form: new FormGroup({}),
      model: { selectedAction: null },
      options: {} as FormlyFormOptions,
      fields: [] as FormlyFieldConfig[],
    };
  }

  public generateFields(
    isDisabledExpression$: Observable<boolean>,
    onChange: (field: FormlyFieldConfig, event?: unknown) => void
  ): FormlyFieldConfig[] {
    return [
      {
        fieldGroup: [
          {
            key: 'selectedAction',
            type: 'select',
            expressions: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'props.disabled': isDisabledExpression$,
            },
            props: {
              label: 'icalc.meta_data.FURTHER_EDITING_OPTIONS',
              translate: true,
              appearance: 'outline',
              options: [
                {
                  label: 'icalc.meta_data.REMOVE_CONF',
                  value: ConfigurationActionButtonsAction.removeConf,
                },
                {
                  label: 'icalc.meta_data.BUTTON_ASSIGN_CONF',
                  value: ConfigurationActionButtonsAction.assignConf,
                },
                {
                  label: 'icalc.meta_data.BUTTON_START_NEW_CONF',
                  value: ConfigurationActionButtonsAction.startConf,
                },
              ],
              change: onChange,
            },
          },
        ],
      },
    ];
  }
}
