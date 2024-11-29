import { FormArray, FormGroup, FormControl } from '@angular/forms';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import type { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';
import { updateValueAndValidityByFieldName } from './create-mat017-items-form.service';

describe('updateValueAndValidityByFieldName', () => {
  let mockFormArray: FormArray;
  let mockRow1: FormGroup;
  let mockRow2: FormGroup;
  let mockRow3: FormGroup;
  let mockField: FormlyFieldConfig;
  let fieldName: string;
  let fieldChanges: FormlyValueChangeEvent;

  beforeEach(() => {
    mockRow1 = new FormGroup({
      testField: new FormControl('initialValue1'),
    });

    mockRow2 = new FormGroup({
      testField: new FormControl('initialValue2'),
    });

    mockRow3 = new FormGroup({
      testField: new FormControl('initialValue1'),
    });

    mockFormArray = new FormArray([mockRow1, mockRow2, mockRow3]);

    mockField = {
      form: {
        root: {
          get: jest.fn().mockReturnValue(mockFormArray),
        },
      },
    } as any;

    fieldName = 'testField';
    fieldChanges = { field: mockField, type: 'valueChanges', value: 'newValue1' };
  });

  it('should call updateValueAndValidity on all invalid rows except the one where the change originates', () => {
    // simulates change orignating from this row by having already the new value
    mockRow1.get('testField').setValue(fieldChanges.value);
    mockRow2.get('testField').setErrors([{ unique: true }]);

    const updateValueAndValiditySpy1 = jest.spyOn(mockRow1.get(fieldName), 'updateValueAndValidity');
    const updateValueAndValiditySpy2 = jest.spyOn(mockRow2.get(fieldName), 'updateValueAndValidity');
    const updateValueAndValiditySpy3 = jest.spyOn(mockRow3.get(fieldName), 'updateValueAndValidity');

    updateValueAndValidityByFieldName(mockField, fieldChanges, fieldName);

    expect(updateValueAndValiditySpy1).not.toHaveBeenCalled();
    expect(updateValueAndValiditySpy2).toHaveBeenCalled();
    expect(updateValueAndValiditySpy3).not.toHaveBeenCalled();
  });

  it('should not call updateValueAndValidity if the field value did not change', () => {
    fieldChanges = { field: mockField, type: 'valueChanges', value: 'initialValue1' };
    const updateValueAndValiditySpy1 = jest.spyOn(mockRow1.get(fieldName), 'updateValueAndValidity');
    const updateValueAndValiditySpy2 = jest.spyOn(mockRow2.get(fieldName), 'updateValueAndValidity');

    updateValueAndValidityByFieldName(mockField, fieldChanges, fieldName);

    expect(updateValueAndValiditySpy1).not.toHaveBeenCalled();
    expect(updateValueAndValiditySpy2).not.toHaveBeenCalled();
  });
});
