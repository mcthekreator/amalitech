import { diff } from 'deep-object-diff';
import { NumberUtils } from '../../utils/number-utils';
import type { IerpMat017Item, IerpMat017ItemPrice, UnitId } from './ierp-mat017-item';
import type { Mat017Item } from './mat017-item.model';
import { ObjectUtils } from '../../utils/object-utils';

/* eslint-disable @typescript-eslint/naming-convention */
export interface BusinessUnitExcelMat017Item {
  Artikelnummer: string;
  Artikelbezeichnung1: string;
  Artikelbezeichnung2: string;
  Gruppe: string;
  BestellNr: string;
  'Einkauf EUR': string;
  Preiseinheit: string;
  Mengeneinheit: 'S' | 'M';
  'Artikelbezeichnung1 Englisch': string;
  'Artikelbezeichnung2 Englisch': string;
  'LetzteAktul.Epreis': string;
  Rabatt: string;
  'Staffel 1': string;
  'Preis 1 EUR': string;
  'Staffel 2': string;
  'Preis 2 EUR': string;
  Angebotsnummer: string;
  Lieferant: string;
  'Name Lieferant': string;
  Hauptlieferant: string;
  'GK-I-': string;
  'GK-A-': string;
  Dispo: string;
  'Karte-1-': string;
  'Karte-2-': string;
  Familie: string;
  Mindestbestand: string;
  Losgröße: string;
  Hersteller: string;
  Wiederbeschaffungszeit: string;
  einmalig: string;
  mehrmalig: string;
  'Alternativart. 1': string;
  Ersteller: string;
  KürzelÜberarbeitung: string;
  'EK-Gruppe': string;
  'Vorgängerart.Nr.:': string;
  Verpackungsgröße: string;
  Konfliktmaterial: string;
  Zange: string;
  Werkzeug: string;
}
export const businessUnitExcelKeys = [
  'Artikelnummer',
  'Artikelbezeichnung1',
  'Artikelbezeichnung2',
  'Gruppe',
  'BestellNr',
  'Einkauf EUR',
  'Preiseinheit',
  'Mengeneinheit',
  'Artikelbezeichnung1 Englisch',
  'Artikelbezeichnung2 Englisch',
  'LetzteAktul.Epreis',
  'Rabatt',
  'Staffel 1',
  'Preis 1 EUR',
  'Staffel 2',
  'Preis 2 EUR',
  'Angebotsnummer',
  'Lieferant',
  'Name Lieferant',
  'Hauptlieferant',
  'GK-I-',
  'GK-A-',
  'Dispo',
  'Karte-1-',
  'Karte-2-',
  'Familie',
  'Mindestbestand',
  'Losgröße',
  'Hersteller',
  'Wiederbeschaffungszeit',
  'einmalig',
  'mehrmalig',
  'Alternativart. 1',
  'Ersteller',
  'KürzelÜberarbeitung',
  'EK-Gruppe',
  'Vorgängerart.Nr.:',
  'Verpackungsgröße',
  'Konfliktmaterial',
  'Zange',
  'Werkzeug',
];

export type BusinessUnitExcelMat017ItemBaseData = Omit<Mat017Item, 'id' | 'amountDividedByPriceUnit' | 'itemStatus'>;

export interface IerpMat017ItemToBusinessUnitExcelComparisonResult {
  businessUnitExcelMat017ItemBaseData: BusinessUnitExcelMat017ItemBaseData;
  ierpMat017ItemBaseData: BusinessUnitExcelMat017ItemBaseData;
  diff: Partial<BusinessUnitExcelMat017ItemBaseData>;
  hasChanges: boolean;
}

