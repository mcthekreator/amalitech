import type { TranslateService } from '@ngx-translate/core';
import { CreateMat017ItemsService } from './create-mat017-items-service';
import { of } from 'rxjs';
import type { Mat017ItemCreationData } from '@igus/icalc-domain';
import { ICALC_MAT017_ITEM_MANUAL_CREATION_HARD_LIMIT } from '@igus/icalc-domain';

const rowWithExcessData = `MAT01756490\tKabelschuh: Rohrkabelschuh\tM10 Ø: 10,5mm 25mm2 Klemmverbindung\tRC-K1\t2805-BM00643\t1.07 €\tS\tS\ttubular cable lug\tM10; Ø: 10,5mm; 25mm2; clamp connection\t4/13/2023\t0\t0\t0.00\t0\t0.00\tOnline\t7530231\tMercateo AG\t*\t440900\t412900\tB\tKONFK\t1\t\t\t1\tKlauke\t1\t0\t0\t\tTGE\t\t\t\t\t\t\t\t\t\t`;
const rowWithCompleteValidData = `MAT01756486\tKennzeichnungsschild\tSauerstoff ( Nutzleistung 50w )\tRC-B1\t466.1040.0210\t3.00 €\tS`;
const rowWithCompleteValidData2 = `MAT01756499\tKabelschuh: Rohrkabelschuh\tSauerstoff ( Nutzleistung 50w )\tRC-B1\t466.1040.0210\t3.00 €\tS`;
const rowWithIncompleteData = `MAT01756486\tKennzeichnungsschild\tSauerstoff ( Nutzleistung 50w )\tRC-B1`;
const rowWithExcessDataExpectedResponse = {
  addToBomOnCreate: false,
  amount: 1.07,
  itemDescription1: 'Kabelschuh: Rohrkabelschuh',
  itemDescription2: 'M10 Ø: 10,5mm 25mm2 Klemmverbindung',
  mat017ItemGroup: 'RC-K1',
  matNumber: 'MAT01756490',
  priceUnit: 'S',
  supplierItemNumber: '2805-BM00643',
};
const rowWithCompleteValidDataExpectedResponse = {
  addToBomOnCreate: false,
  amount: 3,
  itemDescription1: 'Kennzeichnungsschild',
  itemDescription2: 'Sauerstoff ( Nutzleistung 50w )',
  mat017ItemGroup: 'RC-B1',
  matNumber: 'MAT01756486',
  priceUnit: 'S',
  supplierItemNumber: '466.1040.0210',
};
const rowWithCompleteValidData2ExpectedResponse = {
  addToBomOnCreate: false,
  amount: 3,
  itemDescription1: 'Kabelschuh: Rohrkabelschuh',
  itemDescription2: 'Sauerstoff ( Nutzleistung 50w )',
  mat017ItemGroup: 'RC-B1',
  matNumber: 'MAT01756499',
  priceUnit: 'S',
  supplierItemNumber: '466.1040.0210',
};

const multiplyRows = (str: string, num: number): string => `${str}\n`.repeat(num);

const multipleValidRowsData = `${rowWithExcessData}\n${rowWithCompleteValidData}\n${rowWithCompleteValidData2}`;
const multipleRowWithInvalidRow = `${rowWithIncompleteData}\n${rowWithCompleteValidData}\n${rowWithCompleteValidData2}`;
const dataInExcessOfFiftyRows = multiplyRows(multipleValidRowsData, 20);

const multipleValidRowsDataExpectedResponse = [
  rowWithExcessDataExpectedResponse,
  rowWithCompleteValidDataExpectedResponse,
  rowWithCompleteValidData2ExpectedResponse,
];

const sampleModelDataKeys: (keyof Mat017ItemCreationData)[] = [
  'matNumber',
  'itemDescription1',
  'itemDescription2',
  'mat017ItemGroup',
  'supplierItemNumber',
  'amount',
  'priceUnit',
  'addToBomOnCreate',
];

describe('CreateMat017ItemsService', () => {
  let service: CreateMat017ItemsService;

  beforeEach(() => {
    const mockTranslateService = { instant: jest.fn() } as unknown as TranslateService;

    service = new CreateMat017ItemsService(mockTranslateService);
    service.nextErrorMessage = jest.fn().mockReturnValue(of('message'));
  });
  describe('parsing tsv data into valid mat017Item data', () => {
    it('should throw a validation error if pasted data contains inadequate columns', () => {
      service.parsePastedData(rowWithIncompleteData, sampleModelDataKeys);

      expect(service.nextErrorMessage).toHaveBeenCalled();
    });

    it('should slice only the required columns if the columns pasted are more than required', () => {
      const response = service.parsePastedData(rowWithExcessData, sampleModelDataKeys);

      expect(response[0]).toEqual(rowWithExcessDataExpectedResponse);
      expect(Array.isArray(response)).toBe(true);
    });

    it('should parse the data if the exact number of columns are passed', () => {
      const response = service.parsePastedData(rowWithCompleteValidData, sampleModelDataKeys);

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(1);
      expect(response[0]).toEqual(rowWithCompleteValidDataExpectedResponse);
    });

    it('should transform the purchase price into a number and truncate the currency symbol', () => {
      const response = service.parsePastedData(
        rowWithCompleteValidData,
        sampleModelDataKeys
      ) as Mat017ItemCreationData[];

      expect(response).toBeTruthy();
      expect(Number.isNaN(response[0].amount)).toBe(false);
      expect(response[0].amount).toStrictEqual(3);
    });

    it('should parse the data if multiple valid rows are passed', () => {
      const response = service.parsePastedData(multipleValidRowsData, sampleModelDataKeys);

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(multipleValidRowsDataExpectedResponse.length);
      expect(response).toEqual(multipleValidRowsDataExpectedResponse);
    });

    it('should throw an error if multiple passed rows contain an invalid row', () => {
      service.parsePastedData(multipleRowWithInvalidRow, sampleModelDataKeys);

      expect(service.nextErrorMessage).toHaveBeenCalled();
    });

    it('should return 50 rows if even more than fifty rows are passed', () => {
      const response = service.parsePastedData(dataInExcessOfFiftyRows, sampleModelDataKeys);

      expect(response.length).toStrictEqual(ICALC_MAT017_ITEM_MANUAL_CREATION_HARD_LIMIT);
    });
  });
});
