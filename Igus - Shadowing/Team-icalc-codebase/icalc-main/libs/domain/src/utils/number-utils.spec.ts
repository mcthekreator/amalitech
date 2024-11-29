import { NumberUtils } from './number-utils';

describe('NumberUtils round()', () => {
  it('rounds correctly', () => {
    expect(NumberUtils.round(10)).toBe(10);
    expect(NumberUtils.round(1.7777)).toBe(1.78);
    expect(NumberUtils.round(1.005)).toBe(1.01);
    expect(NumberUtils.round(1.62155787)).toBe(1.62);
    expect(NumberUtils.round(1.538)).toBe(1.54);
    expect(NumberUtils.round(1.105)).toBe(1.11);
    expect(NumberUtils.round(1.205)).toBe(1.21);
    expect(NumberUtils.round(1.305)).toBe(1.31);
    expect(NumberUtils.round(1.405)).toBe(1.41);
    expect(NumberUtils.round(1.505)).toBe(1.51);
    expect(NumberUtils.round(1.605)).toBe(1.61);
    expect(NumberUtils.round(1.705)).toBe(1.71);
    expect(NumberUtils.round(1.805)).toBe(1.81);
    // edge cases which led to error with the round method from excel service (see unused method excelRound)
    expect(NumberUtils.round(1.015)).toBe(1.02);
    expect(NumberUtils.round(1.905)).toBe(1.91);
    expect(NumberUtils.round(2.005)).toBe(2.01);
    // actual chainflex examples for "commercial rounding" (see ICALC-248)
    expect(NumberUtils.round(0.404)).toBe(0.4);
    expect(NumberUtils.round(1.702307945)).toBe(1.7);
    expect(NumberUtils.round(0.187)).toBe(0.19);
    expect(NumberUtils.round(1.0846)).toBe(1.08);
    expect(NumberUtils.round(2.4002)).toBe(2.4);
    // ICALC-334
    expect(NumberUtils.round(3.825)).toBe(3.83);
    expect(NumberUtils.round(1.004)).toBe(1);
    // round method adjusted 'to strip off the floating-point rounding errors introduced during the intermediate calculations'
    // see https://en.wikipedia.org/wiki/IEEE_754-1985 & delftstack.com/howto/javascript/javascript-round-to-2-decimal-places
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(NumberUtils.round(4.3149999999999997)).toBe(4.32);
    expect(NumberUtils.round(5.7459999999999996)).toBe(5.75);
    expect(NumberUtils.round(3.8249999999999997)).toBe(3.83);
  });
});

describe('NumberUtils roundToThreeDecimalPlaces()', () => {
  it('rounds correctly', () => {
    expect(NumberUtils.roundToThreeDecimalPlaces(10)).toBe(10);
    expect(NumberUtils.roundToThreeDecimalPlaces(1.7777)).toBe(1.778);
    expect(NumberUtils.roundToThreeDecimalPlaces(1.005)).toBe(1.005);
    expect(NumberUtils.roundToThreeDecimalPlaces(1.62155787)).toBe(1.622);
    expect(NumberUtils.roundToThreeDecimalPlaces(1.538)).toBe(1.538);
    expect(NumberUtils.roundToThreeDecimalPlaces(1.702307945)).toBe(1.702);
    expect(NumberUtils.roundToThreeDecimalPlaces(1.0846)).toBe(1.085);
    expect(NumberUtils.roundToThreeDecimalPlaces(2.4002)).toBe(2.4);
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(NumberUtils.roundToThreeDecimalPlaces(4.3149999999999997)).toBe(4.315);
    expect(NumberUtils.roundToThreeDecimalPlaces(5.7459999999999996)).toBe(5.746);
    expect(NumberUtils.roundToThreeDecimalPlaces(3.8249999999999997)).toBe(3.825);
    // rounds the product of both current default values for risk factors correctly (like excel)
    expect(NumberUtils.roundToThreeDecimalPlaces(1.12 * 1.058)).toBe(1.185);
  });
});

describe('NumberUtils roundToLocaleString()', () => {
  it('rounds and converts to string correctly', () => {
    expect(NumberUtils.roundToLocaleString(10)).toBe('10,00');
    expect(NumberUtils.roundToLocaleString(2.2)).toBe('2,20');
    expect(NumberUtils.roundToLocaleString(1.7777)).toBe('1,78');
    expect(NumberUtils.roundToLocaleString(1.005)).toBe('1,01');
    expect(NumberUtils.roundToLocaleString(1.62155787)).toBe('1,62');
  });
});

describe('NumberUtils areFloatsEqual()', () => {
  it('compares two floating point numbers with a given precision correctly', () => {
    expect(NumberUtils.areFloatsEqual(0.1, 0.1, 1)).toBe(true);
    expect(NumberUtils.areFloatsEqual(0.1, 0.2, 1)).toBe(false);
    expect(NumberUtils.areFloatsEqual(0.19, 0.21, 1)).toBe(false);
    expect(NumberUtils.areFloatsEqual(0.19, 0.11, 1)).toBe(true);
    expect(NumberUtils.areFloatsEqual(0.119, 0.191, 1)).toBe(true);

    expect(NumberUtils.areFloatsEqual(0.54, 0.54, 2)).toBe(true);
    expect(NumberUtils.areFloatsEqual(0.542, 0.549, 2)).toBe(true);
    expect(NumberUtils.areFloatsEqual(0.11, 0.21, 2)).toBe(false);
    expect(NumberUtils.areFloatsEqual(0.19, 0.21, 2)).toBe(false);

    expect(NumberUtils.areFloatsEqual(0.0000000004, 0.0000000004)).toBe(true);
    expect(NumberUtils.areFloatsEqual(0.0000000004, 0.00000000049)).toBe(true);
    expect(NumberUtils.areFloatsEqual(0.0000000004, 0.0000000003)).toBe(false);
    expect(NumberUtils.areFloatsEqual(0.0000000019, 0.000000002)).toBe(false);
    expect(NumberUtils.areFloatsEqual(0.0000000004, 0.00000000039)).toBe(false);

    expect(NumberUtils.areFloatsEqual(3.5912000009, 3.5912000009)).toBe(true);
    expect(NumberUtils.areFloatsEqual(3.59120000099, 3.59120000091)).toBe(true);
    expect(NumberUtils.areFloatsEqual(3.5912000009, 3.5912000008)).toBe(false);
    expect(NumberUtils.areFloatsEqual(3.5912000009, 3.59120000089)).toBe(false);

    expect(NumberUtils.areFloatsEqual(2.99, 3)).toBe(false);
    expect(NumberUtils.areFloatsEqual(5.12, 5.1209)).toBe(false);
    expect(NumberUtils.areFloatsEqual(102.54, 102.539)).toBe(false);
  });
});
