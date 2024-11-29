import type {
  Mat017Item,
  Mat017ItemWithWidenData,
  RedactedMat017ItemWithWidenData,
  RawMat017ItemImportBaseData,
  RawMat017ItemImportPrice,
} from './mat017-item.model';
import { ObjectUtils } from '../../utils';
import type { IerpMat017Item, IerpMat017ItemUsage, IerpMat017ItemPrice } from './ierp-mat017-item';
import type { Mat017ImportUsage } from './mat017-item-usage.model';

export class Mat017ItemMappers {
  public static fromMat017ItemToMat017ItemWithWidenData(
    mat017Item: Mat017Item,
    quantity: number,
    status: 'left' | 'right'
  ): Mat017ItemWithWidenData {
    const {
      id,
      matNumber,
      itemDescription1,
      itemDescription2,
      mat017ItemGroup,
      supplierItemNumber,
      amountDividedByPriceUnit,
      supplierId,
      itemStatus,
      modificationDate,
    } = ObjectUtils.omitKeys(mat017Item, ['amount', 'priceUnit']) as Omit<Mat017Item, 'amount' | 'priceUnit'>;

    return {
      id,
      matNumber,
      itemDescription1,
      itemDescription2,
      supplierItemNumber,
      supplierId,
      itemStatus,
      modificationDate,
      amountDividedByPriceUnit,
      mat017ItemGroup,
      overrides: {
        amountDividedByPriceUnit,
        mat017ItemGroup,
      },
      quantity,
      status,
    };
  }

  public static fromRedactedMat017ItemWithWidenDataToMat017ItemWithWidenData(
    item: RedactedMat017ItemWithWidenData,
    mat017ItemBaseData: Mat017Item
  ): Mat017ItemWithWidenData {
    const {
      amountDividedByPriceUnit,
      mat017ItemGroup,
      itemDescription1,
      itemDescription2,
      supplierItemNumber,
      itemStatus,
    } = mat017ItemBaseData;

    return {
      ...item,
      amountDividedByPriceUnit,
      mat017ItemGroup,
      itemDescription1,
      itemDescription2,
      supplierItemNumber,
      itemStatus,
    };
  }

  public static fromRedactedMat017ItemWithWidenDataToMat017Item(item: RedactedMat017ItemWithWidenData): Mat017Item {
    const {
      id,
      overrides: {
        amountDividedByPriceUnit,
        mat017ItemGroup,
        itemDescription1,
        itemDescription2,
        supplierItemNumber,
        supplierId,
      },
      itemStatus,
      matNumber,
    } = item;

    return {
      id,
      matNumber,
      amountDividedByPriceUnit,
      mat017ItemGroup,
      itemDescription1,
      itemDescription2,
      supplierItemNumber,
      itemStatus,
      supplierId,
    } as Mat017Item;
  }

  public static fromIerpMat017ItemToRawMat017ItemImportBaseData(ierpItem: IerpMat017Item): RawMat017ItemImportBaseData {
    return {
      matNumber: ierpItem.matNumber,
      itemDescription1: ierpItem.itemDescription1De,
      itemDescription2: ierpItem.itemDescription2De,
      mat017ItemGroup: ierpItem.mat017ItemGroup,
    };
  }

  public static fromIerpMat017ItemPriceToRawMat017ItemImportPrice(
    price: IerpMat017ItemPrice
  ): RawMat017ItemImportPrice {
    return {
      matNumber: price.matNumber,
      supplierItemNumber: price.supplierItemNumber,
      supplierId: price.supplierId,
      quantityAmount: price.quantityAmount,
      amount: price.amount,
      priceUnit: price.priceUnit,
    };
  }

  public static fromIerpMat017ItemUsageToMat017ImportUsage(ierpUsage: IerpMat017ItemUsage): Mat017ImportUsage {
    return {
      matNumber: ierpUsage.matNumber,
      chainFlexPartNumber: ierpUsage.partNumber,
      bomId: ierpUsage.bomId,
    };
  }
}
