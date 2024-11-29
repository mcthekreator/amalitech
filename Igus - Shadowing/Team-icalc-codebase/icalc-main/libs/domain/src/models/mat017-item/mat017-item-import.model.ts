import { NumberUtils } from '../../utils/number-utils';
import { StringUtils } from '../../utils/string-utils';
import {
  Mat017ItemImportBaseDataValidationFailureReason,
  Mat017ItemImportPriceValidationFailureReason,
} from '../validation';
import type {
  Mat017Item,
  Mat017ItemImportBaseData,
  Mat017ItemImportPrice,
  MatNumber,
  RawMat017ItemImportBaseData,
  RawMat017ItemImportPrice,
} from './mat017-item.model';
import { Mat017ItemStatus } from './mat017-item.model';

export class Mat017ItemImportModel {
  private baseDataValidationResult: Mat017ItemImportBaseDataValidationFailureReason[] = [];
  private priceValidationResult: Mat017ItemImportPriceValidationFailureReason[] = [];
  private importBaseData: Mat017ItemImportBaseData;

  private constructor(
    importBaseData?: RawMat017ItemImportBaseData,
    private importPrice?: RawMat017ItemImportPrice,
    private existingItem?: Mat017Item
  ) {
    if (importBaseData) {
      this.importBaseData = this.prepareBaseData(importBaseData);
      this.baseDataValidationResult = this.validateBaseData(this.importBaseData);
    }

    this.priceValidationResult = this.validatePrice(importPrice);

    if (importPrice) {
      this.importPrice = this.preparePrice(importPrice);
    }
  }

  public static fromBaseData(baseData: RawMat017ItemImportBaseData): Mat017ItemImportModel {
    return new this(baseData, undefined, undefined);
  }

  public static fromPrice(price: RawMat017ItemImportPrice): Mat017ItemImportModel {
    return new this(undefined, price, undefined);
  }

  public static fromExistingItem(existingItem: Mat017Item): Mat017ItemImportModel {
    return new this(undefined, undefined, existingItem);
  }

  public hasBaseData(): boolean {
    return !!this.importBaseData;
  }

  public hasPrice(): boolean {
    return !!this.importPrice;
  }

  public hasExistingItem(): boolean {
    return !!this.existingItem;
  }

  public hasChanges(): boolean {
    if (this.hasExistingItem()) {
      if (this.existingItem?.itemStatus !== this.getItemStatus()) {
        return true;
      }

      if (this.hasBaseData()) {
        if (
          this.existingItem?.itemDescription1 !== this.importBaseData?.itemDescription1 ||
          this.existingItem?.itemDescription2 !== this.importBaseData?.itemDescription2 ||
          this.existingItem?.mat017ItemGroup !== this.importBaseData?.mat017ItemGroup
        ) {
          return true;
        }
      }

      if (this.hasPrice()) {
        const existingItem = this.existingItem as Mat017Item;
        const importPrice = this.importPrice as Mat017ItemImportPrice;

        if (
          existingItem.supplierItemNumber !== importPrice.supplierItemNumber ||
          existingItem.supplierId !== importPrice.supplierId ||
          !NumberUtils.areFloatsEqual(existingItem.priceUnit as number, importPrice.priceUnit) ||
          !NumberUtils.areFloatsEqual(existingItem.amount as number, importPrice.amount)
        ) {
          return true;
        }
      } else {
        // no price available
        return (
          this.existingItem?.priceUnit !== null ||
          this.existingItem?.amount !== null ||
          this.existingItem?.amountDividedByPriceUnit !== null
        );
      }
    }

    return false;
  }

  public isUpdateCandidate(): boolean {
    return this.hasBaseData() && this.hasExistingItem() && (this.hasChanges() || !!this.existingItem?.manuallyCreated);
  }

  public isCreationCandidate(): boolean {
    return this.hasBaseData() && !this.hasExistingItem();
  }

  public isRemovalCandidate(): boolean {
    return (
      !this.hasBaseData() &&
      this.hasExistingItem() &&
      this.existingItem?.itemStatus !== Mat017ItemStatus.removed &&
      !this.existingItem?.manuallyCreated
    );
  }

