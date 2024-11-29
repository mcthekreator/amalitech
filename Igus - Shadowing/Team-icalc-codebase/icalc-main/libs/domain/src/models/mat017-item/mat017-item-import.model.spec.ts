import {
  Mat017ItemImportBaseDataValidationFailureReason,
  Mat017ItemImportPriceValidationFailureReason,
} from '../validation';
import type { Mat017Item, Mat017ItemImportBaseData, Mat017ItemImportPrice } from './mat017-item.model';
import { Mat017ItemStatus } from './mat017-item.model';
import { Mat017ItemImportModel, Mat017ItemImportModelCollection } from './mat017-item-import.model';

const changedImportBaseData: Mat017ItemImportBaseData = {
  matNumber: 'MAT0815',
  itemDescription1: 'new item description 1',
  itemDescription2: 'new item description 2',
  mat017ItemGroup: 'new item group',
};

const changedInvalidImportBaseData: Mat017ItemImportBaseData = {
  ...changedImportBaseData,
  matNumber: changedImportBaseData.matNumber + 'invalid',
  itemDescription1: '',
  mat017ItemGroup: '',
};

const changedImportPrice: Mat017ItemImportPrice = {
  matNumber: 'MAT0815',
  supplierItemNumber: 'new supplier item number',
  supplierId: 'new supplier id',
  quantityAmount: 0,
  priceUnit: 0,
  amount: 1.5,
  amountDividedByPriceUnit: 1.5,
};

const changedInvalidImportPrice: Mat017ItemImportPrice = {
  ...changedImportPrice,
  matNumber: changedImportPrice.matNumber + 'invalid',
  priceUnit: undefined,
  amount: undefined,
};

const unchangedImportBaseData: Mat017ItemImportBaseData = {
  matNumber: 'MAT0815',
  itemDescription1: 'old item description 1',
  itemDescription2: 'old item description 2',
  mat017ItemGroup: 'old item group',
};

const unchangedImportPrice: Mat017ItemImportPrice = {
  matNumber: 'MAT0815',
  supplierItemNumber: 'old supplier item number',
  supplierId: 'old supplier id',
  quantityAmount: 0,
  priceUnit: 100,
  amount: 0.05,
  amountDividedByPriceUnit: 0.01,
};

const existingNotManuallyCreatedItem: Mat017Item = {
  id: 'exampleId1',
  matNumber: 'MAT0815',
  itemDescription1: 'old item description 1',
  itemDescription2: 'old item description 2',
  mat017ItemGroup: 'old item group',
  supplierItemNumber: 'old supplier item number',
  supplierId: 'old supplier id',
  priceUnit: 100,
  amount: 0.05,
  amountDividedByPriceUnit: 0.01,
  itemStatus: Mat017ItemStatus.active,
  manuallyCreated: false,
};

const existingManuallyCreatedItem: Mat017Item = {
  id: 'manually1',
  matNumber: 'MAT0815manually',
  itemDescription1: 'old item description 1',
  itemDescription2: 'old item description 2',
  mat017ItemGroup: 'old item group',
  supplierItemNumber: 'old supplier item number',
  supplierId: 'old supplier id',
  priceUnit: 100,
  amount: 0.05,
  amountDividedByPriceUnit: 0.01,
  itemStatus: Mat017ItemStatus.active,
  manuallyCreated: true,
};

const completeValidChangedItem = Mat017ItemImportModel.fromBaseData(changedImportBaseData);

completeValidChangedItem.setPrice(changedImportPrice);
completeValidChangedItem.setExistingItem(existingNotManuallyCreatedItem);

const completeInvalidChangedItem = Mat017ItemImportModel.fromBaseData(changedInvalidImportBaseData);

completeInvalidChangedItem.setPrice(changedInvalidImportPrice);
completeInvalidChangedItem.setExistingItem({
  ...existingNotManuallyCreatedItem,
  matNumber: changedInvalidImportBaseData.matNumber,
});

const completeValidUnchangedItem = Mat017ItemImportModel.fromBaseData(unchangedImportBaseData);

completeValidUnchangedItem.setPrice(unchangedImportPrice);
completeValidUnchangedItem.setExistingItem(existingNotManuallyCreatedItem);

const completeValidUnchangedManuallyCreatedItem = Mat017ItemImportModel.fromBaseData({
  ...unchangedImportBaseData,
  matNumber: existingManuallyCreatedItem.matNumber,
});