export const formatBusinessUnitExcelFloat = (input: string): number => {
  if (!input) return 0;

  // remove all non-numeric characters except commas and periods
  let numericPart = input.replace(/[^0-9,.]/g, '');

  if (!numericPart) return 0;

  // treat comma as decimal separator if there are commas but no periods
  if (/,/.test(numericPart) && !/\./.test(numericPart)) {
    numericPart = numericPart.replace(/,/g, '.');
    return parseFloat(numericPart) || 0;
  }

  // if only periods are present, no replacement is needed
  if (/\./.test(numericPart) && !/,/.test(numericPart)) {
    return parseFloat(numericPart) || 0;
  }

  const lastCommaIndex = numericPart.lastIndexOf(',');
  const lastPeriodIndex = numericPart.lastIndexOf('.');

  if (lastCommaIndex > lastPeriodIndex) {
    // if the last comma is after the last period, treat comma as the decimal separator
    numericPart = numericPart.replace(/\./g, ''); // remove all periods
    numericPart = numericPart.replace(/,/g, '.'); // replace last comma with a period
  } else {
    // if the last period is after the last comma or no commas, treat period as the decimal separator
    numericPart = numericPart.replace(/,/g, ''); // remove all commas
  }

  return parseFloat(numericPart) || 0;
};

export const formatBusinessUnitExcelString = (input: string): string => {
  return input ? input.slice(0, 40).trim() : '';
};

export const getPriceUnit = (unitCode: string): number => {
  const priceUnitCodeToValue: Record<string, number> = {
    T: 1000,
    H: 100,
    M: 0,
    S: 0,
  };

  if (!priceUnitCodeToValue[unitCode]) {
    return 0;
  }

  return priceUnitCodeToValue[unitCode];
};

class BusinessUnitExcelMat017ItemPrices {
  private constructor(private props: BusinessUnitExcelMat017Item) {}
  public static create(props: BusinessUnitExcelMat017Item): BusinessUnitExcelMat017ItemPrices {
    return new BusinessUnitExcelMat017ItemPrices(props);
  }

  public getAsIerpMat017ItemPrices(): IerpMat017ItemPrice[] {
    return [this.createDefaultPrice(), this.createStaggeredPrice1(), this.createStaggeredPrice2()]
      .filter((price) => price.quantityAmount > 0 || price.amount > 0) // Filter to keep valid entries
      .reduce<IerpMat017ItemPrice[]>((acc, price) => {
        if (!acc.find((el: IerpMat017ItemPrice) => el.quantityAmount === price.quantityAmount)) {
          acc.push(price);
        }
        return acc;
      }, []); // remove duplicate prices
  }

  public getCommonPriceProperties(): Omit<IerpMat017ItemPrice, 'amount' | 'quantityAmount'> {
    return {
      matNumber: this.props.Artikelnummer,
      priceUnit: getPriceUnit(this.props.Preiseinheit),
      supplierItemNumber: formatBusinessUnitExcelString(this.props.BestellNr),
      supplierId: this.props.Lieferant,
      supplierName: this.props['Name Lieferant'],
      discountPercentage1: formatBusinessUnitExcelFloat(this.props.Rabatt) * 100,
    };
  }

  private createDefaultPrice(): IerpMat017ItemPrice {
    return {
      quantityAmount: 0,
      amount: formatBusinessUnitExcelFloat(this.props['Einkauf EUR']),
      ...this.getCommonPriceProperties(),
    };
  }

  private createStaggeredPrice1(): IerpMat017ItemPrice {
    return {
      quantityAmount: formatBusinessUnitExcelFloat(this.props['Staffel 1']),
      amount: formatBusinessUnitExcelFloat(this.props['Preis 1 EUR']),
      ...this.getCommonPriceProperties(),
    };
  }

  private createStaggeredPrice2(): IerpMat017ItemPrice {
    return {
      quantityAmount: formatBusinessUnitExcelFloat(this.props['Staffel 2']),
      amount: formatBusinessUnitExcelFloat(this.props['Preis 2 EUR']),
      ...this.getCommonPriceProperties(),
    };
  }
}

export class BusinessUnitExcelMat017ItemBaseDataModel {
  private constructor(private props: BusinessUnitExcelMat017ItemBaseData) {}

  public get value(): BusinessUnitExcelMat017ItemBaseData {
    return this.props;
  }

