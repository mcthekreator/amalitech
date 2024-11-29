import type { FormControl } from '@angular/forms';
import { ArrayUtils } from '@igus/icalc-utils';
import type { Mat017ItemPickerModel } from 'libs/domain/src/models';

export const formatMat017ItemDetailsTooltip = (items: Mat017ItemPickerModel[], formControl: FormControl): string => {
  const selectedMat017Item = items.find((item) => item.matNumber === formControl.value);
  const valuesArray = selectedMat017Item ? Object.entries(selectedMat017Item).map(([_key, value]) => value) : [];
  const fallbackArray = ArrayUtils.fallBackToEmptyArray(valuesArray);

  return fallbackArray.length > 0 ? `\n${fallbackArray.join('\n')}` : '';
};
