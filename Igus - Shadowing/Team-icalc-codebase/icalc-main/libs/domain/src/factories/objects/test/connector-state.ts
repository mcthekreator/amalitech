/* eslint-disable @typescript-eslint/naming-convention */
import type {
  ConfigurationConnectorState,
  ConfigurationConnectorStatePresentation,
  Mat017ItemWithWidenData,
  Mat017Item,
  RedactedMat017ItemWithWidenData,
  WidenDataItem,
  WidenUploadProgress,
} from '../../../models';
import { Mat017ItemStatus, WIDEN_EMBED_FORMAT } from '../../../models';
import { createMat017Item } from '../mat017-item';
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import { ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '../../../constants';

const mat017ItemNumberOne = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-MAT0171Test`;
const mat017ItemNumberTwo = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-MAT0172Test`;

const defaultMat017Item = createMat017Item();

export const icalcTestMat017ItemWithWidenData: Mat017ItemWithWidenData = {
  ...defaultMat017Item,
  id: 'uuid',
  supplierId: 'TestSupplierId',
  score: 19,
  status: 'left',
  quantity: 1,
  matNumber: mat017ItemNumberOne,
  supplierItemNumber: 'exampleSupplierItemNumber',
  photoVersionId: 'versionId',
  overrides: {
    amountDividedByPriceUnit: 0.1,
    mat017ItemGroup: 'RC-K0815',
  },
};

const icalcTestRedactedMat017ItemWithWidenData: RedactedMat017ItemWithWidenData = {
  id: 'uuid',
  score: 19,
  status: 'left',
  quantity: 1,
  matNumber: mat017ItemNumberOne,
  itemStatus: Mat017ItemStatus.active,
  overrides: {
    amountDividedByPriceUnit: 0.1,
    mat017ItemGroup: 'RC-K0815',
  },
};

const icalcTestWidenDataItem: WidenDataItem = {
  id: 'exampleId123',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  version_id: '2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_update_date: '2024-08-01T07:19:49Z' as unknown as Date,
  metadata: {
    fields: {
      productid: ['1'],
      titleTag: ['photo'],
    },
  },
  embeds: {
    [WIDEN_EMBED_FORMAT]: {
      url: 'something',
      html: '',
      share: '',
    },
  },
  status: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    upload_progress: 'complete' as WidenUploadProgress,
  },
};

export const createIcalcTestMat017ItemWithWidenData = (
  override?: NestedPartial<Mat017ItemWithWidenData>
): Mat017ItemWithWidenData => {
  return mergePartially.deep(icalcTestMat017ItemWithWidenData, override);
};

export const createIcalcTestRedactedMat017ItemWithWidenData = (
  override?: NestedPartial<RedactedMat017ItemWithWidenData>
): RedactedMat017ItemWithWidenData => {
  return mergePartially.deep(icalcTestRedactedMat017ItemWithWidenData, override);
};

export const createIcalcTestWidenDataItem = (override?: NestedPartial<WidenDataItem>): WidenDataItem => {
  return mergePartially.deep(icalcTestWidenDataItem, override);
};

export const icalcTestConnectorState: ConfigurationConnectorState = {
  leftConnector: {
    mat017ItemListWithWidenData: [
      createIcalcTestRedactedMat017ItemWithWidenData({ id: undefined }),
      createIcalcTestRedactedMat017ItemWithWidenData({ id: undefined, matNumber: mat017ItemNumberTwo }),
    ],
    addedMat017Items: {
      [mat017ItemNumberOne]: 1,
      [mat017ItemNumberTwo]: 1,
    },
  },
  rightConnector: {
    mat017ItemListWithWidenData: [],
    addedMat017Items: {},
  },
};

export const icalcTestConnectorStatePresentation: ConfigurationConnectorStatePresentation = {
  leftConnector: {
    mat017ItemListWithWidenData: [
      createIcalcTestMat017ItemWithWidenData({ id: undefined }),
      createIcalcTestMat017ItemWithWidenData({ id: undefined, matNumber: mat017ItemNumberTwo }),
    ],
    addedMat017Items: { [mat017ItemNumberOne]: 1, [mat017ItemNumberTwo]: 1 },
  },
  rightConnector: {
    mat017ItemListWithWidenData: [],
    addedMat017Items: {},
  },
};

export const createIcalcTestConnectorState = (
  override?: NestedPartial<ConfigurationConnectorState>
): ConfigurationConnectorState => {
  return mergePartially.deep(icalcTestConnectorState, override);
};

export const createIcalcTestConnectorStatePresentation = (
  override?: NestedPartial<ConfigurationConnectorStatePresentation>
): ConfigurationConnectorStatePresentation => {
  return mergePartially.deep(icalcTestConnectorStatePresentation, override);
};

const firstMat017Item = createIcalcTestMat017ItemWithWidenData();
const secondMat017Item = createIcalcTestMat017ItemWithWidenData();

const configurationSnapshotConnectorState: ConfigurationConnectorState = {
  leftConnector: {
    mat017ItemListWithWidenData: [
      createIcalcTestRedactedMat017ItemWithWidenData({
        id: undefined,
        overrides: {
          itemDescription1: firstMat017Item.itemDescription1,
          itemDescription2: firstMat017Item.itemDescription2,
          supplierItemNumber: firstMat017Item.supplierItemNumber,
        },
      }),
      createIcalcTestRedactedMat017ItemWithWidenData({
        id: undefined,
        matNumber: mat017ItemNumberTwo,
        overrides: {
          itemDescription1: secondMat017Item.itemDescription1,
          itemDescription2: secondMat017Item.itemDescription2,
          supplierItemNumber: secondMat017Item.supplierItemNumber,
        },
      }),
    ],
    addedMat017Items: { [mat017ItemNumberOne]: 1, [mat017ItemNumberTwo]: 1 },
  },
  rightConnector: {
    mat017ItemListWithWidenData: [],
    addedMat017Items: {},
  },
};

export const createConfigurationSnapshotConnectorState = (
  override?: NestedPartial<ConfigurationConnectorState>
): ConfigurationConnectorState => {
  return mergePartially.deep(configurationSnapshotConnectorState, override);
};

export const icalcTestMat017Item: Mat017Item = {
  amount: 1.337,
  amountDividedByPriceUnit: 1.34,
  id: 'e5e77c19-456a-4370-a328-b3eab8b5be6f',
  itemDescription1: 'TestDescription 1',
  itemDescription2: 'TestDescription 2',
  mat017ItemGroup: 'RC-K3',
  matNumber: 'MAT0170815',
  priceUnit: 0,
  supplierItemNumber: 'TestSupplierItemNumber',
  supplierId: 'TestSupplierId',
  itemStatus: Mat017ItemStatus.active,
};

export const createIcalcTestMat017Item = (): Mat017Item => {
  return icalcTestMat017Item;
};
