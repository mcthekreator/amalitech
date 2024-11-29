interface SingleCableCalulationRelatedObjectIds {
  id: string;
  calculationId: string;
  configurationId: string;
  snapshotId: string;
}

export interface DbSeedResponse {
  status: string;
  message: string;
  data?: {
    // TODO we may extend this with further types of data, it could be useful to make data type generic
    calculation: {
      [key: string]: {
        id: string;
        singleCableCalculations: SingleCableCalulationRelatedObjectIds[];
      };
    };
    configuration: {
      [key: string]: {
        id: string;
      };
    };
  };
  error?: string;
}
