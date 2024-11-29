import {
  createConfiguration,
  createConfigurationSnapshot,
  createIcalcTestConnectorState,
  createIcalcTestLibraryState,
  createIcalcTestMat017ItemWithWidenData,
  createIcalcTestPinAssignmentState,
  createSingleCableCalculation,
} from '../../factories/objects';
import { Mat017ItemOverridesEnum } from '../calculation';
import type { Configuration, ConfigurationState, Mat017ItemChange } from './configuration.model';
import {
  createMat017ItemOverridesUpdater,
  getConfigurationDataFromSingleCableCalculations,
  getChangesFromMat017Items,
  getMat017ItemChangesInConfigurations,
  getMat017ItemChangesWithChangedAmountDividedByPriceUnit,
  getMat017ItemChangesWithRemovedOrInvalidStatus,
  getUsedMat017ItemsFromConfiguration,
  removeMat017ItemsInManyConfigurations,
  removeOverrides,
  haveItemGroupsOfMat017ItemsChanged,
  updateOverridesOfMat017ItemsInConfigurations,
  getUniqueMat017ItemsFromConfigurations,
} from './configuration.functions';
import type { Mat017Item, Mat017ItemRequiredOverrides } from '../mat017-item';
import { Mat017ItemStatus } from '../mat017-item';
import { createMat017Item } from '../../factories/objects/mat017-item';

const defaultMockOverrides: Mat017ItemRequiredOverrides = {
  amountDividedByPriceUnit: 1,
  mat017ItemGroup: 'RC-K8',
};

const defaultWorkStepOverrides = {
  testFieldPrep: 2,
  consignment: 4,
  labeling: 1,
};

const mockMat017Item = createIcalcTestMat017ItemWithWidenData({
  overrides: { ...defaultMockOverrides },
});

const mockMat017ItemWithoutChanges = createIcalcTestMat017ItemWithWidenData({
  matNumber: `${mockMat017Item.matNumber}-NO-CHANGES`,
});

const mockRemovedMat017Item = createIcalcTestMat017ItemWithWidenData({
  matNumber: `${mockMat017Item.matNumber}-REMOVED`,
  overrides: { ...defaultMockOverrides },
});

const { matNumber, mat017ItemGroup, itemDescription1, amountDividedByPriceUnit, ...rest } = createMat017Item({
  matNumber: mockMat017Item.matNumber,
});

const mockMat017ItemsBaseDataByMatNumber: Map<string, Mat017Item> = new Map();

mockMat017ItemsBaseDataByMatNumber.set(matNumber, {
  matNumber,
  mat017ItemGroup,
  itemDescription1,
  amountDividedByPriceUnit,
  ...rest,
});

mockMat017ItemsBaseDataByMatNumber.set(mockMat017ItemWithoutChanges.matNumber, {
  ...mockMat017ItemWithoutChanges,
});

const mockConfiguration = createConfiguration({
  state: {
    connectorState: createIcalcTestConnectorState({
      leftConnector: {
        mat017ItemListWithWidenData: [{ ...mockMat017Item }],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        addedMat017Items: { MAT0170815: 1 },
      },
      rightConnector: {
        mat017ItemListWithWidenData: [{ ...mockMat017Item }],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        addedMat017Items: { MAT0170815: 1 },
      },
    }),
    libraryState: createIcalcTestLibraryState({
      imageList: [{ src: 'fake-src', matNumber: mockMat017Item.matNumber }, { src: 'fake-src-2' }],
    }),
    pinAssignmentState: createIcalcTestPinAssignmentState({
      actionModels: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '0': {
          left: {
            mat017Item: mockMat017Item.matNumber,
            actionSelect: 'mat017Item',
          },
          type: 'core',
          right: {
            mat017Item: mockMat017Item.matNumber,
            actionSelect: 'mat017Item',
          },
        },
      },
    }),
    workStepOverrides: {
      ...defaultWorkStepOverrides,
    },
  },
}) as Configuration;

const mockConfigurationWithRemovedMat017Item = createConfiguration({
  state: {
    connectorState: createIcalcTestConnectorState({
      leftConnector: {
        mat017ItemListWithWidenData: [mockRemovedMat017Item],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        addedMat017Items: { [mockRemovedMat017Item.matNumber]: 1 },
      },
    }),
  },
}) as Configuration;

