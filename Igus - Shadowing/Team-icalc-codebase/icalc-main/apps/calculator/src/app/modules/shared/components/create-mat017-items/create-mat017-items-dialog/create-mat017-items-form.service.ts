import { Injectable } from '@angular/core';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormAsyncValidatorsService } from '../../../form-async-validators';
import { CreateMat017ItemsFormValidatorService } from '../form-validators';
import { StringUtils, Mat017ItemMatNumber, FormlyFormSettings, Mat017ItemCreationData } from '@igus/icalc-domain';
import { TranslateService } from '@igus/kopla-app';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable, Subscription, debounceTime, filter, tap } from 'rxjs';
import { FormlyFieldProps } from '@ngx-formly/material/form-field';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';

// TO-DO: add unit tests
export const checkIfRowHasSomeValues = (field: FormlyFieldConfig): boolean => {
  return Object.values(field.form.value).map(StringUtils.coerceToNullIfEmpty).some(Boolean);
};

export const setCurrentIndexInFormState = (field: FormlyFieldConfig): void => {
  const focusedIndex = parseInt(field.parent.key as string, 10);

  field.options.formState.currentIndex = focusedIndex;
};

export const clearCurrentIndexInFormState = (field: FormlyFieldConfig): void => {
  field.options.formState.currentIndex = undefined;
};

export const updateValueAndValidityByFieldName = (
  field: FormlyFieldConfig<FormlyFieldProps>,
  fieldChanges: FormlyValueChangeEvent,
  fieldName: string
): void => {
  const rows = (field.form.root.get('rows') as FormArray).controls;

  rows
    .filter((row) => row.get(fieldName).value !== fieldChanges.value && row.get(fieldName).invalid) // skip the row where change originates from and already valid rows
    .forEach((row: FormGroup) => row.get(fieldName).updateValueAndValidity());
};

export const updateFieldsWithTheSameKeyOnChange = (
  field: FormlyFieldConfig<FormlyFieldProps>,
  keysOfFields: string[]
): Observable<FormlyValueChangeEvent> => {
  return field.options.fieldChanges.pipe(
    debounceTime(100), // makes it reliable that changes are already propagated from individual fields to parent formGroup
    filter((fieldChange) => keysOfFields.includes(fieldChange.field.key as string)),
    tap((fieldChanges) => updateValueAndValidityByFieldName(field, fieldChanges, fieldChanges.field.key as string))
  );
};

export interface CreateMat017ItemsFormModel {
  rows: Mat017ItemCreationData[];
}

@Injectable({
  providedIn: 'root',
})
export class CreateMat017ItemsFormService {
  constructor(
    private readonly formAsyncValidatorsService: FormAsyncValidatorsService,
    private readonly formValidatorService: CreateMat017ItemsFormValidatorService,
    private readonly translate: TranslateService
  ) {}

  public initializeForm(): FormlyFormSettings<CreateMat017ItemsFormModel> {
    return {
      form: new FormGroup({}),
      model: { rows: [{} as Mat017ItemCreationData] },
      options: {} as FormlyFormOptions,
      fields: [] as FormlyFieldConfig[],
    };
  }

