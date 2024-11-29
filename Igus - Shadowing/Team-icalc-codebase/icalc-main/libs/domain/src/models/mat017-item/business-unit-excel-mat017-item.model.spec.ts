import type { BusinessUnitExcelMat017Item } from './business-unit-excel-mat017-item.model';
import {
  BusinessUnitExcelMat017ItemModel,
  formatBusinessUnitExcelFloat,
  formatBusinessUnitExcelString,
  getPriceUnit,
} from './business-unit-excel-mat017-item.model';
import type { IerpMat017Item } from './ierp-mat017-item';

/* eslint-disable @typescript-eslint/naming-convention */
const buMat017Item: BusinessUnitExcelMat017Item = {
  Artikelnummer: 'MAT0170003',
  Artikelbezeichnung1: 'Schrumpfschlauch o. Kleber',
  Artikelbezeichnung2: 'schwarz 16,0 auf 8,0',
  Gruppe: 'RC-K8',
  BestellNr: '.',
  'Einkauf EUR': '75.30 €',
  Preiseinheit: 'H',
  Mengeneinheit: 'S',
  'Artikelbezeichnung1 Englisch': 'Shrink-on hose w/o adhesive black 16,0 to 8,0',
  'Artikelbezeichnung2 Englisch': 'black 16,0 to 8,0',
  'LetzteAktul.Epreis': ' ',
  Rabatt: '0',
  'Staffel 1': '100',
  'Preis 1 EUR': '70.00 €',
  'Staffel 2': '1000',
  'Preis 2 EUR': '50.00 €',
  Angebotsnummer: 'Hr. van Pol 13.12.07',
  Lieferant: '7954200',
  'Name Lieferant': 'WKK',
  Hauptlieferant: '',
  'GK-I-': '440900',
  'GK-A-': '412900',
  Dispo: 'B',
  'Karte-1-': 'KONFK',
  'Karte-2-': '1',
  Familie: '',
  Mindestbestand: '50',
  Losgröße: '50',
  Hersteller: '',
  Wiederbeschaffungszeit: '2',
  einmalig: '0',
  mehrmalig: '0',
  'Alternativart. 1': '',
  Ersteller: '',
  KürzelÜberarbeitung: '',
  'EK-Gruppe': '',
  'Vorgängerart.Nr.:': '',
  Verpackungsgröße: '',
  Konfliktmaterial: '',
  Zange: '',
  Werkzeug: '',
};

const buMat017ItemWithoutPrices: BusinessUnitExcelMat017Item = {
  ...buMat017Item,
  'Einkauf EUR': '0',
  'Staffel 1': '0',
  'Preis 1 EUR': '0',
  'Staffel 2': '0',
  'Preis 2 EUR': '0',
  Mengeneinheit: 'M',
};

const mockIerpMat017Item: IerpMat017Item = {
  matNumber: 'MAT0170003',
  mat017ItemGroup: 'RC-D6',
  itemDescription1De: 'Werkzeug',
  itemDescription2De: 'Dymo-Etiketten 54x25mm a 500St / 11352',
  itemDescription1En: '',
  itemDescription2En: '',
  unitId: 'Stk',
  prices: [
    {
      matNumber: 'MAT0170003',
      supplierItemNumber: 'DYMS0722520',
      supplierId: '7300388',
      priceUnit: 0,
      amount: 12.56,
      quantityAmount: 0,
      supplierName: 'TEST',
      discountPercentage1: 0,
    },
  ],
};

const mockIerpMat017ItemWithoutPrices: IerpMat017Item = {
  matNumber: 'MAT0170003',
  mat017ItemGroup: 'RC-K8',
  itemDescription1De: 'Schrumpfschlauch o. Kleber',
  itemDescription2De: 'schwarz 16,0 auf 8,0',
  itemDescription1En: '',
  itemDescription2En: '',
  unitId: 'Stk',
  prices: [],
};

