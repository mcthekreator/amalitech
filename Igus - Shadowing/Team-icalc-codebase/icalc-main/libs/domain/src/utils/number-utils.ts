export class NumberUtils {
  /**
   * Rounds value to two decimal places (commercial rounding)
   *
   * @param value to be rounded
   * @returns rounded number
   */
  public static round(value: number): number {
    const m = Number((Math.abs(value) * 100).toPrecision(15));

    return (Math.round(m) / 100) * Math.sign(value);
  }

  /**
   * Rounds value to three decimal places
   *
   * @param value to be rounded
   * @returns rounded number
   */
  public static roundToThreeDecimalPlaces(value: number): number {
    const m = Number((Math.abs(value) * 1000).toPrecision(15));

    return (Math.round(m) / 1000) * Math.sign(value);
  }

  // this previous round method did not cover floating-point inaccuracies (see: https://en.wikipedia.org/wiki/IEEE_754-1985)
  // /**
  //  * Rounds value to two decimal places (commercial rounding)
  //  *
  //  * @param value to be rounded
  //  * @returns rounded number
  //  */
  // static round(value: number) {
  //   return +(Math.round(+(value + 'e+' + 2)) + 'e-' + 2);
  // }

  /**
   * Rounds value to two decimal places
   * changes "." to "," notation on decimal numbers
   *
   * @param value to be rounded
   * @returns string of rounded value
   */
  public static roundToLocaleString(value: number): string {
    return this.round(value).toLocaleString?.('de-DE', { minimumFractionDigits: 2 });
  }

  /**
   * Rounds value to three decimal places
   * changes "." to "," notation on decimal numbers
   *
   * @param value to be rounded
   * @returns string of rounded value
   */
  public static roundToThreeDigitsDeLocaleString(value: number): string {
    return this.roundToThreeDecimalPlaces(value).toLocaleString?.('de-DE', { minimumFractionDigits: 3 });
  }

  /**
   * compares two floats for equality using a given precision
   *
   * @param firstFloat first float value to be compared
   * @param secondFloat second float value to be compared
   * @param precision number of digits after the decimal point which should still be included in the comparison (default: 10)
   * @returns boolean true if equal false if not
   */
  public static areFloatsEqual = (firstFloat: number, secondFloat: number, precision = 10): boolean => {
    return (
      NumberUtils.toFixedWithoutRounding(firstFloat, precision) ===
      NumberUtils.toFixedWithoutRounding(secondFloat, precision)
    );
  };

  /**
   * toFixedWithoutRounding
   *
   * @param num number value to be set to fixed deciaml points
   * @param precision number of digits after the deciaml point to which the number should be fixed
   * @returns number value with a fixed number of digits after the decimal point according to given precision
   */
  public static toFixedWithoutRounding = (num: number, precision: number): string => {
    let fixed = precision || 0;

    fixed = Math.pow(10, fixed);
    return (Math.floor(num * fixed) / fixed).toFixed(precision);
  };
}
