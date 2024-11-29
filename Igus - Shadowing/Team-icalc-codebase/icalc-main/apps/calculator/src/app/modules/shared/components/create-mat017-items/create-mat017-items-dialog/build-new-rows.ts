import type { Mat017ItemCreationData } from 'libs/domain/src/models';

export const buildNewRows = (
  currentRows: Mat017ItemCreationData[],
  insertFromIndex: number,
  newRows?: Mat017ItemCreationData[]
): Mat017ItemCreationData[] => {
  const rows = [...currentRows];

  rows.splice(insertFromIndex, newRows ? newRows.length : 1, ...(newRows || []));
  return rows;
};
