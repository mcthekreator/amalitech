import { Injectable } from '@angular/core';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { FormAsyncValidatorsService } from '../form-async-validators';
import { StringUtils } from '@igus/icalc-domain';

@Injectable({
  providedIn: 'root',
})
export class CalculationNumberInputGenerator {
  constructor(private readonly formAsyncValidatorsService: FormAsyncValidatorsService) {}

  public createCalculationNumberInput(): FormlyFieldConfig {
    return {
      parsers: [StringUtils.removeTabsAndSpacesFromString],
      key: 'newCalculationNumber',
      type: 'input',
      className: 'grow-1',
      props: {
        attributes: { dataCy: 'new-calculation-number-form-input' },
        label: 'icalc.meta_data.CALCULATION-NUMBER',
        placeholder: 'icalc.meta_data.CALCULATION-NUMBER',
        translate: true,
        required: true,
        appearance: 'outline',
        keyup: (field: FormlyFieldConfig) => {
          field.formControl?.setErrors?.(null);
        },
      },
      modelOptions: {
        updateOn: 'blur',
      },
      asyncValidators: {
        uniqueCalculationNumber: this.formAsyncValidatorsService.checkUniqueCalculationNumber(),
      },
    };
  }
}
