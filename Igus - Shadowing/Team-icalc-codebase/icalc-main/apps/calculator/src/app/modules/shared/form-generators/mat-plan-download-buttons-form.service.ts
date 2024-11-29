import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { FormlyFormSettings } from '@igus/icalc-domain';
import { FileDownloadButtonsActionEnum } from '@igus/icalc-domain';
import { TranslateService } from '@igus/kopla-app';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root',
})
export class MatPlanDownloadButtonsFormGeneratorService {
  constructor(private translate: TranslateService) {}
  public initializeForm(): FormlyFormSettings<{ selectedAction: string }> {
    return {
      form: new FormGroup({}),
      model: { selectedAction: null },
      options: {} as FormlyFormOptions,
      fields: [] as FormlyFieldConfig[],
    };
  }

  public generateFields(
    isDisabledExpression$,
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
            className: 'locks-calculation',
            id: 'matplanDownloadOptions',
            props: {
              label: 'icalc.matplan_download_button.MAIN_LABEL',
              translate: true,
              appearance: 'outline',
              attributes: {
                dataCy: 'export-production-plan-excel',
              },
              options: [
                // {
                //   label: 'icalc.matplan_download_button.XLS_OPTION',
                //   value: FileDownloadButtonsActionEnum.fullXLS,
                //   group: [
                //     {
                //       label: this.translate.instant('icalc.matplan_download_button.XLS_OPTION'),
                //       value: FileDownloadButtonsActionEnum.fullXLS,
                //     },
                //   ],
                // },
                {
                  label: 'icalc.matplan_download_button.XLSX_OPTION',
                  value: FileDownloadButtonsActionEnum.fullXLSX,
                  group: [
                    {
                      label: this.translate.instant('icalc.matplan_download_button.XLSX_OPTION'),
                      value: FileDownloadButtonsActionEnum.fullXLSX,
                    },
                  ],
                },
                // {
                //   label: 'icalc.matplan_download_button.FULL_PDF_OPTION',
                //   value: FileDownloadButtonsActionEnum.fullPDF,
                // },
                // {
                //   label: 'icalc.matplan_download_button.PARTIAL_PDF_OPTION',
                //   value: FileDownloadButtonsActionEnum.partialPDF,
                // },
              ],
              change: onChange,
            },
          },
        ],
      },
    ];
  }
}