  public generateFields(subscription: Subscription): FormlyFieldConfig[] {
    return [
      {
        key: 'rows',
        type: 'create-mat017-items-table',
        validators: {
          checkIfFormHasSomeValues: this.formValidatorService.checkIfFormHasSomeValues(),
        },
        hooks: {
          onInit: (field) => {
            subscription.add(
              updateFieldsWithTheSameKeyOnChange(field, ['matNumber', 'supplierItemNumber']).subscribe()
            );
          },
        },
        fieldArray: {
          className: 'no-offset-on-errors',
          fieldGroup: [
            {
              key: 'matNumber',
              type: 'input',
              focus: false,
              props: {
                headerText: this.translate.instant('icalc.connector-mat017-items-table.MATNUMBER'),
                cellClassName: 'mat-number-col',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
              },
              expressions: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'props.required': checkIfRowHasSomeValues,
              },
              validation: {
                show: true,
              },
              options: {},
              modelOptions: {
                updateOn: 'blur',
              },
              parsers: [(rawValue) => Mat017ItemMatNumber.create(rawValue).value],
              validators: {
                validMat017ItemNumberFormat: this.formValidatorService.checkValidMat017ItemMatNumber(),
              },
              asyncValidators: {
                duplicatesOfMatNumberInForm: this.formValidatorService.checkDuplicatesOfMatNumberInForm(),
                uniqueMat017ItemNumber: this.formAsyncValidatorsService.checkUniqueMat017ItemMatNumber(),
              },
            },
            {
              key: 'itemDescription1',
              type: 'input',
              props: {
                headerText: this.translate.instant('icalc.connector-mat017-items-table.ITEMDESCRIPTION1'),
                cellClassName: 'item-description-col',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
              },
              expressions: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'props.required': checkIfRowHasSomeValues,
              },
              validation: {
                show: true,
              },
              modelOptions: {
                updateOn: 'blur',
              },
            },
            {
              key: 'itemDescription2',
              type: 'input',
              props: {
                headerText: this.translate.instant('icalc.connector-mat017-items-table.ITEMDESCRIPTION2'),
                cellClassName: 'item-description-col',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
              },
              modelOptions: {
                updateOn: 'blur',
              },
            },
            {
              key: 'mat017ItemGroup',
              type: 'input',
              props: {
                headerText: this.translate.instant('icalc.connector-mat017-items-table.GROUP'),
                cellClassName: 'mat-item-group-col',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
              },
              expressions: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'props.required': checkIfRowHasSomeValues,
              },
              validation: {
                show: true,
              },
              modelOptions: {
                updateOn: 'blur',
              },
            },
            {
              key: 'supplierItemNumber',
              type: 'input',
              props: {
                headerText: this.translate.instant('icalc.connector-mat017-items-table.PARTNUMBER'),
                cellClassName: 'supplier-item-number-col',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
              },
              expressions: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'props.required': checkIfRowHasSomeValues,
              },
              validation: {
                show: true,
              },
              modelOptions: {
                updateOn: 'blur',
              },
              asyncValidators: {
                duplicatesOfSupplierItemNumberInForm:
                  this.formValidatorService.checkDuplicatesOfSupplierItemNumberInForm(),
              },
            },
            {
              key: 'amount',
              type: 'input',
              props: {
                headerText: this.translate.instant('icalc.connector-mat017-items-table.PURCHASEPRICE'),
                cellClassName: 'vertical-align-bottom amount-col',

                type: 'number',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
                addonRight: {
                  text: '€',
                },
              },
              expressions: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'props.required': checkIfRowHasSomeValues,
              },
              validation: {
                show: true,
              },
              modelOptions: {
                updateOn: 'blur',
              },
            },
            {
              key: 'priceUnit',
              type: 'input',
              props: {
                headerText: this.translate.instant('icalc.create_new_mat017_item_dialog.PRICE_UNIT'),
                cellClassName: 'price-unit-col',
                translate: true,
                appearance: 'outline',
                focus: setCurrentIndexInFormState,
                blur: clearCurrentIndexInFormState,
              },
              expressions: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'props.required': checkIfRowHasSomeValues,
              },
              validation: {
                show: true,
              },
              parsers: [(value) => (value ? value.toUpperCase() : value)],
              modelOptions: {
                updateOn: 'blur',
              },
              validators: {
                validPriceUnitChar: this.formValidatorService.checkValidPriceUnit(),
              },
            },
            {
              key: 'addToBomOnCreate',
              type: 'toggle',
              props: {
                headerText: this.translate.instant('icalc.create_new_mat017_item_dialog.ADD_TO_ITEM_LIST'),
                cellClassName: 'add-to-bom-col',
                attributes: {
                  class: 'primary',
                },
              },
            },
          ],
        },
      },
    ];
  }
}