  public static fromBusinessUnitExcel(props: BusinessUnitExcelMat017Item): BusinessUnitExcelMat017ItemBaseDataModel {
    const prices = BusinessUnitExcelMat017ItemPrices.create(props).getAsIerpMat017ItemPrices();

    const baseData = {
      matNumber: props.Artikelnummer,
      mat017ItemGroup: props.Gruppe,
      itemDescription1: formatBusinessUnitExcelString(props.Artikelbezeichnung1),
      itemDescription2: formatBusinessUnitExcelString(props.Artikelbezeichnung2),
      supplierItemNumber: prices[0]?.supplierItemNumber || null,
      supplierId: prices[0]?.supplierId || null,
      priceUnit: prices.length > 0 ? prices[0].priceUnit : null,
      amount: prices.length > 0 ? NumberUtils.round(prices[0].amount) : null,
    } as BusinessUnitExcelMat017ItemBaseData;

    return new BusinessUnitExcelMat017ItemBaseDataModel(baseData);
  }

  public static fromIerp(ierpMat017Item: IerpMat017Item): BusinessUnitExcelMat017ItemBaseDataModel {
    const prices = ierpMat017Item.prices.sort((a, b) => a.quantityAmount - b.quantityAmount);
    const hasPrices = prices.length > 0;

    const baseData = {
      matNumber: ierpMat017Item.matNumber,
      mat017ItemGroup: ierpMat017Item.mat017ItemGroup,
      itemDescription1: ierpMat017Item.itemDescription1De,
      itemDescription2: ierpMat017Item.itemDescription2De,
      supplierItemNumber: prices.length > 0 ? prices[0].supplierItemNumber : null,
      supplierId: hasPrices ? prices[0].supplierId : null,
      priceUnit: hasPrices ? prices[0].priceUnit : null,
      amount: hasPrices ? NumberUtils.round(prices[0].amount) : null,
    } as BusinessUnitExcelMat017ItemBaseData;

    return new BusinessUnitExcelMat017ItemBaseDataModel(baseData);
  }

  // TO-DO: additional factory method can be added here to enable validating from user input (ICALC-617)
  // public static fromManualCreation(props: any): BusinessUnitExcelMat017ItemBaseDataModel {}
}

export class BusinessUnitExcelMat017ItemModel {
  private constructor(private props: BusinessUnitExcelMat017Item) {}

  public static create(props: BusinessUnitExcelMat017Item): BusinessUnitExcelMat017ItemModel {
    return new BusinessUnitExcelMat017ItemModel(props);
  }

  public getAsIerpMat017Item(): IerpMat017Item {
    return {
      matNumber: this.props.Artikelnummer,
      itemDescription1De: formatBusinessUnitExcelString(this.props.Artikelbezeichnung1),
      itemDescription2De: formatBusinessUnitExcelString(this.props.Artikelbezeichnung2),
      itemDescription1En: formatBusinessUnitExcelString(this.props['Artikelbezeichnung1 Englisch']),
      itemDescription2En: formatBusinessUnitExcelString(this.props['Artikelbezeichnung2 Englisch']),
      mat017ItemGroup: this.props.Gruppe,
      unitId: this.getUnitId(this.props.Mengeneinheit),
      prices: BusinessUnitExcelMat017ItemPrices.create(this.props).getAsIerpMat017ItemPrices(),
    };
  }

  public getAsMat017ItemBaseData(): BusinessUnitExcelMat017ItemBaseData {
    return BusinessUnitExcelMat017ItemBaseDataModel.fromBusinessUnitExcel(this.props).value;
  }

  public compareToIerpMat017Item(ierpMat017Item: IerpMat017Item): IerpMat017ItemToBusinessUnitExcelComparisonResult {
    const ierpMat017ItemBaseData = BusinessUnitExcelMat017ItemBaseDataModel.fromIerp(ierpMat017Item).value;
    const businessUnitExcelMat017ItemBaseData = this.getAsMat017ItemBaseData();

    const diffBetweenIerpAndBu = diff(ierpMat017ItemBaseData, businessUnitExcelMat017ItemBaseData);

    return {
      ierpMat017ItemBaseData,
      businessUnitExcelMat017ItemBaseData,
      diff: diffBetweenIerpAndBu,
      hasChanges: !ObjectUtils.isEqualJSONRepresentation(diffBetweenIerpAndBu, {}),
    };
  }

  private getUnitId(rawUnit: 'S' | 'M'): UnitId {
    return rawUnit === 'S' ? 'Stk' : rawUnit;
  }
}
