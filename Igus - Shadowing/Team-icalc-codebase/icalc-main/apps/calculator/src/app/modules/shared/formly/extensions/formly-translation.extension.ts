import { ArrayUtils } from '@igus/icalc-utils';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import type { TranslateService } from '@ngx-translate/core';
import type { Observable } from 'rxjs';
import { isObservable, switchMap, combineLatest, of, map } from 'rxjs';

export class TranslateExtension {
  constructor(private translate: TranslateService) {}
  public prePopulate(field: FormlyFieldConfig): void {
    const props = field.props || {};

    if (!props.translate || props._translated) {
      return null;
    }

    props._translated = true;
    const additions = {};

    if (props.label) {
      additions['props.label'] = this.translate.stream(props.label);
    }
    if (props.placeholder) {
      additions['props.placeholder'] = this.translate.stream(props.placeholder);
    }
    if (props.selectAllOption) {
      additions['props.selectAllOption'] = this.translate.stream(props.selectAllOption);
    }
    if (props.addonRight?.text) {
      additions['props.addonRight.text'] = this.translate.stream(props.addonRight.text);
    }
    if (props.addonLeft?.text) {
      additions['props.addonLeft.text'] = this.translate.stream(props.addonLeft.text);
    }
    if (props.options && isObservable(props.options)) {
      additions['props.options'] = (
        props.options as Observable<
          {
            label: string;
          }[]
        >
      ).pipe(
        switchMap((options) =>
          combineLatest(
            (
              options as {
                label: string;
              }[]
            ).map((item) => (item.label ? this.translate.stream(item.label) : of('')))
          ).pipe(
            map((translated) => {
              return ArrayUtils.fallBackToEmptyArray(
                options as {
                  label: string;
                }[]
              ).map((item, index) => ({ ...item, label: translated[index] }));
            })
          )
        )
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ArrayUtils.isNotEmpty(props.options as any[])) {
      additions['props.options'] = combineLatest(
        (
          props.options as {
            label: string;
          }[]
        ).map((item) => this.translate.stream(item.label))
      ).pipe(
        map((translated) => {
          return ArrayUtils.fallBackToEmptyArray(
            props.options as {
              label: string;
            }[]
          ).map((item, index) => ({ ...item, label: translated[index] }));
        })
      );
    }
    if (additions) {
      field.expressions = {
        ...(field.expressions || {}),
        ...additions,
      };
    }
  }
}

export const registerTranslateExtension = (
  translate: TranslateService
): {
  validationMessages: { name: string; message(err: object): Observable<string | string[]> }[];
  extensions: { name: string; extension: TranslateExtension }[];
} => {
  return {
    validationMessages: [
      {
        name: 'uniqueCalculationNumber',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.meta_data.CALC-NUMBER_TAKEN');
        },
      },
      {
        name: 'uniqueMatNumber',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.meta_data.Configuration_TAKEN');
        },
      },
      {
        name: 'uniqueMat017ItemNumber',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.create_new_mat017_item_dialog.UNIQUE_MAT_NUMBER_ERROR');
        },
      },
      {
        name: 'validMat017ItemNumberFormat',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.create_new_mat017_item_dialog.VALID_MAT_NUMBER_FORMAT_ERROR');
        },
      },
      {
        name: 'validPriceUnitChar',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.create_new_mat017_item_dialog.VALID_PRICE_UNIT_ERROR');
        },
      },
      {
        name: 'duplicatesOfMatNumberInForm',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.create_new_mat017_item_dialog.DUPLICATE_ITEM_NUMBER_ERROR');
        },
      },
      {
        name: 'duplicatesOfSupplierItemNumberInForm',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.create_new_mat017_item_dialog.DUPLICATE_SUPPLIER_ITEM_NUMBER_ERROR');
        },
      },
      {
        name: 'required',
        message: (_): Observable<string | string[]> => {
          return translate.stream('icalc.create_new_mat017_item_dialog.REQUIRED_ERROR');
        },
      },
      {
        name: 'max',
        message: (err): Observable<string | string[]> => {
          return translate.stream('icalc.FORM_VALIDATION.MAX', err);
        },
      },
      {
        name: 'min',
        message: (err): Observable<string | string[]> => {
          return translate.stream('icalc.FORM_VALIDATION.MIN', err);
        },
      },
    ],
    extensions: [
      {
        name: 'translate',
        extension: new TranslateExtension(translate),
      },
    ],
  };
};