describe('formatBusinessUnitExcelFloat', () => {
  it('should parse a basic float string', () => {
    expect(formatBusinessUnitExcelFloat('123.45')).toBe(123.45);
  });

  it('should handle strings with currency symbols and return a valid number', () => {
    expect(formatBusinessUnitExcelFloat('123.45 €')).toBe(123.45);
  });

  it('should convert European decimal notation to a float', () => {
    expect(formatBusinessUnitExcelFloat('1.234,56')).toBe(1234.56);
  });

  it('should remove additional non-numeric characters', () => {
    expect(formatBusinessUnitExcelFloat('1.234,56 EUR')).toBe(1234.56);
  });

  it('should return 0 for empty strings', () => {
    expect(formatBusinessUnitExcelFloat('')).toBe(0);
  });

  it('should return 0 for strings without digits', () => {
    expect(formatBusinessUnitExcelFloat('.')).toBe(0);
  });

  it('should handle strings with only commas', () => {
    expect(formatBusinessUnitExcelFloat(',')).toBe(0);
  });

  it('should handle numbers with misplaced commas', () => {
    expect(formatBusinessUnitExcelFloat('12,34.56')).toBe(1234.56);
  });

  it('should handle strings with spaces and non-numeric characters', () => {
    expect(formatBusinessUnitExcelFloat('  1 234,56  € ')).toBe(1234.56);
  });

  it('should parse a number with multiple commas correctly', () => {
    expect(formatBusinessUnitExcelFloat('1,234,567.89')).toBe(1234567.89);
  });

  it('should parse a number with comma as delimiter', () => {
    expect(formatBusinessUnitExcelFloat('1,45')).toBe(1.45);
  });

  it('should parse a number with comma as delimiter and non numeric characters', () => {
    expect(formatBusinessUnitExcelFloat('1,45€')).toBe(1.45);
  });
});

describe('formatBusinessUnitExcelString', () => {
  it('should not modify the string if it is shorter than 40 characters', () => {
    const input = 'Shrink-on hose';
    const expected = 'Shrink-on hose';

    expect(formatBusinessUnitExcelString(input)).toBe(expected);
  });

  it('should truncate the string to 40 characters if it is longer than 40', () => {
    const input = 'Shrink-on hose w/o adhesive black 16,0 to 8,0';
    const expected = 'Shrink-on hose w/o adhesive black 16,0 t';

    expect(formatBusinessUnitExcelString(input)).toBe(expected);
  });

  it('should trim leading and trailing whitespace from the string', () => {
    const input = '  This string has whitespace   ';
    const expected = 'This string has whitespace';

    expect(formatBusinessUnitExcelString(input)).toBe(expected);
  });

  it('should handle an empty string correctly', () => {
    const input = '';
    const expected = '';

    expect(formatBusinessUnitExcelString(input)).toBe(expected);
  });

  it('should not throw an error with null input', () => {
    const input = null;
    const action: () => void = () => formatBusinessUnitExcelString(input);

    expect(action).not.toThrow();
  });
});

describe('getPriceUnit', () => {
  it('should return 1000 for unit code "T"', () => {
    expect(getPriceUnit('T')).toBe(1000);
  });

  it('should return 100 for unit code "H"', () => {
    expect(getPriceUnit('H')).toBe(100);
  });

  it('should return 0 for unit code "M"', () => {
    expect(getPriceUnit('M')).toBe(0);
  });

  it('should return 0 for unit code "S"', () => {
    expect(getPriceUnit('S')).toBe(0);
  });

  it('should return 0 for unknown unit codes', () => {
    expect(getPriceUnit('X')).toBe(0);
  });

  it('should return 0 for an empty string', () => {
    expect(getPriceUnit('')).toBe(0);
  });
});