completeValidUnchangedManuallyCreatedItem.setPrice({
  ...unchangedImportPrice,
  matNumber: existingManuallyCreatedItem.matNumber,
});
completeValidUnchangedManuallyCreatedItem.setExistingItem(existingManuallyCreatedItem);

const completeValidNewItem = Mat017ItemImportModel.fromBaseData(changedImportBaseData);

completeValidNewItem.setPrice(changedImportPrice);

const incompleteItemMissingPrice = Mat017ItemImportModel.fromBaseData(changedImportBaseData);

incompleteItemMissingPrice.setExistingItem(existingNotManuallyCreatedItem);

const incompleteItemMissingBaseDataNotManuallyCreated = Mat017ItemImportModel.fromPrice(changedImportPrice);

incompleteItemMissingBaseDataNotManuallyCreated.setExistingItem(existingNotManuallyCreatedItem);

const incompleteItemMissingBaseDataManuallyCreated = Mat017ItemImportModel.fromPrice({
  ...changedImportPrice,
  matNumber: existingManuallyCreatedItem.matNumber,
});

incompleteItemMissingBaseDataManuallyCreated.setExistingItem(existingManuallyCreatedItem);

const incompleteItemMissingBaseDataAndPriceWithExistingNotManuallyCreatedItem =
  Mat017ItemImportModel.fromExistingItem(existingNotManuallyCreatedItem);

const incompleteItemMissingBasDataAndPriceWithExistingManuallyCreatedItem =
  Mat017ItemImportModel.fromExistingItem(existingManuallyCreatedItem);

