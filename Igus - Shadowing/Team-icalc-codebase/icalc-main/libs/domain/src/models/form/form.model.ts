import type { FormGroup } from '@angular/forms';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

export interface FormlyFormSettings<T> {
  form: FormGroup;
  model: Partial<T>;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
}
