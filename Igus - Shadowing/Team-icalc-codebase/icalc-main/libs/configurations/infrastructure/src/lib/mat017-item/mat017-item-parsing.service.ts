import { BusinessUnitExcelMat017ItemModel, NumberUtils, businessUnitExcelKeys } from '@igus/icalc-domain';
import type {
  Mat017ItemImportBaseData,
  Mat017ItemImportPrice,
  Mat017ImportUsage,
  RawMat017ItemImportBaseData,
  BusinessUnitExcelMat017Item,
} from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { Mat017InfrastructureModuleLogger } from './logger.service';

@Injectable()
export class Mat017ItemParsingService {
  private readonly baseDataCsvPath = '../../../apps/data-import/csv-files/MAT017_item_base_data.csv';
  private readonly pricesCsvPath = '../../../apps/data-import/csv-files/MAT017_item_prices.csv';
  private readonly usagesCsvPath = '../../../apps/data-import/csv-files/MAT017_item_usages.csv';
  // needs to be downloaded from sharepoint and added locally
  private readonly businessUnitExcelCsvPath = '../../../apps/data-import/csv-files/MAT017_item_bu_excel.csv';

  constructor(private logger: Mat017InfrastructureModuleLogger) {
    this.logger.setContext('Mat017ItemParsingService');
  }

  public async parseAndPrepareBaseData(): Promise<RawMat017ItemImportBaseData[]> {
    const parsedBaseData = await this.parseBaseData();

    return this.prepareUniqueBaseDataArray(parsedBaseData);
  }

  public async parseAndPreparePrices(): Promise<Mat017ItemImportPrice[]> {
    const parsedPrices = await this.parsePrices();

    return this.prepareCorrespondingPricesArray(parsedPrices);
  }

  public async parseAndPrepareBusinessUnitExcelMat017Items(): Promise<Map<string, BusinessUnitExcelMat017ItemModel>> {
    const parsedBusinessUnitExcelMat017Items = await this.parseBusinessUnitExcel();

    return this.prepareBusinessUnitExcelMat017Items(parsedBusinessUnitExcelMat017Items);
  }

  public async parseBusinessUnitExcel(): Promise<BusinessUnitExcelMat017Item[]> {
    return this.parseCsvFile<BusinessUnitExcelMat017Item>(this.businessUnitExcelCsvPath, businessUnitExcelKeys, ';');
  }

  public async parseUsages(): Promise<Mat017ImportUsage[]> {
    const usagesColumns = ['chainFlexPartNumber', 'bomId', 'matNumber'];

    return this.parseCsvFile<Mat017ImportUsage>(this.usagesCsvPath, usagesColumns, ';');
  }

  private async parseBaseData(): Promise<RawMat017ItemImportBaseData[]> {
    const baseDataColumns = ['matNumber', 'itemDescription1', 'itemDescription2', 'mat017ItemGroup'];

    return this.parseCsvFile<Mat017ItemImportBaseData>(this.baseDataCsvPath, baseDataColumns, ';');
  }

  private async parsePrices(): Promise<Mat017ItemImportPrice[]> {
    const pricesColumns = ['matNumber', 'supplierItemNumber', 'supplierId', 'quantityAmount', 'priceUnit', 'amount'];

    return this.parseCsvFile<Mat017ItemImportPrice>(this.pricesCsvPath, pricesColumns, ';');
  }

  private async parseCsvFile<
    T extends Mat017ItemImportBaseData | Mat017ItemImportPrice | Mat017ImportUsage | BusinessUnitExcelMat017Item,
  >(inputCsvPath: string, columns: string[], delimiter: string): Promise<T[]> {
    const parsedItems: T[] = [];
    const parser = fs.createReadStream(path.join(__dirname, inputCsvPath)).pipe(parse({ columns, delimiter }));

    parser.on('readable', () => {
      let item: T;

      while ((item = parser.read()) !== null) {
        parsedItems.push(item);
      }
    });
    await finished(parser);

    parsedItems.splice(0, 1); // remove 'headers/columns' element

    return parsedItems;
  }

  private prepareBusinessUnitExcelMat017Items(
    items: BusinessUnitExcelMat017Item[]
  ): Map<string, BusinessUnitExcelMat017ItemModel> {
    return items.reduce((acc: Map<string, BusinessUnitExcelMat017ItemModel>, item: BusinessUnitExcelMat017Item) => {
      if (item.Hauptlieferant !== '*') return acc;
      if (!acc.get(item['Artikelnummer'])) {
        acc.set(item['Artikelnummer'], BusinessUnitExcelMat017ItemModel.create(item));
      }
      return acc;
    }, new Map());
  }

  private prepareUniqueBaseDataArray(baseData: RawMat017ItemImportBaseData[]): Mat017ItemImportBaseData[] {
    const duplicates = [];
    const map = baseData.reduce((mapAcc, importedBaseData) => {
      const baseDataFromMap = mapAcc.get(importedBaseData.matNumber);

      if (!baseDataFromMap) {
        mapAcc.set(importedBaseData.matNumber, importedBaseData);
      } else {
        duplicates.push(importedBaseData);
      }

      return mapAcc;
    }, new Map());

    this.logger.log(`base data duplicates: ${duplicates.length}`);

    return [...map.values()];
  }

  private prepareCorrespondingPricesArray(prices: Mat017ItemImportPrice[]): Mat017ItemImportPrice[] {
    const sortedPrices = prices.sort(
      // ascending by matNUmmer, ascending by quantity amount (not filtered out since it might be used in the future for "staggered prices")
      (a, b) => a.matNumber.localeCompare(b.matNumber) || a.quantityAmount - b.quantityAmount
    );

    const duplicates = [];
    const map = sortedPrices.reduce((mapAcc, importedPrice) => {
      const priceFromMap = mapAcc.get(importedPrice.matNumber);
      const validQuantityAmount = NumberUtils.areFloatsEqual(importedPrice.quantityAmount, 0);

      if (!priceFromMap && validQuantityAmount) {
        mapAcc.set(importedPrice.matNumber, importedPrice);
      } else if (validQuantityAmount) {
        duplicates.push(importedPrice);
      }

      return mapAcc;
    }, new Map());

    this.logger.log(`price duplicates with relevant quantityAmount: ${duplicates.length}`);

    return [...map.values()];
  }
}
