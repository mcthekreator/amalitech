// eslint-disable-next-line @nx/enforce-module-boundaries
import type {
  ActionModels,
  CableStructureItemList,
  Configuration,
  ConfigurationPresentation,
  Mat017ItemWithWidenData,
  WidenData,
  WidenDataItem,
} from '@igus/icalc-domain';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ArrayUtils,
  createIcalcTestConnectorState,
  createIcalcTestMat017ItemWithWidenData,
  getMatNumbersOfMat017ItemsFromActionModelsOnSide,
  getMatNumbersOfMat017ItemsFromConnectorStateOnSide,
  areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide,
  icalcTestConfiguration,
  getLastUpdatedWidenDataItem,
  ObjectUtils,
  updateMat017ItemWithWidenDataForTitleTag,
  createIcalcTestWidenDataItem,
  cacheBustMat017ImageUrl,
  filterWidenItemsByTitleTag,
  WIDEN_EMBED_FORMAT,
  updateUrlsInMat017ItemListWithWidenData,
} from '@igus/icalc-domain';

describe('configuration functions', () => {
  describe('getMatNumbersOfMat017ItemsFromConnectorStateOnSide', () => {
    let configuration: Configuration;
    const testMatNumber = 'MAT017_TEST';

    beforeEach(() => {
      configuration = {
        state: {
          connectorState: createIcalcTestConnectorState({
            leftConnector: {
              mat017ItemListWithWidenData: [
                createIcalcTestMat017ItemWithWidenData({ id: undefined, matNumber: testMatNumber }),
                createIcalcTestMat017ItemWithWidenData({ id: undefined, matNumber: `${testMatNumber}2` }),
              ],
              addedMat017Items: {
                [testMatNumber]: 1,
                [`${testMatNumber}2`]: 1,
              },
            },
          }),
        },
      } as Configuration;
    });

    it(`should throw error when calling method for left side given a undefined configuration`, () => {
      expect(() => getMatNumbersOfMat017ItemsFromConnectorStateOnSide(undefined, 'left')).toThrow();
    });

    it(`should return a list of ${testMatNumber}, ${testMatNumber}2 when calling method for left side given a configuration with these two mat017 items on left`, () => {
      expect(getMatNumbersOfMat017ItemsFromConnectorStateOnSide(configuration, 'left')).toEqual([
        testMatNumber,
        `${testMatNumber}2`,
      ]);
    });

    it(`should return a list of ${testMatNumber}, ${testMatNumber}2 when calling method for right side given a configuration with these two mat017 items on left and right`, () => {
      configuration.state.connectorState = createIcalcTestConnectorState({
        rightConnector: configuration.state.connectorState.leftConnector,
      });

      expect(getMatNumbersOfMat017ItemsFromConnectorStateOnSide(configuration, 'right')).toEqual([
        testMatNumber,
        `${testMatNumber}2`,
      ]);
    });
  });

  describe('areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide', () => {
    const testConfiguration = icalcTestConfiguration as ConfigurationPresentation;
    let configurationsMatItems: string[];

    beforeEach(() => {
      configurationsMatItems = getMatNumbersOfMat017ItemsFromConnectorStateOnSide(testConfiguration, 'left');
    });

    it('should return false when given configuration has less matItems than the given matItemList', () => {
      const testMatItems = [...configurationsMatItems, 'TEST123-MAT017-Item'];

      expect(
        areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(testMatItems, testConfiguration, 'left')
      ).toBeFalsy();
    });

    it('should return true when given configuration has the same number of matItems as the given matItemList', () => {
      expect(
        areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(configurationsMatItems, testConfiguration, 'left')
      ).toBeTruthy();
    });

    it('should return true when given configuration has more matItems than the given matItemList', () => {
      expect(
        areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide([configurationsMatItems[0]], testConfiguration, 'left')
      ).toBeTruthy();
    });
  });

  describe('getMatNumbersOfMat017ItemsFromActionModelsOnSide', () => {
    let chainflexCableStructure: CableStructureItemList;
    let actionModelWithOneMat017Item: ActionModels;

    beforeEach(() => {
      chainflexCableStructure = [
        {
          color: {
            cssClassName: 'white',
            translateKey: 'CORE_DESC_WH',
          },
          thickness: 0.14,
          type: 'core',
        },
      ];
      actionModelWithOneMat017Item = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '0': {
          left: { actionSelect: 'mat017Item', mat017Item: 'TEST123-MAT017-Item' },
          type: 'core',
          right: { actionSelect: 'none' },
        },
      };
    });

    it('should return empty Array for left mat017 items when chainflexCableStructure is an empty Array', () => {
      expect(ArrayUtils.isEmpty(getMatNumbersOfMat017ItemsFromActionModelsOnSide({}, [], 'left'))).toBeTruthy();
    });

    it('should return empty Array for right mat017 items when chainflexCableStructure is an empty Array', () => {
      expect(ArrayUtils.isEmpty(getMatNumbersOfMat017ItemsFromActionModelsOnSide({}, [], 'right'))).toBeTruthy();
    });

    it('should return empty Array when actionModel has no keys ({})', () => {
      expect(
        ArrayUtils.isEmpty(getMatNumbersOfMat017ItemsFromActionModelsOnSide({}, chainflexCableStructure, 'left'))
      ).toBeTruthy();
    });

    it('should return array with "TEST123-MAT017-Item" when actionModel has one key for left side and chainflex cable structure has one core', () => {
      expect(
        getMatNumbersOfMat017ItemsFromActionModelsOnSide(
          actionModelWithOneMat017Item,
          chainflexCableStructure,
          'left'
        )[0]
      ).toBe('TEST123-MAT017-Item');
    });

    it('should return array with "TEST123-MAT017-Item" when actionModel has one key for right side and chainflex cable structure has one core', () => {
      actionModelWithOneMat017Item[0].right = actionModelWithOneMat017Item[0].left;
      expect(
        getMatNumbersOfMat017ItemsFromActionModelsOnSide(
          actionModelWithOneMat017Item,
          chainflexCableStructure,
          'right'
        )[0]
      ).toBe('TEST123-MAT017-Item');
    });

    it('should return array with "TEST123-MAT017-Item" when actionModel has one key for left side and chainflex cable structure has one shield', () => {
      chainflexCableStructure[0].type = 'shield';
      expect(
        getMatNumbersOfMat017ItemsFromActionModelsOnSide(
          actionModelWithOneMat017Item,
          chainflexCableStructure,
          'left'
        )[0]
      ).toBe('TEST123-MAT017-Item');
    });

    it('should return empty array when actionModel has one key on left side and chainflex cable structure has one litze', () => {
      chainflexCableStructure[0].type = 'litze';
      expect(
        ArrayUtils.isEmpty(
          getMatNumbersOfMat017ItemsFromActionModelsOnSide(
            actionModelWithOneMat017Item,
            chainflexCableStructure,
            'left'
          )
        )
      ).toBeTruthy();
    });
  });

  describe('cacheBustMat017ImageUrl', () => {
    it('should add cb parameter to url', () => {
      const originalUrl = 'https://api.test.com/v2/assets/someId123';
      const updatedUrl = cacheBustMat017ImageUrl(originalUrl);

      expect(updatedUrl.includes(originalUrl)).toBeTruthy();
      expect(updatedUrl.includes('&cb=')).toBeTruthy();
    });

    it('should return empty string if url string is empty', () => {
      const originalUrl = '';
      const updatedUrl = cacheBustMat017ImageUrl(originalUrl);

      expect(updatedUrl).toBe('');
    });

    it('should return empty string if url string is undefined', () => {
      const originalUrl = null;
      const updatedUrl = cacheBustMat017ImageUrl(originalUrl);

      expect(updatedUrl).toBe('');
    });
  });

  describe('getLastUpdatedWidenDataItem', () => {
    const item1: WidenDataItem = createIcalcTestWidenDataItem();

    it('should return item with latest update date, if more than one is provided', () => {
      const items: WidenDataItem[] = [
        item1,
        createIcalcTestWidenDataItem({
          id: 'exampleId456',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          last_update_date: '2024-07-22T09:19:49Z' as unknown as Date,
        }),
        createIcalcTestWidenDataItem({
          id: 'exampleId789',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          last_update_date: '2024-08-01T07:33:49Z' as unknown as Date,
        }),
      ];

      const lastUpdatedItem = getLastUpdatedWidenDataItem(items);

      expect(lastUpdatedItem.id).toBe('exampleId789');
    });

    it('should return item with latest update date, if only one is provided', () => {
      const items: WidenDataItem[] = [item1];

      const item = getLastUpdatedWidenDataItem(items);

      expect(item.id).toBe('exampleId123');
    });
  });

  describe('updateMat017ItemWithWidenDataForTitleTag', () => {
    it('should update relevant fields in Mat017ItemWithWidenData', () => {
      const item: Mat017ItemWithWidenData = createIcalcTestMat017ItemWithWidenData({
        photoVersionId: '1',
        photoUrl: 'photoUrl',
      });

      const widenDataItem: WidenDataItem = createIcalcTestWidenDataItem();

      const copyOfOriginalItem = ObjectUtils.cloneDeep<Mat017ItemWithWidenData>(item);

      updateMat017ItemWithWidenDataForTitleTag(item, [widenDataItem], 'photo');

      expect(copyOfOriginalItem.photoUrl).not.toBe(item.photoUrl);
      expect(item.photoUrl.includes('&cb=')).toBeTruthy();
      expect(item.photoVersionId).toBe(widenDataItem.version_id);
    });
  });

  describe('filterWidenItemsByTitleTag', () => {
    it('should filter out all items by title tag correctly', () => {
      const items = [
        createIcalcTestWidenDataItem({
          id: '1',
          metadata: {
            fields: {
              titleTag: ['photo'],
            },
          },
        }),
        createIcalcTestWidenDataItem({
          id: '2',
          metadata: {
            fields: {
              titleTag: ['techDraw'],
            },
          },
        }),
        createIcalcTestWidenDataItem({
          id: '3',
          metadata: {
            fields: {
              titleTag: ['pinAss'],
            },
          },
        }),
        createIcalcTestWidenDataItem({
          id: '4',
          metadata: {
            fields: {
              titleTag: ['photo'],
            },
          },
        }),
        createIcalcTestWidenDataItem({
          id: '5',
          metadata: {
            fields: {
              titleTag: ['techDraw'],
            },
          },
        }),
        createIcalcTestWidenDataItem({
          id: '6',
          metadata: {
            fields: {
              titleTag: ['techDraw'],
            },
          },
        }),
      ];

      const photoItems = filterWidenItemsByTitleTag(items, 'photo');
      const pinAssItems = filterWidenItemsByTitleTag(items, 'pinAss');
      const techDrawItems = filterWidenItemsByTitleTag(items, 'techDraw');

      expect(photoItems.length).toBe(2);
      expect(pinAssItems.length).toBe(1);
      expect(pinAssItems[0].id).toBe('3');
      expect(techDrawItems.length).toBe(3);
    });
  });

  describe('updateUrlsInMat017ItemListWithWidenData', () => {
    const currentItemList = [
      createIcalcTestMat017ItemWithWidenData({
        matNumber: 'MAT017ITEM1',
        photoVersionId: '1',
        photoUrl: 'photoUrl1',
      }),
      createIcalcTestMat017ItemWithWidenData({
        matNumber: 'MAT017ITEM2',
        mat017ItemGroup: 'RC-K2',
        photoVersionId: '2',
        photoUrl: 'photoUrl2',
        techDrawVersionId: '3',
        techDrawUrl: 'techDrawUrl3',
        pinAssVersionId: '4',
        pinAssUrl: 'pinAssUrl4',
      }),
      createIcalcTestMat017ItemWithWidenData({
        matNumber: 'MAT017ITEM3',
        photoVersionId: '8',
        photoUrl: 'photoUrl8',
      }),
    ];

    it('should update relevant fields for all title tags correctly', () => {
      const widenData: WidenData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        total_count: 4,
        items: [
          createIcalcTestWidenDataItem({
            id: '11',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            version_id: 'newVersion1',
            metadata: {
              fields: {
                productid: ['MAT017ITEM1'],
                titleTag: ['photo'],
              },
            },
            embeds: {
              [WIDEN_EMBED_FORMAT]: {
                url: 'newPhotoUrl1',
              },
            },
          }),
          createIcalcTestWidenDataItem({
            id: '21',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            version_id: 'newVersion2',
            metadata: {
              fields: {
                productid: ['MAT017ITEM2'],
                titleTag: ['photo'],
              },
            },
            embeds: {
              [WIDEN_EMBED_FORMAT]: {
                url: 'newPhotoUrl2',
              },
            },
          }),
          createIcalcTestWidenDataItem({
            id: '22',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            version_id: 'newVersion3',
            metadata: {
              fields: {
                productid: ['MAT017ITEM2'],
                titleTag: ['techDraw'],
              },
            },
            embeds: {
              [WIDEN_EMBED_FORMAT]: {
                url: 'newTechDrawUrl3',
              },
            },
          }),
          createIcalcTestWidenDataItem({
            id: '23',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            version_id: 'newVersion4',
            metadata: {
              fields: {
                productid: ['MAT017ITEM2'],
                titleTag: ['pinAss'],
              },
            },
            embeds: {
              [WIDEN_EMBED_FORMAT]: {
                url: 'newPinAssUrl4',
              },
            },
          }),
        ],
      };

      const cloneOfIrrelevantItem = ObjectUtils.cloneDeep<Mat017ItemWithWidenData>(currentItemList[2]);

      updateUrlsInMat017ItemListWithWidenData(currentItemList, widenData);

      expect(ObjectUtils.isEqualJSONRepresentation(currentItemList[2], cloneOfIrrelevantItem)).toBeTruthy();

      expect(currentItemList.length).toBe(3);

      const firstUpdatedItem = currentItemList[0];

      expect(firstUpdatedItem.photoVersionId).toBe('newVersion1');
      expect(firstUpdatedItem.photoUrl.includes('newPhotoUrl1')).toBeTruthy();
      expect(firstUpdatedItem.photoUrl.includes('&cb=')).toBeTruthy();

      const secondUpdatedItem = currentItemList[1];

      expect(secondUpdatedItem.photoVersionId).toBe('newVersion2');
      expect(secondUpdatedItem.photoUrl.includes('newPhotoUrl2')).toBeTruthy();
      expect(secondUpdatedItem.photoUrl.includes('&cb=')).toBeTruthy();

      expect(secondUpdatedItem.techDrawVersionId).toBe('newVersion3');
      expect(secondUpdatedItem.techDrawUrl.includes('newTechDrawUrl3')).toBeTruthy();
      expect(secondUpdatedItem.techDrawUrl.includes('&cb=')).toBeTruthy();

      expect(secondUpdatedItem.pinAssVersionId).toBe('newVersion4');
      expect(secondUpdatedItem.pinAssUrl.includes('newPinAssUrl4')).toBeTruthy();
      expect(secondUpdatedItem.pinAssUrl.includes('&cb=')).toBeTruthy();
    });

    it('should return if no matching widen data is found', () => {
      const widenData: WidenData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        total_count: 0,
        items: [],
      };

      const cloneOfCurrentItemList = ObjectUtils.cloneDeep<Mat017ItemWithWidenData[]>(currentItemList);

      updateUrlsInMat017ItemListWithWidenData(currentItemList, widenData);

      expect(ObjectUtils.isEqualJSONRepresentation(currentItemList, cloneOfCurrentItemList)).toBeTruthy();
    });

    it('should not update items if current items do not match widen data items', () => {
      const widenData: WidenData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        total_count: 2,
        items: [
          createIcalcTestWidenDataItem({
            id: '51',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            version_id: 'newVersion5',
            metadata: {
              fields: {
                productid: ['MAT017ITEM5'],
                titleTag: ['photo'],
              },
            },
            embeds: {
              [WIDEN_EMBED_FORMAT]: {
                url: 'newPhotoUrl5',
              },
            },
          }),
          createIcalcTestWidenDataItem({
            id: '61',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            version_id: 'newVersion6',
            metadata: {
              fields: {
                productid: ['MAT017ITEM6'],
                titleTag: ['techDraw'],
              },
            },
            embeds: {
              [WIDEN_EMBED_FORMAT]: {
                url: 'techDrawUrl6',
              },
            },
          }),
        ],
      };

      const cloneOfCurrentItemList = ObjectUtils.cloneDeep<Mat017ItemWithWidenData[]>(currentItemList);

      updateUrlsInMat017ItemListWithWidenData(currentItemList, widenData);

      expect(ObjectUtils.isEqualJSONRepresentation(currentItemList, cloneOfCurrentItemList)).toBeTruthy();
    });
  });
});