const mockConfigurationWithOnlyConnectorState = {
  ...createConfiguration({
    id: 'configurationWithOnlyConnectorState',
  }),
  state: {
    connectorState: mockConfiguration.state.connectorState,
    workStepSet: mockConfiguration.state.workStepSet,
  } as ConfigurationState,
} as Configuration;

const mockConfigurationWithoutRightConnector = {
  ...createConfiguration(),
  id: 'configurationWithoutRightConnector',
  state: {
    connectorState: {
      leftConnector: mockConfiguration.state.connectorState.leftConnector,
      rightConnector: undefined,
    },
    workStepSet: mockConfiguration.state.workStepSet,
    workStepOverrides: { ...defaultWorkStepOverrides },
  } as ConfigurationState,
} as Configuration;

const mockConfigurationWithDefaultState = {
  ...createConfiguration(),
  state: {
    workStepSet: mockConfiguration.state.workStepSet,
  } as ConfigurationState,
} as Configuration;

const firstSingleCableCalculation = createSingleCableCalculation({
  configurationId: mockConfiguration.id,
  configuration: mockConfiguration,
  snapshotId: null,
});

const configurationSnapshot = createConfigurationSnapshot();

const secondSngleCableCalculation = createSingleCableCalculation({
  snapshotId: configurationSnapshot.id,
  snapshot: configurationSnapshot,
  configurationId: null,
});

const thirdSingleCableCalculation = createSingleCableCalculation({
  configurationId: mockConfiguration.id,
  configuration: {
    ...mockConfiguration,
    state: {},
  },
  snapshotId: null,
});

const baseMockMat017ItemChanges = {
  currentOverrides: { ...defaultMockOverrides },
  usedInPinAssignment: false,
  usedInSketch: false,
};

const mat017ItemChangesOfRemoved: Mat017ItemChange = {
  ...baseMockMat017ItemChanges,
  matNumber: 'MAT017Item-Removed',
  itemDescription1: null,
  itemDescription2: null,
  itemStatus: Mat017ItemStatus.removed,
  newOverrides: {},
};

const mat017ItemChangesOfInactiveWithoutPrice: Mat017ItemChange = {
  ...baseMockMat017ItemChanges,
  matNumber: 'MAT017Item-Inactive',
  itemDescription1: null,
  itemDescription2: null,
  itemStatus: Mat017ItemStatus.inactive,
  newOverrides: {
    amountDividedByPriceUnit: null,
    mat017ItemGroup: 'RC-K8',
  },
};

const mat017ItemChangesOfInactiveWithoutNewOverrides: Mat017ItemChange = {
  ...baseMockMat017ItemChanges,
  matNumber: 'MAT017Item-Inactive',
  itemDescription1: null,
  itemDescription2: null,
  itemStatus: Mat017ItemStatus.inactive,
  newOverrides: {},
};

const mat017ItemChangesOfActive: Mat017ItemChange = {
  ...baseMockMat017ItemChanges,
  matNumber: 'MAT017Item-Active',
  itemDescription1: 'desc1',
  itemDescription2: 'desc2',
  itemStatus: Mat017ItemStatus.active,
  newOverrides: {
    amountDividedByPriceUnit: 2,
    mat017ItemGroup: 'RC-K8',
  },
};

