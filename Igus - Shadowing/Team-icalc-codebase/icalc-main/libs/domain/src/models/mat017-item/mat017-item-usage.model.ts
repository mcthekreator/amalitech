export interface Mat017ItemUsage {
  id: string;
  matNumber: string; // MAT017
  chainFlexPartNumber: string;
  bomId: string; // MAT904
}

export type Mat017ImportUsage = Omit<Mat017ItemUsage, 'id'>;
