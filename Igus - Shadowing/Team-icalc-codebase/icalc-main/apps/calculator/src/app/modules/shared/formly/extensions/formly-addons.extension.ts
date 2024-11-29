import type { FormlyFieldConfig } from '@ngx-formly/core';

// extension to show icons on both sides of a formly field
// for example usage search for 'addonRight: {'
export const addonsExtension = (field: FormlyFieldConfig): void => {
  if (!field.props || (field.wrappers && field.wrappers.indexOf('addons') !== -1)) {
    return;
  }

  // if one of these props is defined, the wrapper is added automatically
  if (field.props.addonLeft || field.props.addonRight) {
    field.wrappers = [...(field.wrappers || []), 'addons'];
  }
};
