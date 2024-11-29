import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { FormlyFormSettings } from '@igus/icalc-domain';
import { ConnectorActionButtonsAction } from '@igus/icalc-domain';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectorActionButtonsFormGeneratorService {
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
                  label: 'icalc.create_new_mat017_item_dialog.DIALOG_ACTION_CREATE_NEW_ITEMS',
                  value: ConnectorActionButtonsAction.createMat017Items,
                },
                {
                  label: 'icalc.connector.SELECT-CONNECTOR-SETS-BUTTON',
                  value: ConnectorActionButtonsAction.selectConnectorSets,
                },
                {
                  label: 'icalc.connector.COPY_DATA',
                  value: ConnectorActionButtonsAction.copyData,
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
