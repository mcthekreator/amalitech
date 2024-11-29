import type { IcalcLibrary } from '../../../models';
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';

export const libraryState: IcalcLibrary = {
  imageList: [],
  commentList: [],
  boxList: [],
  circleList: [],
  lineList: [],
  arrowList: [],
  leftChainFlex: { fontSize: 14, text: '' },
  rightChainFlex: { fontSize: 14, text: '' },
  fontSizeLeft: 14,
  fontSizeRight: 14,
  labelTextLeft: '',
  labelTextRight: '',
  leftMarkerDistance: 100,
  rightMarkerDistance: 100,
  sketchDate: '08/15/2023',
  base64Image: 'data:image/png;base64,veryLongBase64StringOfScreenshot...',
};
export const createIcalcTestLibraryState = (override?: NestedPartial<IcalcLibrary>): IcalcLibrary => {
  return mergePartially.deep(libraryState, override);
};