  public getAsDbEntity(): Mat017Item {
    return {
      id: this.existingItem?.id,
      matNumber: this.getMatNumber(),
      itemDescription1: this.importBaseData?.itemDescription1,
      itemDescription2: this.importBaseData?.itemDescription2,
      mat017ItemGroup: this.importBaseData?.mat017ItemGroup,
      supplierItemNumber: this.hasPrice() ? this.importPrice?.supplierItemNumber : null,
      supplierId: this.hasPrice() ? this.importPrice?.supplierId : null,
      priceUnit: this.hasPrice() ? this.importPrice?.priceUnit : null,
      amount: this.hasPrice() ? this.importPrice?.amount : null,
      amountDividedByPriceUnit: this.hasPrice() ? this.importPrice?.amountDividedByPriceUnit : null,
      itemStatus: this.getItemStatus(),
      manuallyCreated: false,
    } as Mat017Item;
  }

  public setBaseData(baseData: RawMat017ItemImportBaseData): void {
    if (baseData.matNumber !== this.getMatNumber()) {
      throw Error('matNumber mismatch');
    }
    this.importBaseData = this.prepareBaseData(baseData);
    this.baseDataValidationResult = this.validateBaseData(this.importBaseData);
  }

  public setPrice(price: RawMat017ItemImportPrice): void {
    if (price.matNumber !== this.getMatNumber()) {
      throw Error('matNumber mismatch');
    }
    this.importPrice = this.preparePrice(price);
    this.priceValidationResult = this.validatePrice(price);
  }

  public setExistingItem(existingItem: Mat017Item): void {
    if (existingItem.matNumber !== this.getMatNumber()) {
      throw Error('matNumber mismatch');
    }
    this.existingItem = existingItem;
  }

  public getMatNumber(): MatNumber | undefined {
    if (this.importBaseData) {
      return this.importBaseData.matNumber;
    } else if (this.importPrice) {
      return this.importPrice.matNumber;
    } else {
      return this.existingItem?.matNumber;
    }
  }

  public getDbId(): string {
    return this.existingItem?.id as string;
  }

  public getItemStatus(): Mat017ItemStatus {
    if (this.baseDataValidationResult?.length > 0 || this.priceValidationResult?.length > 0) {
      return Mat017ItemStatus.inactive;
    }

    return Mat017ItemStatus.active;
  }

  public hasBaseDataValidationFailureReason(reason: Mat017ItemImportBaseDataValidationFailureReason): boolean {
    return this.baseDataValidationResult.includes(reason);
  }

  public hasPriceValidationFailureReason(reason: Mat017ItemImportPriceValidationFailureReason): boolean {
    return this.priceValidationResult.includes(reason);
  }

  private validateBaseData(baseData: Mat017ItemImportBaseData): Mat017ItemImportBaseDataValidationFailureReason[] {
    const result = [];

    if (!baseData.itemDescription1) {
      result.push(Mat017ItemImportBaseDataValidationFailureReason.itemDescription1);
    }
    if (!baseData.mat017ItemGroup) {
      result.push(Mat017ItemImportBaseDataValidationFailureReason.mat017ItemGroup);
    }

    return result;
  }

  private validatePrice(price: RawMat017ItemImportPrice | undefined): Mat017ItemImportPriceValidationFailureReason[] {
    const result = [];

    if (!this.hasPrice() || (!price?.priceUnit && !NumberUtils.areFloatsEqual(price?.priceUnit as number, 0))) {
      result.push(Mat017ItemImportPriceValidationFailureReason.priceUnit);
    }
    if (!this.hasPrice() || !price?.amount) {
      result.push(Mat017ItemImportPriceValidationFailureReason.amount);
    }

    return result;
  }

  private prepareBaseData(baseData: RawMat017ItemImportBaseData): Mat017ItemImportBaseData {
    return {
      matNumber: baseData.matNumber,
      itemDescription1: this.prepareImportedStringValue(baseData.itemDescription1),
      itemDescription2: this.prepareImportedStringValue(baseData.itemDescription2),
      mat017ItemGroup: this.prepareImportedStringValue(baseData.mat017ItemGroup),
    };
  }

  private preparePrice(price: RawMat017ItemImportPrice): Mat017ItemImportPrice {
    return {
      ...price,
      supplierItemNumber: this.prepareImportedStringValue(price.supplierItemNumber),
      supplierId: this.prepareImportedStringValue(price.supplierId),
      priceUnit: price.priceUnit === undefined ? null : price.priceUnit,
      amount: price.amount === undefined ? null : price.amount,
      amountDividedByPriceUnit: this.prepareAmountDividedByPriceUnit(price.amount, price.priceUnit),
    } as Mat017ItemImportPrice;
  }

