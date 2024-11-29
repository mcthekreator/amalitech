import { FormGroup } from '@angular/forms';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import type { Mat017ItemListFilter } from '@igus/icalc-domain';

export type FilterForm = {
  form: FormGroup;
  model: Mat017ItemListFilter;
  options: FormlyFormOptions;
  fields: Array<FormlyFieldConfig>;
};

export const getFilterForm: (defaultFilterState: Mat017ItemListFilter) => FilterForm = (
  defaultFilterState
): FilterForm => {
  return {
    form: new FormGroup({}),
    model: Object.assign({}, defaultFilterState),
    options: {} as FormlyFormOptions,
    fields: [
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'showZeroMatches',
            type: 'checkbox',
            className: 'grow-1',
            defaultValue: false,
            props: {
              label: 'icalc.connector-search-filter.SHOW_ZERO-MATCHES',
              translate: true,
              attributes: { dataCy: 'filter-zero-matches' },
            },
          },
          {
            key: 'showOnlyManuallyCreated',
            type: 'checkbox',
            className: 'grow-1',
            defaultValue: false,
            props: {
              label: 'icalc.connector-search-filter.SHOW_ONLY_MANUALLY_CREATED',
              translate: true,
              attributes: { dataCy: 'filter-manually-created' },
            },
          },
        ],
      },
    ],
  };
};
