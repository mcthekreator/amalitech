// SingleCableCalculation Requests
import { createPartialSingleCableCalculation } from '../single-cable-calculation';
import { icalcTestBase64Image } from '../../../constants';
import { createIcalcTestMat017ItemWithWidenData } from './connector-state';

export const icalcTestSingleCableCalculation = createPartialSingleCableCalculation();
export const icalcTestSaveSingleCableCalculationBodyWithSnapshot = {
  id: 'toBeReplaced',
  snapshot: {
    id: 'toBeReplaced',
    libraryState: {
      imageList: [],
      commentList: [],
      boxList: [],
      circleList: [],
      lineList: [],
      arrowList: [],
      leftChainFlex: {
        fontSize: 10,
        text: 'toBeReplaced',
      },
      rightChainFlex: {
        fontSize: 10,
        text: 'test',
      },
      fontSizeLeft: 10,
      fontSizeRight: 10,
      leftMarkerDistance: 1,
      rightMarkerDistance: 1,
      labelTextLeft: 'toBeReplaced',
      labelTextRight: 'test',
      sketchDate: 'testDate',
      base64Image: icalcTestBase64Image,
    },
    connectorState: {
      leftConnector: {
        mat017ItemListWithWidenData: [createIcalcTestMat017ItemWithWidenData()],
        addedMat017Items: {},
      },
      rightConnector: {
        mat017ItemListWithWidenData: [],
        addedMat017Items: {},
      },
    },
  },
};
export const icalcLockedTestSingleCableCalculation = createPartialSingleCableCalculation({
  batchSize: 2,
});
