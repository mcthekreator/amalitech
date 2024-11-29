import type { Mat017ItemCreationData } from 'libs/domain/src/models';
import { buildNewRows } from './build-new-rows';

const initialModelData: Mat017ItemCreationData = {
  matNumber: null,
  itemDescription1: null,
  itemDescription2: null,
  mat017ItemGroup: null,
  supplierItemNumber: null,
  amount: null,
  priceUnit: null,
  addToBomOnCreate: false,
};

const generateRow = (props = {}): Mat017ItemCreationData => ({ ...initialModelData, ...props });

const firstRow = generateRow({ matNumber: 'MAT017ITEM1' });
const secondRow = generateRow({ matNumber: 'MAT017ITEM2' });
const thirdRow = generateRow({ matNumber: 'MAT017ITEM3' });
const fourthRow = generateRow({ matNumber: 'MAT017ITEM4' });

describe('buildNewRows', () => {
  it('should insert new rows at the specified index', () => {
    const currentRows = [firstRow, secondRow];
    const newRows = [thirdRow, fourthRow];

    const result = buildNewRows(currentRows, 1, newRows);

    expect(result).toEqual([firstRow, thirdRow, fourthRow]);
  });

  it('should remove one row at the specified index if newRows is not provided', () => {
    const currentRows = [firstRow, secondRow];
    const result = buildNewRows(currentRows, 1);

    expect(result).toEqual([firstRow]);
  });

  it('should insert at the beginning if insertFromIndex is 0', () => {
    const currentRows = [firstRow, secondRow];
    const newRows = [thirdRow];

    const result = buildNewRows(currentRows, 0, newRows);

    expect(result).toEqual([thirdRow, secondRow]);
  });

  it('should append to the end if insertFromIndex is equal to the length of currentRows', () => {
    const currentRows = [firstRow, secondRow];
    const newRows = [thirdRow];

    const result = buildNewRows(currentRows, currentRows.length, newRows);

    expect(result).toEqual([firstRow, secondRow, thirdRow]);
  });

  it('should not affect rows if provided empty array as newRows', () => {
    const currentRows = [];
    const newRows = [firstRow];

    const result = buildNewRows(currentRows, 0, newRows);

    expect(result).toEqual([firstRow]);
  });

  it('should handle an empty newRows array', () => {
    const currentRows = [firstRow];
    const newRows = [];
    const result = buildNewRows(currentRows, 0, newRows);

    expect(result).toEqual([firstRow]);
  });

  it('should not modify the original array', () => {
    const currentRows = [firstRow, secondRow];
    const newRows = [thirdRow];

    const result = buildNewRows(currentRows, 1, newRows);

    expect(currentRows).toEqual([firstRow, secondRow]);
    expect(result).not.toBe(currentRows);
  });
});
