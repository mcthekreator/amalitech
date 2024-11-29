import { StringUtils } from '../../utils/string-utils';
import { MAT017_ITEM_MAT_NUMBER_VALIDATION_REGEX } from './../../constants';

export enum Mat017ItemStatus {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  removed = 'REMOVED',
}

export interface RemovedMat017ItemFormModel {
  configurationMatNumber: string;
  matNumber: string;
}

export interface Mat017ItemPickerModel {
  matNumber: string;
  itemDescription1: string;
  itemDescription2: string;
  mat017ItemGroup: string;
  supplierItemNumber: string;
}

export interface Mat017ItemCreationData {
  matNumber: string;
  itemDescription1: string;
  itemDescription2: string;
  mat017ItemGroup: string;
  supplierItemNumber: string;
  amount: number;
  priceUnit: Mat017ItemPriceUnitCharEnum;
  addToBomOnCreate: boolean;
}

export interface Mat017Item {
  id: string;
  matNumber: string;
  mat017ItemGroup: string;
  amountDividedByPriceUnit: number;
  itemStatus: Mat017ItemStatus;
  modificationDate?: Date;
  priceUnit?: number;
  amount?: number;
  itemDescription1?: string;
  itemDescription2?: string;
  supplierItemNumber?: string;
  supplierId?: string;
  manuallyCreated?: boolean;
}

export interface Mat017ItemSearchResult extends Omit<Mat017Item, 'priceUnit' | 'amount'> {
  score?: number;
}

export type MatNumber = string;

export interface RawMat017ItemImportBaseDataWithPrices {
  baseData: RawMat017ItemImportBaseData;
  prices: RawMat017ItemImportPrice[];
}

export interface RawMat017ItemImportBaseData {
  matNumber: MatNumber;
  itemDescription1?: string;
  itemDescription2?: string;
  mat017ItemGroup?: string;
}

export interface Mat017ItemImportBaseData {
  matNumber: MatNumber;
  itemDescription1: string | null;
  itemDescription2: string | null;
  mat017ItemGroup: string | null;
}

export interface RawMat017ItemImportPrice extends Omit<Mat017ItemImportPrice, 'amountDividedByPriceUnit'> {
  amountDividedByPriceUnit?: number;
}

export interface Mat017ItemImportPrice {
  matNumber: MatNumber;
  supplierItemNumber: string;
  supplierId: string;
  quantityAmount: number;
  priceUnit: number;
  amount: number;
  amountDividedByPriceUnit: number;
}

export interface Mat017ItemRequiredOverrides {
  amountDividedByPriceUnit: number;
  mat017ItemGroup: string;
}

export interface Mat017ItemOverrides extends Mat017ItemRequiredOverrides {
  itemDescription1?: string;
  itemDescription2?: string;
  supplierItemNumber?: string;
  supplierId?: string;
}

export interface Mat017ItemWithWidenData extends Mat017ItemSearchResult {
  quantity: number;
  status: string;
  overrides: Mat017ItemOverrides;
  photoUrl?: string;
  techDrawUrl?: string;
  pinAssUrl?: string;
  photoVersionId?: string;
  techDrawVersionId?: string;
  pinAssVersionId?: string;
}

export interface DeleteMat017TestItemWidenImageResponse {
  status: string;
  message: string;
  error?: string;
}

export type RedactedMat017ItemWithWidenData = Omit<Mat017ItemWithWidenData, keyof Mat017ItemOverrides>;

export interface ProcessedMat017Item {
  id: string;
  matNumber: string;
  amountDividedByPriceUnit: number;
  sellingPricePerUnit: number; // price multiplied by calculation factor
  sellingPrice: number; // sellingPricePerUnit multiplied by amount
  quantity: number;
}

export interface Mat017ItemsLatestModificationDate {
  latestModificationDate: Date;
}
export interface WidenData {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  total_count: number;
  items: WidenDataItem[];
}

export type WidenUploadProgress = 'verifying' | 'pending' | 'complete';

export interface WidenDataItem {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  version_id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_update_date: Date;
  metadata: {
    fields: {
      productid: string[];
      titleTag: string[];
    };
  };
  embeds: {
    [key: string]: WidenImage;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  status: { upload_progress: WidenUploadProgress };
}

export interface WidenImage {
  url: string;
  html: string;
  share: string;
}

export type WidenTitleTag = 'photo' | 'techDraw' | 'pinAss';

export enum WidenImagePrefix {
  photo = 'RCA_PROD_',
  technicalDrawing = 'RCA_TD_',
  pinAssignment = 'RCA_TD_pin_',
}

export const WIDEN_IMAGE_SUFFIX = '_low_quality';
export const WIDEN_EMBED_FORMAT = '1040*570(free)';

export interface WidenUploadImage {
  file: File;
  matNumber: string;
  filename: string;
  description: string;
  titleTag: WidenTitleTag;
}

export enum Mat017ItemPriceUnitCharEnum {
  s = 'S',
  m = 'M',
  h = 'H',
  t = 'T',
}

export class Mat017ItemMatNumber {
  private parsedValue: string;

  private constructor(private rawValue: string) {
    this.parseValue();
  }

  public get value(): string {
    return this.parsedValue;
  }

  public static create(rawValue: string): Mat017ItemMatNumber {
    return new Mat017ItemMatNumber(rawValue);
  }

  public isValid(): boolean {
    return MAT017_ITEM_MAT_NUMBER_VALIDATION_REGEX.test(this.parsedValue);
  }

  private parseValue(): void {
    this.parsedValue = StringUtils.removeTabsAndSpacesFromString(StringUtils.coerceString(this.rawValue)).toUpperCase();
  }
}