describe('createMat017ItemsOverridesUpdater', () => {
  it('should correctly update many properties of overrides', () => {
    const mockUpdateOverrides = [
      Mat017ItemOverridesEnum.mat017ItemGroup,
      Mat017ItemOverridesEnum.amountDividedByPriceUnit,
    ];

    const overridesUpdater = createMat017ItemOverridesUpdater(
      mockConfiguration,
      mockMat017ItemsBaseDataByMatNumber,
      mockUpdateOverrides
    );
    const { mat017ItemListWithWidenData, mat017ItemOverridesChanges } = overridesUpdater('leftConnector');

    expect(mat017ItemListWithWidenData).toHaveLength(1);
    expect(mat017ItemListWithWidenData[0].overrides).toEqual({
      mat017ItemGroup,
      amountDividedByPriceUnit,
    });

    expect(mat017ItemOverridesChanges.get(mat017ItemListWithWidenData[0].matNumber)).toEqual({
      mat017ItemGroup,
      amountDividedByPriceUnit,
    });
  });

  it('should correctly update one property of overrides', () => {
    const mockUpdateOverrides = [Mat017ItemOverridesEnum.mat017ItemGroup];

    const overridesUpdater = createMat017ItemOverridesUpdater(
      mockConfiguration,
      mockMat017ItemsBaseDataByMatNumber,
      mockUpdateOverrides
    );
    const { mat017ItemListWithWidenData, mat017ItemOverridesChanges } = overridesUpdater('leftConnector');

    expect(mat017ItemListWithWidenData).toHaveLength(1);
    expect(mat017ItemListWithWidenData[0].overrides).toEqual({
      mat017ItemGroup,
      amountDividedByPriceUnit: defaultMockOverrides.amountDividedByPriceUnit,
    });

    expect(mat017ItemOverridesChanges.get(mat017ItemListWithWidenData[0].matNumber)).toEqual({
      mat017ItemGroup,
    });
  });

  it('should not update overrides if the mat017Item is missing in base data', () => {
    const mockUpdateOverrides = [
      Mat017ItemOverridesEnum.mat017ItemGroup,
      Mat017ItemOverridesEnum.amountDividedByPriceUnit,
    ];

    const overridesUpdater = createMat017ItemOverridesUpdater(mockConfiguration, new Map(), mockUpdateOverrides);
    const { mat017ItemListWithWidenData, mat017ItemOverridesChanges } = overridesUpdater('leftConnector');

    expect(mat017ItemListWithWidenData).toHaveLength(1);
    expect(mat017ItemListWithWidenData[0].overrides).toEqual(defaultMockOverrides);

    expect(mat017ItemOverridesChanges.get(mat017ItemListWithWidenData[0].matNumber)).toEqual({});
  });

  it('should not update overrides if provided invalid overrides properties', () => {
    const mockUpdateOverrides = ['fakeProperty1', 'fakeProperty2'] as unknown as Mat017ItemOverridesEnum[];

    const overridesUpdater = createMat017ItemOverridesUpdater(
      mockConfiguration,
      mockMat017ItemsBaseDataByMatNumber,
      mockUpdateOverrides
    );
    const { mat017ItemListWithWidenData, mat017ItemOverridesChanges } = overridesUpdater('leftConnector');

    expect(mat017ItemListWithWidenData).toHaveLength(1);
    expect(mat017ItemListWithWidenData[0].overrides).toEqual(defaultMockOverrides);

    expect(mat017ItemOverridesChanges.get(mat017ItemListWithWidenData[0].matNumber)).toEqual({});
  });
});

