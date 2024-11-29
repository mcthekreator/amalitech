/* eslint-disable @typescript-eslint/no-explicit-any */
export class ObjectUtils {
  /**
   * clones simple json objects
   * Please be careful using this function
   * do not clone objects with circular references of function properties
   *
   */
  public static cloneDeep<T>(inputObject: any): T | null {
    if (inputObject && typeof inputObject === 'object') {
      try {
        return JSON.parse(JSON.stringify(inputObject)) as T;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  public static isZeroOrAnyNumber(value: unknown): boolean {
    return typeof value !== 'string' && !isNaN(value as number);
  }

  public static hasKey<T>(target: T, key: keyof T): boolean {
    return target[key] !== undefined;
  }

  public static removeNullProperties(value: any): void {
    if (!value || typeof value === 'string') {
      return;
    }
    Object.keys(value).forEach((key: string) => {
      if (value[key] === null) {
        delete value[key];
      }
    });
  }

  public static isNullIfNotANumber(value: unknown): number | null {
    return typeof value !== 'string' && !isNaN(value as number) ? (value as number) : null;
  }

  public static isEqualJSONRepresentation(first: any, second: any): boolean {
    try {
      return JSON.stringify(first) === JSON.stringify(second);
    } catch (error) {
      return false;
    }
  }

  public static getNestedValue<T>(obj: any, path: string[] | string): T {
    return (typeof path === 'string' ? path.split('.') : path).reduce((a, b) => {
      if (a && typeof a === 'object') {
        const result = a[b];

        return result !== undefined ? result : null;
      }
      return null;
    }, obj);
  }

  public static setNestedValue(obj: any, propertyPath: string[] | string, value: any): void {
    const properties = Array.isArray(propertyPath) ? propertyPath : propertyPath.split('.');

    if (properties.length > 1) {
      if (ObjectUtils.doesPropertyNotExist(obj, properties[0])) {
        obj[properties[0]] = {};
      }
      return ObjectUtils.setNestedValue(obj[properties[0]], properties.slice(1), value);
    } else {
      obj[properties[0]] = value;
    }
  }

  public static omitKeys<T extends object, K extends keyof T>(object: T, keys: Array<K>): Omit<T, K> | undefined {
    if (!object) {
      return;
    }

    const result = { ...object };

    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }

  public static pickKeys<T extends object, K extends keyof T>(object: T, keys: Array<K>): Pick<T, K> | undefined {
    if (!object) {
      return;
    }

    return Object.keys(object).reduce(
      (acc, next) => {
        if (keys.includes(next as K)) {
          acc[next as K] = object[next as K];
        }

        return acc;
      },
      {} as Pick<T, K>
    );
  }

  public static isTruthy(input: unknown): boolean {
    return Boolean(input);
  }

  public static isFunction(maybeFunction: unknown): boolean {
    return typeof maybeFunction === 'function';
  }

  private static doesPropertyNotExist(obj: any, prop: string): boolean {
    return !Object.prototype.hasOwnProperty.call(obj, prop) || obj[prop] === null || typeof obj[prop] !== 'object';
  }
}