describe('Mat017ItemImportModel', () => {
  describe('hasBaseData', () => {
    it('should return true if importBaseData is set', () => {
      expect(completeValidChangedItem.hasBaseData()).toBeTruthy();
    });

    it('should return false if importBaseData not set', () => {
      expect(incompleteItemMissingBaseDataNotManuallyCreated.hasBaseData()).toBeFalsy();
    });
  });

  describe('hasPrice', () => {
    it('should return true if importPrice is set', () => {
      expect(completeValidChangedItem.hasPrice()).toBeTruthy();
    });

    it('should return false if importPrice is not set', () => {
      expect(incompleteItemMissingPrice.hasPrice()).toBeFalsy();
    });
  });

  describe('hasExistingItem', () => {
    it('should return true if existingItem is set', () => {
      expect(completeValidChangedItem.hasExistingItem()).toBeTruthy();
    });

    it('should return false if existingItem is not set', () => {
      expect(completeValidNewItem.hasExistingItem()).toBeFalsy();
    });
  });

  describe('hasChanges', () => {
    it('should return true if imported item differs from existing item', () => {
      expect(completeValidChangedItem.hasChanges()).toBeTruthy();
    });

    it('should return false if imported item has no changes in comparison to existing item', () => {
      expect(completeValidUnchangedItem.hasChanges()).toBeFalsy();
    });
  });

  describe('isUpdateCandidate', () => {
    it('should return true if imported data and existent data have differences', () => {
      expect(completeValidChangedItem.isUpdateCandidate()).toBeTruthy();
    });

    it('should return false if imported data and existing data is equal', () => {
      expect(completeValidUnchangedItem.isUpdateCandidate()).toBeFalsy();
    });

    it('should return true if imported data and existing data is equal (for manually created item)', () => {
      expect(completeValidUnchangedManuallyCreatedItem.isUpdateCandidate()).toBeTruthy();
    });

    it('should return false if imported data is a new item (which does not exist currently)', () => {
      expect(completeValidNewItem.isUpdateCandidate()).toBeFalsy();
    });
  });

  describe('isCreationCandidate', () => {
    it('should return true if imported data is a new item (which does not exist currently)', () => {
      expect(completeValidNewItem.isCreationCandidate()).toBeTruthy();
    });

    it('should return false if imported data has a match to existent data, with differences', () => {
      expect(completeValidChangedItem.isCreationCandidate()).toBeFalsy();
    });

    it('should return false if imported data is a match to equal existent data', () => {
      expect(completeValidUnchangedItem.isCreationCandidate()).toBeFalsy();
    });
  });

  describe('isRemovalCandidate', () => {
    it('should return true if imported data to a matching existent item, which was not manually created, does not exist', () => {
      expect(incompleteItemMissingBaseDataAndPriceWithExistingNotManuallyCreatedItem.isRemovalCandidate()).toBeTruthy();
    });

    it('should return false when imported data to a matching existent item, which was manually created, does not exist', () => {
      expect(incompleteItemMissingBasDataAndPriceWithExistingManuallyCreatedItem.isRemovalCandidate()).toBeFalsy();
    });

    it('should return true if price of imported data, but no imported data is present and corresponding existing item is not manually created', () => {
      expect(incompleteItemMissingBaseDataNotManuallyCreated.isRemovalCandidate()).toBeTruthy();
    });

    it('should return false if imported price, but no imported data is present and corresponding existing item is manually created', () => {
      expect(incompleteItemMissingBaseDataManuallyCreated.isRemovalCandidate()).toBeFalsy();
    });

    it('should return false if item has no imported price and data', () => {
      expect(incompleteItemMissingPrice.isRemovalCandidate()).toBeFalsy();
    });
  });

  describe('getAsDbEntity', () => {
    it('should return import model as db entity with current up to date values from import', () => {
      const dbEntity = completeValidChangedItem.getAsDbEntity();

      expect(dbEntity).toHaveProperty('itemDescription1', changedImportBaseData.itemDescription1);
      expect(dbEntity).toHaveProperty('itemDescription2', changedImportBaseData.itemDescription2);
      expect(dbEntity).toHaveProperty('mat017ItemGroup', changedImportBaseData.mat017ItemGroup);

      expect(dbEntity).toHaveProperty('supplierItemNumber', changedImportPrice.supplierItemNumber);
      expect(dbEntity).toHaveProperty('supplierId', changedImportPrice.supplierId);
      expect(dbEntity).toHaveProperty('priceUnit', changedImportPrice.priceUnit);
      expect(dbEntity).toHaveProperty('amount', changedImportPrice.amount);
      expect(dbEntity).toHaveProperty('amountDividedByPriceUnit', changedImportPrice.amountDividedByPriceUnit);
      expect(dbEntity).toHaveProperty('manuallyCreated', false);
    });
  });

  describe('setBaseData', () => {
    const item = incompleteItemMissingBaseDataNotManuallyCreated;

    it('should set base data for a given import model item', () => {
      item.setBaseData(changedImportBaseData);
      expect(item.hasBaseData()).toBeTruthy();
    });
  });

  describe('setPrice', () => {
    const item = incompleteItemMissingPrice;

    it('should set price for a given import model item', () => {
      item.setPrice(changedImportPrice);
      expect(item.hasPrice()).toBeTruthy();
    });
  });

  describe('setExistingItem', () => {
    const item = completeValidNewItem;

    it('should set existing item for a given import model item', () => {
      item.setExistingItem(existingNotManuallyCreatedItem);
      expect(item.hasExistingItem()).toBeTruthy();
    });
  });

  describe('getMatNumber', () => {
    it('should return the mat number for a given import model item', () => {
      expect(completeValidChangedItem.getMatNumber()).toBe(existingNotManuallyCreatedItem.matNumber);
    });
  });

  describe('getDbId', () => {
    it('should return the db id for a given import model item', () => {
      expect(completeValidChangedItem.getDbId()).toBe(existingNotManuallyCreatedItem.id);
    });
  });

  describe('getItemStatus', () => {
    it('should return inactive if the item has invalid base data', () => {
      expect(completeInvalidChangedItem.getItemStatus()).toBe(Mat017ItemStatus.inactive);
    });

    it('should return active if the item is valid', () => {
      expect(completeValidChangedItem.getItemStatus()).toBe(Mat017ItemStatus.active);
    });
  });

  describe('hasBaseDataValidationFailureReason', () => {
    it('should return true if the item has invalid base data (itemDescription1)', () => {
      expect(
        completeInvalidChangedItem.hasBaseDataValidationFailureReason(
          Mat017ItemImportBaseDataValidationFailureReason.itemDescription1
        )
      ).toBeTruthy();
    });

    it('should return true if the item has invalid base data (mat017ItemGroup)', () => {
      expect(
        completeInvalidChangedItem.hasBaseDataValidationFailureReason(
          Mat017ItemImportBaseDataValidationFailureReason.mat017ItemGroup
        )
      ).toBeTruthy();
    });

    it('should return false if the item is valid', () => {
      expect(
        completeValidChangedItem.hasBaseDataValidationFailureReason(
          Mat017ItemImportBaseDataValidationFailureReason.itemDescription1
        )
      ).toBeFalsy();
      expect(
        completeValidChangedItem.hasBaseDataValidationFailureReason(
          Mat017ItemImportBaseDataValidationFailureReason.mat017ItemGroup
        )
      ).toBeFalsy();
    });
  });

  describe('hasPriceValidationFailureReason', () => {
    it('should return true if the item has invalid priceUnit of price', () => {
      expect(
        completeInvalidChangedItem.hasPriceValidationFailureReason(
          Mat017ItemImportPriceValidationFailureReason.priceUnit
        )
      ).toBeTruthy();
    });

    it('should return true if the item has invalid amount of price', () => {
      expect(
        completeInvalidChangedItem.hasPriceValidationFailureReason(Mat017ItemImportPriceValidationFailureReason.amount)
      ).toBeTruthy();
    });

    it('should return false if the item is valid', () => {
      expect(
        completeValidChangedItem.hasPriceValidationFailureReason(Mat017ItemImportPriceValidationFailureReason.priceUnit)
      ).toBeFalsy();
      expect(
        completeValidChangedItem.hasPriceValidationFailureReason(Mat017ItemImportPriceValidationFailureReason.amount)
      ).toBeFalsy();
    });
  });
});

