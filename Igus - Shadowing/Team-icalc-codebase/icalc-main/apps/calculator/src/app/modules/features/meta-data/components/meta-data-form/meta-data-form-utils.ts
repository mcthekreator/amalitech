import type { SimpleChange } from '@angular/core';

export interface MetaDataFormChanges {
  metaDataModelFromParent?: SimpleChange;
  isDisplayed?: SimpleChange;
  selectedCalculationId?: SimpleChange;
  selectedConfigurationId?: SimpleChange;
  createNewConfiguration?: SimpleChange;
}
export const shouldRerenderForm = (changes: MetaDataFormChanges): boolean => {
  if (!changes.isDisplayed) {
    return false;
  }

  if (changes.isDisplayed.currentValue !== true) {
    return false;
  }
  const hasEmptyMetaDataModel =
    changes.metaDataModelFromParent && changes.metaDataModelFromParent.currentValue === null;

  if (hasEmptyMetaDataModel) {
    return false;
  }

  return true;
};
