import type { FormlyFieldConfig } from '@ngx-formly/core';

export const formlyApplyAutocompleteExtension = (field: FormlyFieldConfig): void => {
  if (field.type !== 'input') {
    return null;
  }

  field.props = field.props || {};
  field.props.attributes = field.props.attributes || {};
  field.props.attributes.autocomplete = 'off';
};