  private prepareAmountDividedByPriceUnit(amount: number, priceUnit: number): number | null {
    const price = this.divideAmountByPriceUnit(amount, priceUnit);

    if (!price || price <= 0) {
      return null;
    }

    return price < 0.01 ? 0.01 : NumberUtils.round(price);
  }

  private divideAmountByPriceUnit(amount: number, priceUnit: number): number {
    return amount / (NumberUtils.areFloatsEqual(priceUnit, 0) ? 1 : priceUnit);
  }

  private prepareImportedStringValue(value?: string): string | null {
    const coercedValue = StringUtils.coerceToNullIfEmpty(value);

    return StringUtils.coerceToNullIfContainsNullString(coercedValue);
  }
}

export class Mat017ItemImportModelCollection {
  private importModelMap: Map<MatNumber, Mat017ItemImportModel> = new Map();

  public getItemCount(): number {
    return this.importModelMap.size;
  }

  public getBaseDataCount(): number {
    return this.getImportModelArray().filter((importModel) => importModel.hasBaseData()).length;
  }

  public getPricesCount(): number {
    return this.getImportModelArray().filter((importModel) => importModel.hasPrice()).length;
  }

  public getExistingItemCount(): number {
    return this.getImportModelArray().filter((importModel) => importModel.hasExistingItem()).length;
  }

  // useful for debugging purposes
  public getImportModel(matNumber: MatNumber): Mat017ItemImportModel | undefined {
    return this.importModelMap.get(matNumber);
  }

  public getImportModelArray(): Mat017ItemImportModel[] {
    return [...this.importModelMap.values()];
  }

  public getMat017ItemImportBaseDataValidationFailureReasonCount(
    reason: Mat017ItemImportBaseDataValidationFailureReason
  ): number {
    return this.getImportModelArray().filter(
      (importModel) =>
        (importModel.isUpdateCandidate() || importModel.isCreationCandidate()) &&
        importModel.hasBaseDataValidationFailureReason(reason)
    ).length;
  }

  public getMat017ItemImportPriceValidationFailureReasonCount(
    reason: Mat017ItemImportPriceValidationFailureReason
  ): number {
    return this.getImportModelArray().filter(
      (importModel) =>
        (importModel.isUpdateCandidate() || importModel.isCreationCandidate()) &&
        importModel.hasPriceValidationFailureReason(reason)
    ).length;
  }

  public getNewInvalidItemCount(): number {
    return this.getImportModelArray().filter(
      (importModel) =>
        (importModel.isUpdateCandidate() || importModel.isCreationCandidate()) &&
        importModel.getItemStatus() === Mat017ItemStatus.inactive
    ).length;
  }

  public getUpdateCandidates(): Mat017Item[] {
    return this.getImportModelArray()
      .filter((importModel) => importModel.isUpdateCandidate())
      .map((importModel) => importModel.getAsDbEntity());
  }

  public getCreationCandidates(): Mat017Item[] {
    return this.getImportModelArray()
      .filter((importModel) => importModel.isCreationCandidate())
      .map((importModel) => importModel.getAsDbEntity());
  }

  public getRemovalCandidates(): string[] {
    return this.getImportModelArray()
      .filter((importModel) => importModel.isRemovalCandidate())
      .map((importModel) => importModel.getDbId());
  }

  public addBaseData(baseData: RawMat017ItemImportBaseData): void {
    if (this.importModelMap.has(baseData.matNumber)) {
      this.importModelMap.get(baseData.matNumber)?.setBaseData(baseData);
    } else {
      this.importModelMap.set(baseData.matNumber, Mat017ItemImportModel.fromBaseData(baseData));
    }
  }

  public addPrice(price: RawMat017ItemImportPrice): void {
    if (this.importModelMap.has(price.matNumber)) {
      this.importModelMap.get(price.matNumber)?.setPrice(price);
    } else {
      this.importModelMap.set(price.matNumber, Mat017ItemImportModel.fromPrice(price));
    }
  }

  public addExistingItem(existingItem: Mat017Item): void {
    if (this.importModelMap.has(existingItem.matNumber)) {
      this.importModelMap.get(existingItem.matNumber)?.setExistingItem(existingItem);
    } else {
      this.importModelMap.set(existingItem.matNumber, Mat017ItemImportModel.fromExistingItem(existingItem));
    }
  }
}
