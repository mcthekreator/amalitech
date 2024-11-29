import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { NumberUtils } from '@igus/icalc-utils';

@Pipe({ name: 'convertDecimalToDeString' })
export class ConvertDecimalToDeStringPipe implements PipeTransform {
  public transform(value: number): string {
    return value?.toLocaleString?.('de-DE');
  }
}

@Pipe({ name: 'convertPrice' })
export class ConvertPricePipe implements PipeTransform {
  public transform(value: number, currency?: string): string {
    const currencySymbol = currency ? currency : '€';

    return `${NumberUtils.roundToLocaleString(value)} ${currencySymbol}`;
  }
}

@Pipe({ name: 'convertToThreeDigits' })
export class ConvertToThreeDigitsPipe implements PipeTransform {
  public transform(value: number): string {
    return NumberUtils.roundToThreeDigitsDeLocaleString(value);
  }
}
