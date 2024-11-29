import { ArrayUtils } from './array-utils';
const arraysWith500Elements: number[] = [];

for (let index = 0; index < 500; index++) {
  arraysWith500Elements.push(index);
}
describe('ArrayUtils', () => {
  it('null is empty', () => {
    expect(ArrayUtils.isNotEmpty(null)).toBe(false);
  });
  it('undefined is empty', () => {
    expect(ArrayUtils.isNotEmpty(undefined)).toBe(false);
  });
  it('primitive values are empty', () => {
    expect(ArrayUtils.isNotEmpty(true as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty(false as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty(1 as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty(2 as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty('test' as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty(NaN as unknown as [])).toBe(false);
  });
  it('Objects are empty', () => {
    expect(ArrayUtils.isNotEmpty({} as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty({ a: 123 } as unknown as [])).toBe(false);
    expect(ArrayUtils.isNotEmpty({ a: [123] } as unknown as [])).toBe(false);
  });
  it('empty array is empty', () => {
    expect(ArrayUtils.isNotEmpty([])).toBe(false);
  });
  it('array with elements array is not empty', () => {
    expect(ArrayUtils.isNotEmpty([1])).toBe(true);
  });
  it('isNotEmpty changes if you operate on the array', () => {
    const array = [1];

    expect(ArrayUtils.isNotEmpty(array)).toBe(true);
    array.pop();
    expect(ArrayUtils.isNotEmpty(array)).toBe(false);
    array.push(2);
    expect(ArrayUtils.isNotEmpty(array)).toBe(true);
  });
  it('findLastIndex operates as expected', () => {
    const array = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 2 }, { a: 2 }, { a: 6 }, { a: 7 }, { a: 8 }, { a: 9 }];

    expect(ArrayUtils.findLastIndex<{ a: number }>([], (item) => item.a === 2)).toBe(-1);
    expect(ArrayUtils.findLastIndex<{ a: number }>(null, (item) => item.a === 2)).toBe(-1);
    expect(ArrayUtils.findLastIndex<{ a: number }>(undefined, (item) => item.a === 2)).toBe(-1);
    expect(ArrayUtils.findLastIndex<{ a: number }>(array, (item) => item.a === 2)).toBe(4);
    expect(ArrayUtils.findLastIndex<{ a: number }>(array, (item) => item.a === 8)).toBe(7);
  });
  it('findAndReplace operates as expected', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let a = 12345 as unknown as any;

    expect(
      ArrayUtils.findAndReplace<{ a: number; b: number }>(a, (item) => item.b === 6, { a: 99, b: 99 }).length === 0
    ).toBe(true);
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ArrayUtils.findAndReplace<{ a: number; b: number }>(a, 1234 as unknown as any, { a: 99, b: 99 }).length === 0
    ).toBe(true);
    a = [
      { a: 0, b: 0 },
      { a: 1, b: 1 },
      { a: 2, b: 2 },
      { a: 3, b: 3 },
      { a: 4, b: 4 },
      { a: 5, b: 5 },
      { a: 6, b: 6 },
      { a: 7, b: 7 },
      { a: 8, b: 8 },
      { a: 9, b: 9 },
    ];

    expect(
      ArrayUtils.findAndReplace<{ a: number; b: number }>(a, (item) => item.b === 6, { a: 99, b: 99 })[6].a === 99
    ).toBe(true);

    expect(
      ArrayUtils.findAndReplace<{ a: number; b: number }>(a, (item) => item.b === 6, { a: 99, b: 99 })[6].b === 99
    ).toBe(true);

    expect(
      ArrayUtils.findAndReplace<{ a: number; b: number }>(a, (item) => item.b === 2, { a: 99, b: 99 })[2].b === 99
    ).toBe(true);
  });

  it('filterDuplicatesByKey operates as expected', () => {
    const array = [
      { id: 'id1', prop: 1 },
      { id: 'id1', prop: 2 },
    ];

    const filteredArray = ArrayUtils.filterDuplicatesByKey(array, 'id');

    expect(filteredArray).toHaveLength(1);
    expect(filteredArray[0].prop).toBe(1);
  });

  describe('transformToMapByKey', () => {
    it('should correctly transform to Map when provided non empty array of objects', () => {
      const array = [
        { id: 'id1', prop: 1 },
        { id: 'id2', prop: 2 },
      ];

      const outputMap = ArrayUtils.transformToMapByKey(array, 'id');

      expect(outputMap.size).toBe(2);
      expect(outputMap.has('id1')).toBeTruthy();
      expect(outputMap.has('id2')).toBeTruthy();
      expect(outputMap.has('id3')).toBeFalsy();
    });

    it('should return empty Map when provided empty array', () => {
      const array = [];
      const outputMap = ArrayUtils.transformToMapByKey(array, 'id');

      expect(outputMap.size).toBe(0);
      expect(outputMap.has('id1')).toBeFalsy();
    });
  });
});