describe('BusinessUnitExcelMat017ItemModel', () => {
  it('should be able to correctly map mat017Item with prices to IerpMat017Item', () => {
    const itemModel = BusinessUnitExcelMat017ItemModel.create(buMat017Item);

    const ierpItem = itemModel.getAsIerpMat017Item();

    expect(ierpItem.matNumber).toEqual(buMat017Item.Artikelnummer);
    expect(ierpItem.unitId).toEqual('Stk');
    expect(ierpItem.itemDescription1De).toEqual(buMat017Item.Artikelbezeichnung1);
    expect(ierpItem.prices[0].amount).toEqual(formatBusinessUnitExcelFloat(buMat017Item['Einkauf EUR']));
    expect(ierpItem.prices[0].quantityAmount).toEqual(0);
    expect(ierpItem.prices[1].amount).toEqual(formatBusinessUnitExcelFloat(buMat017Item['Preis 1 EUR']));
    expect(ierpItem.prices[1].quantityAmount).toEqual(formatBusinessUnitExcelFloat(buMat017Item['Staffel 1']));
    expect(ierpItem.prices[2].amount).toEqual(formatBusinessUnitExcelFloat(buMat017Item['Preis 2 EUR']));
    expect(ierpItem.prices[2].quantityAmount).toEqual(formatBusinessUnitExcelFloat(buMat017Item['Staffel 2']));
  });

  it('should be able to correctly map mat017Item without prices to IerpMat017Item', () => {
    const itemModel = BusinessUnitExcelMat017ItemModel.create(buMat017ItemWithoutPrices);

    const ierpItem = itemModel.getAsIerpMat017Item();

    expect(ierpItem.matNumber).toEqual(buMat017ItemWithoutPrices.Artikelnummer);
    expect(ierpItem.unitId).toEqual('M');
    expect(ierpItem.itemDescription1De).toEqual(buMat017ItemWithoutPrices.Artikelbezeichnung1);
    expect(ierpItem.prices).toHaveLength(0);
  });

  it('should be able to compare mat017Item to IerpMat017Item and detect changes', () => {
    const itemModel = BusinessUnitExcelMat017ItemModel.create(buMat017Item);

    const comparisonResult = itemModel.compareToIerpMat017Item(mockIerpMat017Item);

    expect(comparisonResult.hasChanges).toBeTruthy();

    expect(comparisonResult.ierpMat017ItemBaseData).toEqual({
      matNumber: mockIerpMat017Item.matNumber,
      mat017ItemGroup: mockIerpMat017Item.mat017ItemGroup,
      itemDescription1: mockIerpMat017Item.itemDescription1De,
      itemDescription2: mockIerpMat017Item.itemDescription2De,
      supplierItemNumber: mockIerpMat017Item.prices[0].supplierItemNumber,
      supplierId: mockIerpMat017Item.prices[0].supplierId,
      priceUnit: mockIerpMat017Item.prices[0].priceUnit,
      amount: mockIerpMat017Item.prices[0].amount,
    });

    expect(comparisonResult.businessUnitExcelMat017ItemBaseData).toEqual({
      matNumber: buMat017Item.Artikelnummer,
      mat017ItemGroup: buMat017Item.Gruppe,
      itemDescription1: formatBusinessUnitExcelString(buMat017Item.Artikelbezeichnung1),
      itemDescription2: formatBusinessUnitExcelString(buMat017Item.Artikelbezeichnung2),
      supplierItemNumber: formatBusinessUnitExcelString(buMat017Item.BestellNr),
      supplierId: buMat017Item.Lieferant,
      priceUnit: getPriceUnit(buMat017Item.Preiseinheit),
      amount: formatBusinessUnitExcelFloat(buMat017Item['Einkauf EUR']),
    });

    expect(comparisonResult.diff).not.toEqual({});
  });

  it('should be able to compare to IerpMat017Item and detect no changes', () => {
    const itemModel = BusinessUnitExcelMat017ItemModel.create(buMat017ItemWithoutPrices);

    const comparisonResult = itemModel.compareToIerpMat017Item(mockIerpMat017ItemWithoutPrices);

    expect(comparisonResult.hasChanges).toBeFalsy();

    expect(comparisonResult.ierpMat017ItemBaseData).toEqual({
      matNumber: mockIerpMat017ItemWithoutPrices.matNumber,
      mat017ItemGroup: mockIerpMat017ItemWithoutPrices.mat017ItemGroup,
      itemDescription1: mockIerpMat017ItemWithoutPrices.itemDescription1De,
      itemDescription2: mockIerpMat017ItemWithoutPrices.itemDescription2De,
      supplierItemNumber: null,
      supplierId: null,
      priceUnit: null,
      amount: null,
    });

    expect(comparisonResult.businessUnitExcelMat017ItemBaseData).toEqual({
      matNumber: buMat017ItemWithoutPrices.Artikelnummer,
      mat017ItemGroup: buMat017ItemWithoutPrices.Gruppe,
      itemDescription1: formatBusinessUnitExcelString(buMat017ItemWithoutPrices.Artikelbezeichnung1),
      itemDescription2: formatBusinessUnitExcelString(buMat017ItemWithoutPrices.Artikelbezeichnung2),
      supplierItemNumber: null,
      supplierId: null,
      priceUnit: null,
      amount: null,
    });

    expect(comparisonResult.diff).toEqual({});
  });
});
