import { SimpleChange } from '@angular/core';
import type { MetaDataFormChanges } from './meta-data-form-utils';
import { shouldRerenderForm } from './meta-data-form-utils';

describe('shouldRerenderForm', () => {
  it('should return false if isDisplayed is not present', () => {
    const changes: MetaDataFormChanges = {
      metaDataModelFromParent: new SimpleChange(null, { selectedCalculationItem: { id: 123 } }, false),
    };

    const result = shouldRerenderForm(changes);

    expect(result).toBe(false);
  });

  it('should return false if isDisplayed.currentValue is not true', () => {
    const changes: MetaDataFormChanges = {
      isDisplayed: new SimpleChange(false, false, false),
    };

    const result = shouldRerenderForm(changes);

    expect(result).toBe(false);
  });

  it('should return false if metaDataModelFromParent.currentValue is null', () => {
    const changes: MetaDataFormChanges = {
      isDisplayed: new SimpleChange(false, true, false),
      metaDataModelFromParent: new SimpleChange({ selectedCalculationItem: { id: 123 } }, null, false),
    };

    const result = shouldRerenderForm(changes);

    expect(result).toBe(false);
  });

  it('should return true if isDisplayed.currentValue is true and metaDataModelFromParent is not null', () => {
    const changes: MetaDataFormChanges = {
      isDisplayed: new SimpleChange(false, true, false),
      metaDataModelFromParent: new SimpleChange(null, { selectedCalculationItem: { id: 123 } }, false),
    };

    const result = shouldRerenderForm(changes);

    expect(result).toBe(true);
  });

  it('should return true if isDisplayed.currentValue is true and metaDataModelFromParent is undefined', () => {
    const changes: MetaDataFormChanges = {
      isDisplayed: new SimpleChange(false, true, false),
    };

    const result = shouldRerenderForm(changes);

    expect(result).toBe(true);
  });
});
