export interface IcalcLibrary {
  imageList: IcalcImage[];
  commentList: IcalcComment[];
  boxList: IcalcBox[];
  circleList: IcalcCircle[];
  lineList: IcalcLine[];
  arrowList: IcalcArrow[];
  leftChainFlex: {
    fontSize: number;
    text: string;
  };
  rightChainFlex: {
    fontSize: number;
    text: string;
  };
  fontSizeLeft: number;
  fontSizeRight: number;
  labelTextLeft: string;
  labelTextRight: string;
  leftMarkerDistance: number;
  rightMarkerDistance: number;
  sketchDate: string;
  base64Image: string;
}

export interface IcalcLibraryShape {
  id?: string;
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
  side?: 'left' | 'right';
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