describe('getConfigurationDataFromSingleCableCalculations', () => {
  it('should extract a list of configurations with connectorState from SingleCableCalculations', () => {
    const result = getConfigurationDataFromSingleCableCalculations([
      firstSingleCableCalculation,
      secondSngleCableCalculation,
      thirdSingleCableCalculation,
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(firstSingleCableCalculation.configurationId);
    expect(result[1].id).toBe(secondSngleCableCalculation.snapshot.configurationData.id);
  });
});

describe('haveMat017ItemGroupsChanged', () => {
  it('should return true if mat017ItemGroups are within changes map', () => {
    const testMap = new Map();

    testMap.set(mockMat017Item.matNumber, { mat017ItemGroup: 'RC-KTest' });
    const result = haveItemGroupsOfMat017ItemsChanged([testMap, testMap]);

    expect(result).toBeTruthy();
  });

  it('should return false if mat017ItemGroups is not within changes map', () => {
    const testMap = new Map();

    testMap.set(mockMat017Item.matNumber, { itemDescription1: 'Test' });
    const result = haveItemGroupsOfMat017ItemsChanged([testMap, testMap]);

    expect(result).toBeFalsy();
  });
});

describe('updateMat017ItemsOverridesInConfigurations', () => {
  it('should handle configurations with only partial state', () => {
    const mockUpdateOverrides = [
      Mat017ItemOverridesEnum.mat017ItemGroup,
      Mat017ItemOverridesEnum.amountDividedByPriceUnit,
    ];

    const { updatedConfigurations, configurationsWithChangedMat017ItemGroups } =
      updateOverridesOfMat017ItemsInConfigurations(mockUpdateOverrides, mockMat017ItemsBaseDataByMatNumber, [
        mockConfigurationWithDefaultState,
      ]);

    expect(updatedConfigurations).toHaveLength(1);
    expect(updatedConfigurations[0].state).toEqual(mockConfigurationWithDefaultState.state);
    expect(configurationsWithChangedMat017ItemGroups).toHaveLength(0);
  });

  it('should update mat017ItemsOverrides in configurations and detect configurations with changed mat017ItemGroups, when mat017ItemGroup was updated', () => {
    const mockUpdateOverrides = [
      Mat017ItemOverridesEnum.mat017ItemGroup,
      Mat017ItemOverridesEnum.amountDividedByPriceUnit,
    ];

    const { updatedConfigurations, configurationsWithChangedMat017ItemGroups } =
      updateOverridesOfMat017ItemsInConfigurations(mockUpdateOverrides, mockMat017ItemsBaseDataByMatNumber, [
        mockConfiguration,
        mockConfigurationWithRemovedMat017Item,
      ]);

    expect(updatedConfigurations).toHaveLength(2);
    expect(configurationsWithChangedMat017ItemGroups).toHaveLength(1);

    expect(updatedConfigurations[0].id).toEqual(configurationsWithChangedMat017ItemGroups[0]);

    expect(
      updatedConfigurations[0].state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides
    ).toEqual({
      mat017ItemGroup,
      amountDividedByPriceUnit,
    });
  });

  it('should update mat017ItemsOverrides in configurations and detect no configurations with changed mat017ItemGroups, when mat017ItemGroup was not updated', () => {
    const mockUpdateOverrides = [Mat017ItemOverridesEnum.amountDividedByPriceUnit];

    const { updatedConfigurations, configurationsWithChangedMat017ItemGroups } =
      updateOverridesOfMat017ItemsInConfigurations(mockUpdateOverrides, mockMat017ItemsBaseDataByMatNumber, [
        mockConfiguration,
      ]);

    expect(updatedConfigurations).toHaveLength(1);
    expect(configurationsWithChangedMat017ItemGroups).toHaveLength(0);

    expect(
      updatedConfigurations[0].state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides
    ).toEqual({
      mat017ItemGroup: mockMat017Item.overrides.mat017ItemGroup,
      amountDividedByPriceUnit,
    });
  });
});

describe('getUsedMat017ItemsFromConfiguration', () => {
  it('should detect mat017Items used in pinAssignment or library of configuration', () => {
    const { usedInLibrary, usedInPinAssignment } = getUsedMat017ItemsFromConfiguration(mockConfiguration, [
      mockMat017Item,
      mockRemovedMat017Item,
    ]);

    expect(usedInLibrary.get(mockMat017Item.matNumber)).toBeTruthy();
    expect(usedInPinAssignment.get(mockMat017Item.matNumber)).toBeTruthy();

    expect(usedInLibrary.get(mockRemovedMat017Item.matNumber)).toBeFalsy();
    expect(usedInPinAssignment.get(mockRemovedMat017Item.matNumber)).toBeFalsy();
  });

  it('should not detect any used mat017Items when they are not added in library and pinAssignment', () => {
    const { usedInLibrary, usedInPinAssignment } = getUsedMat017ItemsFromConfiguration(
      mockConfigurationWithRemovedMat017Item,
      [mockMat017Item, mockRemovedMat017Item]
    );

    expect(usedInLibrary.get(mockMat017Item.matNumber)).toBeFalsy();
    expect(usedInPinAssignment.get(mockMat017Item.matNumber)).toBeFalsy();

    expect(usedInLibrary.get(mockRemovedMat017Item.matNumber)).toBeFalsy();
    expect(usedInPinAssignment.get(mockRemovedMat017Item.matNumber)).toBeFalsy();
  });

  it('should not detect any used mat017Items when pinAssignment or library states do not exist', () => {
    const { usedInLibrary, usedInPinAssignment } = getUsedMat017ItemsFromConfiguration(
      mockConfigurationWithOnlyConnectorState,
      [mockMat017Item, mockRemovedMat017Item]
    );

    expect(usedInLibrary.get(mockMat017Item.matNumber)).toBeFalsy();
    expect(usedInPinAssignment.get(mockMat017Item.matNumber)).toBeFalsy();

    expect(usedInLibrary.get(mockRemovedMat017Item.matNumber)).toBeFalsy();
    expect(usedInPinAssignment.get(mockRemovedMat017Item.matNumber)).toBeFalsy();
  });
});

describe('getUniqueMat017ItemsFromConfigurations', () => {
  it('should get list of uniquie mat017Items from a list of configurations', () => {
    const mat017ItemsList = getUniqueMat017ItemsFromConfigurations([mockConfiguration]);

    expect(mat017ItemsList).toHaveLength(1);
  });
});

describe('getMat017ItemsChangesWithChangedAmountDividedByPriceUnit', () => {
  it('should correctly return mat017Items with changed amountDividedByPriceUnit', () => {
    const items = getMat017ItemChangesWithChangedAmountDividedByPriceUnit([
      mat017ItemChangesOfRemoved,
      mat017ItemChangesOfInactiveWithoutPrice,
      mat017ItemChangesOfInactiveWithoutNewOverrides,
      mat017ItemChangesOfActive,
    ]);

    expect(items).toHaveLength(1);
    expect(items[0].matNumber).toEqual(mat017ItemChangesOfActive.matNumber);
  });
});

describe('getMat017ItemsChangesWithRemovedOrInvalidStatus', () => {
  it('should correctly return mat017Items with removed or invalid status', () => {
    const items = getMat017ItemChangesWithRemovedOrInvalidStatus([
      mat017ItemChangesOfRemoved,
      mat017ItemChangesOfInactiveWithoutPrice,
      mat017ItemChangesOfActive,
    ]);

    expect(items).toHaveLength(2);
    expect(items[0].matNumber).toEqual(mat017ItemChangesOfRemoved.matNumber);
    expect(items[1].matNumber).toEqual(mat017ItemChangesOfInactiveWithoutPrice.matNumber);
  });
});

describe('getMat017ItemsChanges', () => {
  it('should have no changes or removals when called with empty mat017Items list', () => {
    const mat017ItemsChanges = getChangesFromMat017Items([], new Map(), {
      usedInLibrary: new Map(),
      usedInPinAssignment: new Map(),
    });

    expect(mat017ItemsChanges).toHaveLength(0);
  });

  it('should detect mat017Items changes', () => {
    const mat017ItemsChanges = getChangesFromMat017Items([mockMat017Item], mockMat017ItemsBaseDataByMatNumber, {
      usedInLibrary: new Map(),
      usedInPinAssignment: new Map(),
    });

    expect(mat017ItemsChanges).toHaveLength(1);

    const mat017ItemBaseData = mockMat017ItemsBaseDataByMatNumber.get(mockMat017Item.matNumber);

    expect(mat017ItemsChanges[0]).toEqual({
      currentOverrides: { ...defaultMockOverrides },
      itemStatus: mockMat017Item.itemStatus,
      matNumber: mockMat017Item.matNumber,
      itemDescription1: mockMat017Item.itemDescription1,
      itemDescription2: mockMat017Item.itemDescription2,
      newOverrides: {
        amountDividedByPriceUnit: mat017ItemBaseData.amountDividedByPriceUnit,
        mat017ItemGroup: mat017ItemBaseData.mat017ItemGroup,
      },
      usedInPinAssignment: false,
      usedInSketch: false,
    });
  });

  it('should detect mat017Items removals', () => {
    const { matNumber: removedMatNumber } = mockRemovedMat017Item;
    const usedMat017Items = { usedInLibrary: new Map(), usedInPinAssignment: new Map() };

    usedMat017Items.usedInLibrary.set(removedMatNumber, true);
    usedMat017Items.usedInPinAssignment.set(removedMatNumber, true);

    const mat017ItemsChanges = getChangesFromMat017Items(
      [mockRemovedMat017Item],
      mockMat017ItemsBaseDataByMatNumber,
      usedMat017Items
    );

    const mat017ItemsWithChangedPrice = getMat017ItemChangesWithChangedAmountDividedByPriceUnit(mat017ItemsChanges);
    const mat017ItemsRemovedOrInvalid = getMat017ItemChangesWithRemovedOrInvalidStatus(mat017ItemsChanges);

    expect(mat017ItemsWithChangedPrice).toHaveLength(0);
    expect(mat017ItemsRemovedOrInvalid).toHaveLength(1);

    expect(mat017ItemsRemovedOrInvalid[0]).toEqual({
      currentOverrides: { ...defaultMockOverrides },
      newOverrides: {},
      itemDescription1: null,
      itemDescription2: null,
      itemStatus: Mat017ItemStatus.removed,
      matNumber: removedMatNumber,
      usedInPinAssignment: true,
      usedInSketch: true,
    });
  });
});

describe('getMat017ItemsChangesFromConfigurations', () => {
  it('should detect mat017Items changes in list of configurations', () => {
    const { hasAmountDividedByPriceUnitChanged, hasInvalidOrRemovedItems, configurations } =
      getMat017ItemChangesInConfigurations(
        [mockConfiguration, mockConfigurationWithRemovedMat017Item],
        mockMat017ItemsBaseDataByMatNumber
      );

    expect(configurations).toHaveLength(2);
    expect(hasAmountDividedByPriceUnitChanged).toBeTruthy();
    expect(hasInvalidOrRemovedItems).toBeTruthy();

    const mat017ItemsWithChangedPrice = getMat017ItemChangesWithChangedAmountDividedByPriceUnit(
      configurations[0].mat017ItemsChanges
    );
    const mat017ItemsRemovedOrInvalid = getMat017ItemChangesWithRemovedOrInvalidStatus(
      configurations[0].mat017ItemsChanges
    );

    expect(mat017ItemsWithChangedPrice).toHaveLength(1);
    expect(mat017ItemsRemovedOrInvalid).toHaveLength(0);

    const mat017ItemsWithChangedPrice1 = getMat017ItemChangesWithChangedAmountDividedByPriceUnit(
      configurations[1].mat017ItemsChanges
    );
    const mat017ItemsRemovedOrInvalid2 = getMat017ItemChangesWithRemovedOrInvalidStatus(
      configurations[1].mat017ItemsChanges
    );

    expect(mat017ItemsWithChangedPrice1).toHaveLength(0);
    expect(mat017ItemsRemovedOrInvalid2).toHaveLength(1);
  });
});

describe('removeOverrides', () => {
  it('should return workStepOverrides object with removed overrides without mutating the input', () => {
    const { workStepOverrides, removedOverrides } = removeOverrides(mockConfiguration.state.workStepOverrides, [
      'testFieldPrep',
    ]);

    expect(workStepOverrides['testFieldPrep']).toBeUndefined();
    expect(removedOverrides.includes('testFieldPrep')).toBeTruthy();

    expect(mockConfiguration.state.workStepOverrides['testFieldPrep']).toBeDefined();
  });
});

describe('removeMat017ItemsInManyConfigurations', () => {
  it('should remove provided mat017Items from respective configurations', () => {
    const result = removeMat017ItemsInManyConfigurations(
      [mockConfiguration, mockConfigurationWithOnlyConnectorState, mockConfigurationWithoutRightConnector],
      {
        [mockConfiguration.id]: [mockMat017Item.matNumber],
        [mockConfigurationWithOnlyConnectorState.id]: [mockMat017Item.matNumber],
      }
    );

    const firstResult = result.updatedConfigurations[0];
    const firstResultConnectorState = firstResult.configuration.state.connectorState;
    const { workStepOverrides } = firstResult.configuration.state;
    const firstResultHasRemovedMat017Items = firstResult.hasRemovedMat017Items;
    const firstResultHasRemovedOverrides = firstResult.hasRemovedOverrides;

    const foundRemovedMat017ItemInFirstResult =
      firstResultConnectorState.leftConnector.mat017ItemListWithWidenData.find(
        (item) => item.matNumber === mockMat017Item.matNumber
      );

    expect(firstResultConnectorState.leftConnector.addedMat017Items[mockMat017Item.matNumber]).toBeUndefined();
    expect(foundRemovedMat017ItemInFirstResult).toBeUndefined();
    expect(firstResultHasRemovedMat017Items).toBeTruthy();
    expect(firstResultHasRemovedOverrides).toBeTruthy();
    expect(result.configurationsWithRemovedMat017ItemsMap.get(mockConfiguration.id)).toBeTruthy();
    expect(result.configurationsWithRemovedOverrides.get(mockConfiguration.id)).toBeDefined();
    // due to removal of mat017Items, the related overrides testFieldPrep, consignment, labeling are removed
    expect(workStepOverrides).toEqual({
      crimp: 4,
      sendTestReport: 1,
    });

    const secondResult = result.updatedConfigurations[1];
    const secondResultConnectorState = secondResult.configuration.state.connectorState;
    const secondResultHasRemovedMat017Items = secondResult.hasRemovedMat017Items;
    const secondResultHasRemovedOverrides = secondResult.hasRemovedOverrides;

    const foundRemovedMat017ItemInSecondResult =
      secondResultConnectorState.leftConnector.mat017ItemListWithWidenData.find(
        (item) => item.matNumber === mockMat017Item.matNumber
      );

    expect(secondResultConnectorState.leftConnector.addedMat017Items[mockMat017Item.matNumber]).toBeUndefined();
    expect(foundRemovedMat017ItemInSecondResult).toBeUndefined();
    expect(secondResultHasRemovedMat017Items).toBeTruthy();
    expect(secondResultHasRemovedOverrides).toBeFalsy();
    expect(result.configurationsWithRemovedMat017ItemsMap.get(mockConfigurationWithOnlyConnectorState.id)).toBeTruthy();
    expect(result.configurationsWithRemovedOverrides.get(mockConfigurationWithOnlyConnectorState.id)).toBeUndefined();

    const thirdResult = result.updatedConfigurations[2];
    const thirdResultConnectorState = thirdResult.configuration.state.connectorState;
    const thirdResultWorkStepOverrides = thirdResult.configuration.state.workStepOverrides;
    const thirdResultHasRemovedMat017Items = thirdResult.hasRemovedMat017Items;
    const thirdResultHasRemovedOverrides = thirdResult.hasRemovedOverrides;

    const foundRemovedMat017ItemInThirdResult =
      thirdResultConnectorState.leftConnector.mat017ItemListWithWidenData.find(
        (item) => item.matNumber === mockMat017Item.matNumber
      );

    expect(thirdResultConnectorState.leftConnector.addedMat017Items[mockMat017Item.matNumber]).toBeDefined();
    expect(foundRemovedMat017ItemInThirdResult).toBeDefined();
    expect(thirdResultHasRemovedMat017Items).toBeFalsy();
    expect(thirdResultHasRemovedOverrides).toBeFalsy();
    expect(result.configurationsWithRemovedMat017ItemsMap.get(mockConfigurationWithoutRightConnector.id)).toBeFalsy();
    expect(result.configurationsWithRemovedOverrides.get(mockConfigurationWithOnlyConnectorState.id)).toBeUndefined();

    // as no removal is performed on this configuration, the overrides stay untouched
    expect(thirdResultWorkStepOverrides).toEqual(mockConfigurationWithoutRightConnector.state.workStepOverrides);

    // ensure input objects are not mutated
    expect(
      mockConfiguration.state.connectorState.leftConnector.addedMat017Items[mockMat017Item.matNumber]
    ).toBeDefined();
    expect(mockConfiguration.state.workStepOverrides['testFieldPrep']).toBeDefined();
  });

  it('should return configuration untouched, when leftConnector is missing', () => {
    const result = removeMat017ItemsInManyConfigurations([mockConfigurationWithDefaultState], {
      [mockConfiguration.id]: [mockMat017Item.matNumber],
    });

    const firstResult = result.updatedConfigurations[0];

    expect(firstResult.configuration.state).toEqual(mockConfigurationWithDefaultState.state);
    expect(firstResult.hasRemovedMat017Items).toBeFalsy();
  });

  it('should be able to remove mat017Item from leftConnector, even when rightConnector is missing', () => {
    const result = removeMat017ItemsInManyConfigurations([mockConfigurationWithoutRightConnector], {
      [mockConfigurationWithoutRightConnector.id]: [mockMat017Item.matNumber],
    });

    const firstResult = result.updatedConfigurations[0];

    expect(
      firstResult.configuration.state.connectorState.leftConnector.addedMat017Items[mockMat017Item.matNumber]
    ).toBeUndefined();
    expect(firstResult.hasRemovedMat017Items).toBeTruthy();
  });
});
