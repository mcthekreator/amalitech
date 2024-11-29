/* eslint-disable @typescript-eslint/no-explicit-any */
export class ArrayUtils {
  public static isNotEmpty(array: any[]): boolean {
    return !!array && Array.isArray(array) && array.length > 0;
  }

  public static isEmpty(array: any): boolean {
    return ArrayUtils.isNotEmpty(array) === false;
  }

  public static fallBackToEmptyArray<T>(array: T[]): T[] {
    return ArrayUtils.isNotEmpty(array) ? array : [];
  }

  public static getLastElement<T>(array: T[]): T {
    return ArrayUtils.isNotEmpty(array) ? array[array.length - 1] : (null as unknown as T);
  }

  public static getFirstElement<T>(array: T[]): T {
    return ArrayUtils.isNotEmpty(array) ? array[0] : (null as unknown as T);
  }

  public static getNthElement<T>(array: T[], index: number): T {
    return !!array &&
      Array.isArray(array) &&
      array.length > 0 &&
      (!!array[index] || (array[index] as unknown as string) === '')
      ? array[index]
      : (null as unknown as T);
  }

  public static sortAlphabetically<T>(array: T[], propertyName: string): T[] {
    if (!!array && Array.isArray(array) && array.length > 0 && typeof propertyName === 'string') {
      return array.sort((a, b) => {
        if ((a as any)[propertyName] < (b as any)[propertyName]) {
          return -1;
        }
        if ((a as any)[propertyName] > (b as any)[propertyName]) {
          return 1;
        }
        return 0;
      });
    }
    return [];
  }

  public static findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    if (!this.isNotEmpty(array)) {
      return -1;
    }
    let l = array.length;

    while (l--) {
      if (predicate(array[l], l, array)) {
        return l;
      }
    }
    return -1;
  }

  public static findAndReplace<T>(
    array: Array<T>,
    predicate: (value: T, index: number, obj: T[]) => boolean,
    newElement: T
  ): Array<T> {
    if (!this.isNotEmpty(array)) {
      return [];
    }
    if (typeof predicate !== 'function') {
      return array;
    }
    return ArrayUtils.fallBackToEmptyArray(array).map((item, index) =>
      predicate(item, index, array) === true ? { ...newElement } : { ...item }
    );
  }

  public static groupBy<T>(array: T[], key: string): T {
    return this.fallBackToEmptyArray(array).reduce((rv, x) => {
      ((rv as any)[(x as any)[key]] = (rv as any)[(x as any)[key]] || []).push(x);
      return rv;
    }, {}) as T;
  }

  public static sortByAssignmentDate(a: { assignmentDate: Date }, b: { assignmentDate: Date }): number {
    return new Date(a.assignmentDate).getTime() - new Date(b.assignmentDate).getTime();
  }

  public static hasTruthyValues<T>(array: T[]): boolean {
    return array.filter((v) => !!v).length > 0;
  }

  public static transformToMapByKey<U>(array: U[], key: keyof U): Map<string, U> {
    return array.reduce((acc, curr: U) => {
      const keyValue = String(curr[key]);

      acc.set(keyValue, curr);
      return acc;
    }, new Map<string, U>());
  }

  public static filterDuplicatesByKey<T>(array: T[], key: keyof T): T[] {
    return array.reduce<{ seen: Record<string, boolean>; result: T[] }>(
      (acc, current) => {
        const keyValue = String(current[key]);

        if (!acc.seen[keyValue]) {
          acc.seen[keyValue] = true;
          acc.result.push(current);
        }
        return acc;
      },
      { seen: {}, result: [] }
    ).result;
  }
}
