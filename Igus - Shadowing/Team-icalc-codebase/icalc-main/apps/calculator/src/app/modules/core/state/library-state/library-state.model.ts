import type { IcalcLibrary } from '@igus/icalc-domain';

export interface LibraryStateModel extends IcalcLibrary {
  base64Image: string;
  mat017ItemLoadingStatus: Record<string, IcalcLibraryMat017ItemLoadingStatus>;
}

export interface IcalcLibraryMat017ItemLoadingStatus {
  photoIsLoading: boolean;
  techDrawIsLoading: boolean;
  pinAssIsLoading: boolean;
}

export interface IcalcLibraryShape {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isFlipped?: boolean;
  rotationDegree: number;
}

export interface IcalcImage extends IcalcLibraryShape {
  src: string;
  matNumber?: string;
  group?: string;
  side?: string;
  picType?: 'photo' | 'techDraw' | 'pinAss';
}

export interface IcalcComment extends IcalcLibraryShape {
  text: string;
  fontSize?: number;
}

export type IcalcBox = IcalcLibraryShape;

export type IcalcCircle = IcalcLibraryShape;

export type IcalcLine = IcalcLibraryShape;

export type IcalcArrow = IcalcLibraryShape;

export interface SketchItemChange extends IcalcLibraryShape {
  fontSize?: number;
  text?: string;
}
