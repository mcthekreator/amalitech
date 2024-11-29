import { getDefaultPurchasingPrice } from './ierp-mat017-item';
import {
  createIcalcTestRedactedMat017ItemWithWidenData,
  createMat017Item,
  createIerpMat017Item,
} from '../../factories/objects';
import { Mat017ItemMappers } from './mat017-item.mappers';

const mockMat017Item = createMat017Item();
const mockRedactedMat017ItemWithWidenData = createIcalcTestRedactedMat017ItemWithWidenData();

const mockIerpMat017Item = createIerpMat017Item();
const mockIerpMat017ItemPrice = getDefaultPurchasingPrice(mockIerpMat017Item);

describe('Mat017ItemMapperss', () => {
  describe('toMat017ItemWithWidenData', () => {
    it('should correctly map Mat017Item to Mat017ItemWithWidenData', () => {
      const mat017ItemWithWidenData = Mat017ItemMappers.fromMat017ItemToMat017ItemWithWidenData(
        mockMat017Item,
        5,
        'left'
      );

      const {
        id,
        matNumber,
        itemDescription1,
        itemDescription2,
        supplierItemNumber,
        itemStatus,
        amountDividedByPriceUnit,
        supplierId,
        mat017ItemGroup,
        modificationDate,
      } = mockMat017Item;

      expect(mat017ItemWithWidenData).toEqual({
        id,
        matNumber,
        itemDescription1,
        itemDescription2,
        supplierItemNumber,
        itemStatus,
        amountDividedByPriceUnit,
        mat017ItemGroup,
        supplierId,
        modificationDate,
        overrides: {
          amountDividedByPriceUnit,
          mat017ItemGroup,
        },
        quantity: 5,
        status: 'left',
      });
    });
  });

  describe('fromRedactedMat017ItemWithWidenDataToMat017ItemWithWidenData', () => {
    it('should correctly map RedactedMat017ItemWithWidenData to Mat017ItemWithWidenData', () => {
      const mat017ItemWithWidenData = Mat017ItemMappers.fromRedactedMat017ItemWithWidenDataToMat017ItemWithWidenData(
        mockRedactedMat017ItemWithWidenData,
        mockMat017Item
      );

      const {
        amountDividedByPriceUnit,
        mat017ItemGroup,
        itemDescription1,
        itemDescription2,
        supplierItemNumber,
        itemStatus,
      } = mockMat017Item;

      const { id, matNumber, quantity, status, overrides, photoUrl, score } = mat017ItemWithWidenData;

      expect(mat017ItemWithWidenData).toEqual({
        id,
        matNumber,
        itemDescription1,
        itemDescription2,
        supplierItemNumber,
        photoUrl,
        score,
        itemStatus,
        amountDividedByPriceUnit,
        mat017ItemGroup,
        overrides,
        quantity,
        status,
      });
    });
  });

  describe('fromRedactedMat017ItemWithWidenDataToMat017Item', () => {
    it('should correctly map RedactedMat017ItemWithWidenData to Mat017Item', () => {
      const mat017Item = Mat017ItemMappers.fromRedactedMat017ItemWithWidenDataToMat017Item(
        mockRedactedMat017ItemWithWidenData
      );
      const {
        id,
        overrides: {
          amountDividedByPriceUnit,
          mat017ItemGroup,
          supplierItemNumber,
          itemDescription1,
          itemDescription2,
          supplierId,
        },
        itemStatus,
        matNumber,
      } = mockRedactedMat017ItemWithWidenData;

      expect(mat017Item).toEqual({
        id,
        matNumber,
        amountDividedByPriceUnit,
        mat017ItemGroup,
        itemDescription1,
        itemDescription2,
        supplierItemNumber,
        supplierId,
        itemStatus,
      });
    });
  });

  describe('fromIerpMat017ItemUsageToMat017ImportUsage', () => {
    it('should correctly map IerpMat017ItemUsage to Mat017ImportUsage', () => {
      const ierpUsage = {
        partNumber: 'testPartNumber',
        bomId: 'testMat904Number',
        matNumber: 'testMat017Number',
      };

      const mappedUsage = Mat017ItemMappers.fromIerpMat017ItemUsageToMat017ImportUsage(ierpUsage);

      expect(mappedUsage).toEqual({
        matNumber: ierpUsage.matNumber,
        bomId: ierpUsage.bomId,
        chainFlexPartNumber: ierpUsage.partNumber,
      });
    });
  });

  describe('fromIerpMat017ItemToRawMat017ItemImportBaseData', () => {
    it('should correctly transform IerpMat017Item to RawMat017ItemImportBaseData', () => {
      const { matNumber, mat017ItemGroup, itemDescription1De, itemDescription2De } = mockIerpMat017Item;
      const expected = {
        matNumber,
        itemDescription1: itemDescription1De,
        itemDescription2: itemDescription2De,
        mat017ItemGroup,
      };

      const result = Mat017ItemMappers.fromIerpMat017ItemToRawMat017ItemImportBaseData(mockIerpMat017Item);

      expect(result).toEqual(expected);
    });
  });

  describe('fromIerpMat017ItemPriceToRawMat017ItemImportPrice', () => {
    it('should correctly transform IerpMat017ItemPrice to RawMat017ItemImportPrice', () => {
      const { matNumber, quantityAmount, priceUnit, amount, supplierItemNumber, supplierId } = mockIerpMat017ItemPrice;
      const expected = {
        matNumber,
        quantityAmount,
        priceUnit,
        amount,
        supplierItemNumber,
        supplierId,
      };

      const result = Mat017ItemMappers.fromIerpMat017ItemPriceToRawMat017ItemImportPrice(mockIerpMat017ItemPrice);

      expect(result).toEqual(expected);
    });
  });
});