describe('Mat017ItemImportModelCollection', () => {
  const importModelCollection = new Mat017ItemImportModelCollection();

  // valid updatable not manually created item
  importModelCollection.addBaseData(changedImportBaseData);
  importModelCollection.addPrice(changedImportPrice);
  importModelCollection.addExistingItem(existingNotManuallyCreatedItem);

  // valid updatable manually created item
  importModelCollection.addBaseData({ ...changedImportBaseData, matNumber: existingManuallyCreatedItem.matNumber });
  importModelCollection.addPrice({ ...changedImportPrice, matNumber: existingManuallyCreatedItem.matNumber });
  importModelCollection.addExistingItem(existingManuallyCreatedItem);

  // invalid updatable item
  importModelCollection.addBaseData(changedInvalidImportBaseData);
  importModelCollection.addPrice(changedInvalidImportPrice);
  importModelCollection.addExistingItem({
    ...existingNotManuallyCreatedItem,
    matNumber: changedInvalidImportBaseData.matNumber,
  });

  // valid creatable item
  importModelCollection.addBaseData({
    ...changedImportBaseData,
    matNumber: changedImportBaseData.matNumber + 'new',
  });
  importModelCollection.addPrice({
    ...changedImportPrice,
    matNumber: changedImportBaseData.matNumber + 'new',
  });

  // invalid creatable item (no price at all)
  importModelCollection.addBaseData({
    ...changedInvalidImportBaseData,
    matNumber: changedInvalidImportBaseData.matNumber + 'new',
  });

  // removed item
  importModelCollection.addExistingItem({
    ...existingNotManuallyCreatedItem,
    id: existingNotManuallyCreatedItem.id + 'removed',
    matNumber: existingNotManuallyCreatedItem.matNumber + 'removed',
  });

  // manually created item that is not in basedata
  importModelCollection.addExistingItem({
    ...existingManuallyCreatedItem,
    id: existingManuallyCreatedItem.id + 'removed',
    matNumber: existingManuallyCreatedItem.matNumber + 'removed',
  });

  describe('getItemCount', () => {
    it('should return the correct number of items', () => {
      expect(importModelCollection.getItemCount()).toBe(7);
    });
  });

  describe('getBaseDataCount', () => {
    it('should return the correct number of items that have base data', () => {
      expect(importModelCollection.getBaseDataCount()).toBe(5);
    });
  });

  describe('getPricesCount', () => {
    it('should return the correct number of items that have prices', () => {
      expect(importModelCollection.getPricesCount()).toBe(4);
    });
  });

  describe('getExistingItemCount', () => {
    it('should return the correct number of items that have existing items', () => {
      expect(importModelCollection.getExistingItemCount()).toBe(5);
    });
  });

  describe('getImportModel', () => {
    it('should return the import model including all parts', () => {
      const importModel = importModelCollection.getImportModel(existingNotManuallyCreatedItem.matNumber);

      expect(importModel.hasBaseData()).toBeTruthy();
      expect(importModel.hasPrice()).toBeTruthy();
      expect(importModel.hasExistingItem()).toBeTruthy();
    });
  });

  describe('getImportModelArray', () => {
    it('should return an array including all import model items', () => {
      const importModelArray = importModelCollection.getImportModelArray();

      expect(importModelArray.length).toBe(7);
    });
  });

  describe('getMat017ItemImportBaseDataValidationFailureReasonCount', () => {
    it('should return number of all items with invalid base data (itemDescription1)', () => {
      const itemCount = importModelCollection.getMat017ItemImportBaseDataValidationFailureReasonCount(
        Mat017ItemImportBaseDataValidationFailureReason.itemDescription1
      );

      expect(itemCount).toBe(2);
    });

    it('should return number of all items with invalid base data (mat017ItemGroup)', () => {
      const itemCount = importModelCollection.getMat017ItemImportBaseDataValidationFailureReasonCount(
        Mat017ItemImportBaseDataValidationFailureReason.mat017ItemGroup
      );

      expect(itemCount).toBe(2);
    });
  });

  describe('getMat017ItemImportPriceValidationFailureReasonCount', () => {
    it('should return number of all items with invalid price (priceUnit)', () => {
      const itemCount = importModelCollection.getMat017ItemImportPriceValidationFailureReasonCount(
        Mat017ItemImportPriceValidationFailureReason.priceUnit
      );

      expect(itemCount).toBe(2);
    });

    it('should return number of all items with invalid price (amount)', () => {
      const itemCount = importModelCollection.getMat017ItemImportPriceValidationFailureReasonCount(
        Mat017ItemImportPriceValidationFailureReason.amount
      );

      expect(itemCount).toBe(2);
    });
  });

  describe('getNewInvalidItemCount', () => {
    it('should return the number of all invalid items', () => {
      expect(importModelCollection.getNewInvalidItemCount()).toBe(2);
    });
  });

  describe('getUpdateCandidates', () => {
    it('should return all items that should get updated', () => {
      const itemsToBeUpdated = importModelCollection.getUpdateCandidates();

      expect(itemsToBeUpdated.length).toBe(3);
      expect(itemsToBeUpdated[0].matNumber).toBe(existingNotManuallyCreatedItem.matNumber);
      expect(itemsToBeUpdated[1].matNumber).toBe(existingManuallyCreatedItem.matNumber);
      expect(itemsToBeUpdated[1].manuallyCreated).toBeFalsy();
      expect(itemsToBeUpdated[2].matNumber).toBe(changedInvalidImportBaseData.matNumber);
    });
  });

  describe('getCreationCandidates', () => {
    it('should return all items that should get created', () => {
      const itemsToBeCreated = importModelCollection.getCreationCandidates();

      expect(itemsToBeCreated.length).toBe(2);
      expect(itemsToBeCreated[0].matNumber).toBe(changedImportBaseData.matNumber + 'new');
      expect(itemsToBeCreated[1].matNumber).toBe(changedInvalidImportBaseData.matNumber + 'new');
    });
  });

  describe('getRemovalCandidates', () => {
    it('should return all items that should get set to "removed"', () => {
      const itemsToBeDeleted = importModelCollection.getRemovalCandidates();

      expect(itemsToBeDeleted.length).toBe(1);
      expect(itemsToBeDeleted[0]).toBe(existingNotManuallyCreatedItem.id + 'removed');
    });
  });

  describe('addBaseData', () => {
    it('should overwrite base data with new values if already set', () => {
      importModelCollection.addBaseData({
        ...changedImportBaseData,
        itemDescription1: 'different',
      });
      const importModel = importModelCollection.getImportModel(changedImportBaseData.matNumber);
      const differentItemDescription1 = importModel.getAsDbEntity().itemDescription1;

      expect(differentItemDescription1).toBe('different');
    });
  });

  describe('addPrice', () => {
    it('should overwrite price with new values if already set', () => {
      importModelCollection.addPrice({
        ...changedImportPrice,
        priceUnit: 100,
      });
      const importModel = importModelCollection.getImportModel(changedImportPrice.matNumber);
      const differentPriceUnit = importModel.getAsDbEntity().priceUnit;

      expect(differentPriceUnit).toBe(100);
    });
  });
});
