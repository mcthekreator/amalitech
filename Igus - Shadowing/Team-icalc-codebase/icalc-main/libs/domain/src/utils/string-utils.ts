/* eslint-disable no-bitwise */
export class StringUtils {
  public static generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      // tslint:disable-next-line: one-variable-per-declaration
      // eslint-disable-next-line one-var
      const r = (Math.random() * 16) | 0,
        // tslint:disable-next-line: no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8;

      return v.toString(16);
    });
  }

  public static removeNewlinesFromString(input: string): string {
    if (!input) {
      return '';
    }
    return input.replace(/[\r\n]+/g, '');
  }

  public static removeTabsAndSpacesFromString(input: string): string {
    if (!input) {
      throw new Error('input should be defined');
    }
    return input.replace(/\t/g, '').replace(/ /g, '');
  }

  public static getFloatOrZeroFromLocalizedStringInput(input: string | number): number {
    const result = +(`${input}` ?? '0').replace(',', '.');

    if (isNaN(result)) {
      return 0;
    }
    return result;
  }

  public static isOfTypeString(stringLikeInput: unknown): boolean {
    return typeof stringLikeInput === 'string';
  }

  public static coerceString(stringLikeInput: unknown): string {
    if (!stringLikeInput) {
      return '';
    }

    return typeof stringLikeInput === 'string' ? stringLikeInput : stringLikeInput.toString();
  }

  public static coerceToNullIfEmpty(value?: string): string | null {
    return value === undefined || value === '' ? null : value;
  }

  public static coerceToNullIfContainsNullString(value: string | null): string | null {
    return value === 'NULL' || value === 'null' ? null : value;
  }

  public static mapToOccurrences(array: string[]): { [key: string]: number } {
    return array.reduce(
      (acc, str) => {
        if (!str) return acc;
        const trimmedStr = str.trim();

        acc[trimmedStr] = (acc[trimmedStr] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );
  }

  public static stripQueryParams(url: string): string {
    if (!url?.includes('?')) {
      return url;
    }
    return url?.split('?')[0];
  }

  // TODO use method as parser of formly field for sub-actions of pinAssignment action model
  public static coerceAlphanumeric(input: string | number): string {
    if (!input) {
      return '';
    }

    const stringValue = input.toString().trim();

    return stringValue.replace(/[^a-zA-Z0-9]/g, '');
  }

  // TODO use method as parser of formly field for sub-actions of pinAssignment action model
  public static coerceNumeric(input: string | number): string {
    if (!input) {
      return '';
    }

    const stringValue = input.toString().trim();

    return stringValue.replace(/[^0-9,.]/g, '');
  }
}
