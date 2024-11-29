import { StringUtils } from './string-utils';

describe('StringUtils', () => {
  describe('removeTabsAndSpacesFromString', () => {
    it('should remove all tabs from “\tC-1\t” and return “C-1”', () => {
      const givenString = '\tC-1\t';

      const executionResult = StringUtils.removeTabsAndSpacesFromString(givenString);

      expect(executionResult).toEqual('C-1');
    });

    it('should remove all tabs and spaces from “\tM\tA\tT\t0\t1 7 1 2\t3” and return “MAT017123”', () => {
      const givenString = '\tM\tA\tT\t0\t1 7 1 2\t3';

      const executionResult = StringUtils.removeTabsAndSpacesFromString(givenString);

      expect(executionResult).toEqual('MAT017123');
    });

    it('should remove all spaces from “ C 1” and return “C1”', () => {
      const givenString = ' C 1';

      const executionResult = StringUtils.removeTabsAndSpacesFromString(givenString);

      expect(executionResult).toEqual('C1');
    });

    it('should remove all spaces from “ C  1” and return “C1”', () => {
      const givenString = ' C  1';

      const executionResult = StringUtils.removeTabsAndSpacesFromString(givenString);

      expect(executionResult).toEqual('C1');
    });

    it('should remove all spaces from “ M A T 0 1 7 1 2 3 ” and return “MAT017123”', () => {
      const givenString = ' M A T 0 1 7 1 2 3 ';

      const executionResult = StringUtils.removeTabsAndSpacesFromString(givenString);

      expect(executionResult).toEqual('MAT017123');
    });

    it('should return empty string if string with one space (" ") is passed', () => {
      const givenString = ' ';

      const executionResult = StringUtils.removeTabsAndSpacesFromString(givenString);

      expect(executionResult).toEqual('');
    });
  });

  describe('stripQueryParams', () => {
    it('should return given string if no ? is included', () => {
      const givenString = 'http://www';

      const executionResult = StringUtils.stripQueryParams(givenString);

      expect(executionResult).toEqual(givenString);
    });

    it('should return string without query parameters if included', () => {
      const givenString =
        'https://igus.widen.net/content/random0123/png/ImageName.png?w=1040&h=570&position=c&color=ffffff00&quality=80&u=jxmatw&cb=17213023';
      const expectedResult = 'https://igus.widen.net/content/random0123/png/ImageName.png';

      const executionResult = StringUtils.stripQueryParams(givenString);

      expect(executionResult).not.toEqual(givenString);
      expect(executionResult).toBe(expectedResult);
    });
  });

  describe('removeNewlinesFromString', () => {
    it('should remove all newlines from a string', () => {
      const input = 'This is a\nstring with\r\nnewlines.';
      const expectedOutput = 'This is astring withnewlines.';

      const result = StringUtils.removeNewlinesFromString(input);

      expect(result).toBe(expectedOutput);
    });

    it('should return the same string if there are no newlines', () => {
      const input = 'This string has no newlines.';
      const expectedOutput = 'This string has no newlines.';

      const result = StringUtils.removeNewlinesFromString(input);

      expect(result).toBe(expectedOutput);
    });

    it('should return an empty string if the input is an empty string', () => {
      const input = '';
      const expectedOutput = '';

      const result = StringUtils.removeNewlinesFromString(input);

      expect(result).toBe(expectedOutput);
    });

    it('should remove multiple consecutive newlines', () => {
      const input = 'Multiple\n\nnewlines\r\n\r\nin this string.';
      const expectedOutput = 'Multiplenewlinesin this string.';

      const result = StringUtils.removeNewlinesFromString(input);

      expect(result).toBe(expectedOutput);
    });

    it('should handle a string with only newlines', () => {
      const input = '\n\r\n\n';
      const expectedOutput = '';

      const result = StringUtils.removeNewlinesFromString(input);

      expect(result).toBe(expectedOutput);
    });

    it('should return an empty string if the input is undefined', () => {
      const input = undefined;
      const expectedOutput = '';

      const result = StringUtils.removeNewlinesFromString(input);

      expect(result).toBe(expectedOutput);
    });
  });

  describe('coerceAlphanumeric', () => {
    it('should format valid alphanumeric strings', () => {
      expect(StringUtils.coerceAlphanumeric('abc123')).toBe('abc123');
      expect(StringUtils.coerceAlphanumeric(' abc 123 ')).toBe('abc123');
      expect(StringUtils.coerceAlphanumeric('abc@123')).toBe('abc123');
    });

    it('should format numbers to their string representation', () => {
      expect(StringUtils.coerceAlphanumeric(1234)).toBe('1234');
    });

    it('should return an empty string for null or undefined inputs', () => {
      expect(StringUtils.coerceAlphanumeric(null)).toBe('');
      expect(StringUtils.coerceAlphanumeric(undefined)).toBe('');
    });

    it('should return an empty string for non-alphanumeric inputs', () => {
      expect(StringUtils.coerceAlphanumeric('!@#')).toBe('');
      expect(StringUtils.coerceAlphanumeric(' ')).toBe('');
    });
  });

  describe('coerceNumeric', () => {
    it('should format valid numeric strings', () => {
      expect(StringUtils.coerceNumeric('1234')).toBe('1234');
      expect(StringUtils.coerceNumeric(' 1,234.56 ')).toBe('1,234.56');
      expect(StringUtils.coerceNumeric('1.234,56')).toBe('1.234,56');
    });

    it('should format numbers to their string representation', () => {
      expect(StringUtils.coerceNumeric(1234.56)).toBe('1234.56');
    });

    it('should return an empty string for null or undefined inputs', () => {
      expect(StringUtils.coerceNumeric(null)).toBe('');
      expect(StringUtils.coerceNumeric(undefined)).toBe('');
    });

    it('should return an empty string for non-numeric inputs', () => {
      expect(StringUtils.coerceNumeric('abc')).toBe('');
      expect(StringUtils.coerceNumeric('!@#')).toBe('');
    });
  });
});
