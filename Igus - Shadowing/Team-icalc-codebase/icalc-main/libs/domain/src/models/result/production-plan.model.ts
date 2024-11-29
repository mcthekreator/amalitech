export interface ExcelProductionPlans {
  productionPlans: ProductionPlan[];
}

export interface ProductionPlan {
  matNumber: string;
  chainflexNumber: string;
  chainflexOuterDiameter: string;
  chainflexCableStructure: string;
  mat017ItemList: [string, string, string, string, string, number][];
  libraryImage: string;
  libraryImageWidth: number;
  libraryImageHeight: number;
  pinAssignmentImageWidth: number;
  pinAssignmentImageHeight: number;
  pinAssignmentImage: string;
  labelingLeft: string;
  labelingRight: string;
  userName: string;
  creationDate: Date;
  modificationDate: Date;
}
