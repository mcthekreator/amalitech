import { FormControl } from '@angular/forms';
import type { Mat017ItemPickerModel } from '@igus/icalc-domain';
import { formatMat017ItemDetailsTooltip } from './format-mat017-item-details-tooltip';
import { mat017Item1, mat017Item2, mat017Item3 } from './mock-data';

const mat017Items = [mat017Item1, mat017Item2, mat017Item3];

describe('formatMat017ItemDetailsTooltip', () => {
  it('should return formatted string with full item details when matching item is found', () => {
    const formControl = new FormControl('MAT017001');

    const result = formatMat017ItemDetailsTooltip(mat017Items, formControl);

    expect(result).toBe('\nMAT017001\nItem 1 Description 1\nItem 1 Description 2\nGroup 1\nSUP001');
  });

  it('should return an empty string when no matching item is found', () => {
    const formControl = new FormControl('999');

    const result = formatMat017ItemDetailsTooltip(mat017Items, formControl);

    expect(result).toBe('');
  });

  it('should return an empty string when items array is empty', () => {
    const emptyMat017Items: Mat017ItemPickerModel[] = [];
    const formControl = new FormControl('MAT017001');

    const result = formatMat017ItemDetailsTooltip(emptyMat017Items, formControl);

    expect(result).toBe('');
  });

  it('should return an empty string when formControl value is undefined', () => {
    const formControl = new FormControl(undefined);

    const result = formatMat017ItemDetailsTooltip(mat017Items, formControl);

    expect(result).toBe('');
  });
});
