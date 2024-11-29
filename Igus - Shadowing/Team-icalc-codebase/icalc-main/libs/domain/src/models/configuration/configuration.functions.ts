import { mergePartially } from 'merge-partially';
import { ObjectUtils } from '../../utils/object-utils';
import type {
  Configuration,
  ConfigurationConnectorState,
  ConfigurationPresentation,
  ConfigurationSnapshotData,
  ConfigurationsWithRemovedMat017Items,
  ConfigurationsWithRemovedOverridesMap,
  ConnectorSide,
  Mat017ItemChange,
  Mat017ItemsBaseDataMap,
  Mat017ItemChangesInConfigurations,
  Mat017ItemOverridesChangesMap,
  Mat017ItemOverridesUpdaterResult,
  RemoveMat017ItemsFromOneSideOfConnectorInConfigurationResult,
  RemoveOverridesFromConfigurationResult,
  UsedMat017Items,
} from './configuration.model';
import { WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS } from './configuration.model';
import { Mat017ItemOverridesEnum } from '../calculation';
import type { SingleCableCalculation } from '../single-cable-calculation';
import type {
  Mat017ItemOverrides,
  Mat017ItemWithWidenData,
  RedactedMat017ItemWithWidenData,
  WidenData,
  WidenDataItem,
  WidenTitleTag,
} from '../mat017-item';
import { Mat017ItemStatus, WIDEN_EMBED_FORMAT, getPriceUnit } from '../mat017-item';
import { ArrayUtils } from '../../utils/array-utils';
import { diff } from 'deep-object-diff';
import type { IcalcImage } from '../library';
import type { WorkStepType } from '../result/work-step.model';
import type { ActionModels, CableStructureItemList, Core, Litze, Shield, Twisting } from '../pin-assignment';
import { StringUtils } from '../../utils/string-utils';
import { NumberUtils } from '../../utils/number-utils';
import type { PriceUnitCharCode } from '../../dtos';

const getConnectorSides = (): ConnectorSide[] => ['leftConnector', 'rightConnector'];

const getUniqueMat017ItemsFromConfiguration = (
  configuration: Configuration | ConfigurationPresentation
): (Mat017ItemWithWidenData | RedactedMat017ItemWithWidenData)[] =>
  ArrayUtils.filterDuplicatesByKey(
    getConnectorSides().flatMap((connectorSide) =>
      ArrayUtils.fallBackToEmptyArray(
        configuration?.state?.connectorState?.[connectorSide]?.mat017ItemListWithWidenData
      )
    ),
    'matNumber'
  );

const flattenUniqueMat017ItemsFromConfigurations = (
  configurations: (Configuration | ConfigurationPresentation)[]
): (Mat017ItemWithWidenData | RedactedMat017ItemWithWidenData)[] => {
  return Array.from(
    new Set(configurations.flatMap((configuration) => getUniqueMat017ItemsFromConfiguration(configuration)))
  );
};

export const removeOverrides = (
  workStepOverrides: { [key in WorkStepType]?: number },
  workStepTypes: WorkStepType[]
): RemoveOverridesFromConfigurationResult => {
  return workStepTypes.reduce<RemoveOverridesFromConfigurationResult>(
    (acc, overrideToBeDeleted) => {
      const overrides = acc.workStepOverrides;

      if (overrides[overrideToBeDeleted]) {
        delete overrides[overrideToBeDeleted];

        acc.removedOverrides.push(overrideToBeDeleted);
      }

      return acc;
    },
    { workStepOverrides: { ...workStepOverrides } || {}, removedOverrides: [] }
  );
};

const getChangesOfMat017Item = (
  mat017Item: RedactedMat017ItemWithWidenData,
  mat017ItemBaseDataMap: Mat017ItemsBaseDataMap,
  usedMat017Items: UsedMat017Items
): Mat017ItemChange => {
  const { matNumber: currentMatNumber, overrides: currentOverrides } = mat017Item;
  const newMat017ItemData = mat017ItemBaseDataMap?.get(mat017Item.matNumber);

  currentOverrides.amountDividedByPriceUnit = NumberUtils.round(currentOverrides.amountDividedByPriceUnit);

  const baseMat017ItemChange = {
    matNumber: currentMatNumber,
    currentOverrides,
    usedInPinAssignment: usedMat017Items.usedInPinAssignment.get(currentMatNumber) ?? false,
    usedInSketch: usedMat017Items.usedInLibrary.get(currentMatNumber) ?? false,
  };

  // covers an edge case, where the Mat017Item would be removed from the database completely
  if (!newMat017ItemData) {
    return {
      ...baseMat017ItemChange,
      itemDescription1: null,
      itemDescription2: null,
      itemStatus: Mat017ItemStatus.removed,
      newOverrides: {},
    };
  }

  // covers use cases, where the Mat017Item status is ACTIVE, INACTIVE and REMOVED (soft removal with record stil saved in DB)
  return {
    ...baseMat017ItemChange,
    itemDescription1: StringUtils.coerceToNullIfEmpty(newMat017ItemData.itemDescription1),
    itemDescription2: StringUtils.coerceToNullIfEmpty(newMat017ItemData.itemDescription2),
    itemStatus: newMat017ItemData.itemStatus,
    newOverrides: {
      mat017ItemGroup: newMat017ItemData.mat017ItemGroup,
      amountDividedByPriceUnit: newMat017ItemData.amountDividedByPriceUnit,
    },
  };
};

export const getMatNumbersOfMat017ItemsFromConnectorStateOnSide = (
  configuration: Configuration | ConfigurationPresentation,
  side: 'left' | 'right'
): string[] => {
  if (!configuration) throw new Error('configuration has to be defined');
  return getConnectorSides()
    .filter((connectorSide) => (connectorSide as string).includes(side))
    .flatMap((connectorSide) =>
      configuration?.state?.connectorState?.[connectorSide]?.mat017ItemListWithWidenData.map((item) => item.matNumber)
    );
};

export const getUniqueMatNumbersOfMat017ItemsFromConfigurations = (
  configurations: (Configuration | ConfigurationPresentation)[]
): string[] => {
  return flattenUniqueMat017ItemsFromConfigurations(configurations).map((item) => item.matNumber);
};

export const areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide = (
  matNumberList: string[],
  configuration: Configuration | ConfigurationPresentation,
  side: 'left' | 'right'
): boolean => {
  const mat017ItemsInConfiguration = getMatNumbersOfMat017ItemsFromConnectorStateOnSide(configuration, side);

  for (const matNumber of matNumberList) {
    if (!mat017ItemsInConfiguration.includes(matNumber)) return false;
  }
  return true;
};

const extractMat017ItemsFromActionModelsOnSide = (
  numberOfCoresAndShields: number,
  actionModels: ActionModels,
  side: 'left' | 'right'
): Array<string> => {
  const pinAssignmentMat017Items = new Array<string>();

  for (let i = 0; i < numberOfCoresAndShields; i++) {
    const actionModel = side === 'left' ? actionModels[i].left : actionModels[i].right;

    if (actionModel.actionSelect === 'mat017Item') {
      const leftMat017item = actionModel.mat017Item;

      if (leftMat017item) {
        pinAssignmentMat017Items.push(leftMat017item);
      }
    }
  }

  return pinAssignmentMat017Items;
};

export const getMatNumbersOfMat017ItemsFromActionModelsOnSide = (
  actionModels: ActionModels,
  chainflexCableStructure: CableStructureItemList,
  side: 'left' | 'right'
): Array<string> => {
  if (ArrayUtils.isEmpty(Object.keys(actionModels))) return [];
  const coreAndShieldChainflexCables = ArrayUtils.fallBackToEmptyArray<Core | Shield | Twisting | Litze>(
    chainflexCableStructure
  ).filter((structureItem) => structureItem.type === 'core' || structureItem.type === 'shield');

  return extractMat017ItemsFromActionModelsOnSide(coreAndShieldChainflexCables.length, actionModels, side);
};

export const getUniqueMat017ItemsFromConfigurations = (
  configurations: (Configuration | ConfigurationPresentation)[]
): (Mat017ItemWithWidenData | RedactedMat017ItemWithWidenData)[] => {
  return flattenUniqueMat017ItemsFromConfigurations(configurations);
};

export const getUsedMat017ItemsFromConfiguration = (
  configuration: Configuration,
  mat017Items: RedactedMat017ItemWithWidenData[]
): UsedMat017Items => {
  const { imageList = [] } = configuration.state.libraryState ?? {};
  const libraryMat017Items = imageList.reduce((acc, nextImage: IcalcImage) => {
    if (!nextImage.matNumber) {
      return acc;
    }
    return acc.set(nextImage.matNumber, true);
  }, new Map<string, boolean>());

  const { actionModels = {} } = configuration.state.pinAssignmentState ?? {};

  const pinAssignmentMat017Items = Object.values(actionModels).reduce((acc, actionModel) => {
    const { left, right } = actionModel;

    if (left.mat017Item) {
      acc.set(left.mat017Item, true);
    }

    if (right.mat017Item) {
      acc.set(right.mat017Item, true);
    }
    return acc;
  }, new Map<string, boolean>());

  return mat017Items.reduce<UsedMat017Items>(
    (acc, nextMat017Item) => {
      const { matNumber } = nextMat017Item;

      if (libraryMat017Items.has(matNumber)) {
        acc.usedInLibrary.set(matNumber, true);
      }

      if (pinAssignmentMat017Items.has(matNumber)) {
        acc.usedInPinAssignment.set(matNumber, true);
      }

      return acc;
    },
    { usedInLibrary: new Map<string, boolean>(), usedInPinAssignment: new Map<string, boolean>() }
  );
};

export const createMat017ItemOverridesUpdater = (
  configuration: Configuration,
  mat017ItemsBaseDataByMatNumber: Mat017ItemsBaseDataMap,
  updateOverrides: Mat017ItemOverridesEnum[]
): ((connectorSide: keyof ConfigurationConnectorState) => Mat017ItemOverridesUpdaterResult) => {
  return (connectorSide: keyof ConfigurationConnectorState): Mat017ItemOverridesUpdaterResult => {
    const items = configuration.state.connectorState[connectorSide].mat017ItemListWithWidenData || [];

    const mat017ItemOverridesChanges = new Map<string, Partial<Mat017ItemOverrides>>();
    const updatedMat017ItemList = items.map((matItem: RedactedMat017ItemWithWidenData) => {
      const additionalOverrides = updateOverrides.reduce<Partial<Mat017ItemOverrides>>((acc, overridesProperty) => {
        const nextPropertyValue = mat017ItemsBaseDataByMatNumber?.get(matItem.matNumber)?.[overridesProperty];
        const hasNextValue = !!nextPropertyValue;

        return {
          ...acc,
          ...(hasNextValue && { [overridesProperty]: nextPropertyValue }),
        };
      }, {});

      const newOverrides = {
        ...matItem.overrides,
        ...additionalOverrides,
      };

      const changesToMat017ItemOverrides = diff(matItem.overrides, newOverrides);

      mat017ItemOverridesChanges.set(matItem.matNumber, changesToMat017ItemOverrides);

      return {
        ...matItem,
        overrides: newOverrides,
      };
    });

    return { mat017ItemListWithWidenData: updatedMat017ItemList, mat017ItemOverridesChanges };
  };
};

export const getConfigurationDataFromSingleCableCalculations = (sccList: SingleCableCalculation[]): Configuration[] => {
  return sccList
    .filter((scc) => scc.configuration?.state?.connectorState || scc.configurationId === null) // filter out active configurations which dont have connectorState yet
    .map((scc) => scc.configuration ?? (scc.snapshot?.configurationData as ConfigurationSnapshotData));
};

export const haveItemGroupsOfMat017ItemsChanged = (
  mat017ItemOverridesChangesList: Mat017ItemOverridesChangesMap[]
): boolean => {
  const mat017ItemOverridesChanges = mat017ItemOverridesChangesList
    .flatMap((changeMap: Mat017ItemOverridesChangesMap) => Array.from(changeMap.values()))
    .flatMap((o) => Object.keys(o));

  return mat017ItemOverridesChanges.some((x) => x === Mat017ItemOverridesEnum.mat017ItemGroup);
};

export type UpdateMat017ItemOverridesResult = {
  updatedConfigurations: Configuration[];
  configurationsWithChangedMat017ItemGroups: string[];
  configurationsWithRemovedOverridesMap: ConfigurationsWithRemovedOverridesMap;
};

export const updateOverridesOfMat017ItemsInConfigurations = (
  updateOverrides: Mat017ItemOverridesEnum[],
  mat017ItemsBaseDataByMatNumber: Mat017ItemsBaseDataMap,
  sourceConfigurations: Configuration[]
): UpdateMat017ItemOverridesResult => {
  return sourceConfigurations.reduce<UpdateMat017ItemOverridesResult>(
    (acc: UpdateMat017ItemOverridesResult, next: Configuration) => {
      const config = ObjectUtils.cloneDeep<Configuration>(next) as Configuration;

      const hasLeftConnector = !!config?.state?.connectorState?.leftConnector;
      const hasRightConnector = !!config?.state?.connectorState?.rightConnector;

      if (!hasLeftConnector && !hasRightConnector) {
        acc.updatedConfigurations.push(config);
        return acc;
      }

      const updateMat017ItemOverridesInConnectorState = createMat017ItemOverridesUpdater(
        config,
        mat017ItemsBaseDataByMatNumber,
        updateOverrides
      );

      const {
        mat017ItemListWithWidenData: leftConnectorMat017ItemsWithWidenData,
        mat017ItemOverridesChanges: leftConnectorMat017ItemOverridesChanges,
      } = updateMat017ItemOverridesInConnectorState('leftConnector');
      const {
        mat017ItemListWithWidenData: rightConnectorMat017ItemsWithWidenData,
        mat017ItemOverridesChanges: rightConnectorMat017ItemOverridesChanges,
      } = updateMat017ItemOverridesInConnectorState('rightConnector');

      const updatedConfiguration = mergePartially.deep(config, {
        state: {
          connectorState: {
            ...(hasLeftConnector && {
              leftConnector: {
                mat017ItemListWithWidenData: leftConnectorMat017ItemsWithWidenData,
              },
            }),
            ...(hasRightConnector && {
              rightConnector: {
                mat017ItemListWithWidenData: rightConnectorMat017ItemsWithWidenData,
              },
            }),
          },
        },
      });

      const mat017ItemGroupChanged = haveItemGroupsOfMat017ItemsChanged([
        leftConnectorMat017ItemOverridesChanges,
        rightConnectorMat017ItemOverridesChanges,
      ]);

      if (mat017ItemGroupChanged) {
        acc.configurationsWithChangedMat017ItemGroups.push(config.id);

        const { workStepOverrides, removedOverrides } = removeOverrides(
          updatedConfiguration.state.workStepOverrides,
          WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS
        );

        updatedConfiguration.state.workStepOverrides = workStepOverrides;

        acc.configurationsWithRemovedOverridesMap?.set(updatedConfiguration.id, removedOverrides);
      }
      acc.updatedConfigurations.push(updatedConfiguration);

      return acc;
    },
    {
      updatedConfigurations: [],
      configurationsWithChangedMat017ItemGroups: [],
      configurationsWithRemovedOverridesMap: new Map(),
    }
  );
};

const isMat017ItemStatusInactiveOrRemoved = (mat017ItemChange: Mat017ItemChange): boolean => {
  return (
    mat017ItemChange.itemStatus === Mat017ItemStatus.inactive ||
    mat017ItemChange.itemStatus === Mat017ItemStatus.removed
  );
};

/**
 * Accumulates changes from passed Mat017 Items. Inactive or removed items are always considered as changed because they have been active at some point before.
 *
 * @param mat017Items data that may contain changes
 * @param mat017ItemBaseDataMap data that serves as base where changes may be applied to
 * @param usedMat017Items the usage of the mat017 items in configurations pin assignment and library image
 */
export const getChangesFromMat017Items = (
  mat017Items: RedactedMat017ItemWithWidenData[],
  mat017ItemBaseDataMap: Mat017ItemsBaseDataMap,
  usedMat017Items: UsedMat017Items
): Mat017ItemChange[] => {
  return mat017Items
    .map<Mat017ItemChange>((item) => getChangesOfMat017Item(item, mat017ItemBaseDataMap, usedMat017Items))
    .filter((item) => {
      if (isMat017ItemStatusInactiveOrRemoved(item)) {
        return true;
      }

      if (item.newOverrides) {
        const changesToMat017ItemOverrides = diff(item.newOverrides, item.currentOverrides);

        return Object.keys(changesToMat017ItemOverrides).length > 0;
      }

      return true;
    });
};

export const getMat017ItemChangesWithChangedAmountDividedByPriceUnit = (
  changes: Mat017ItemChange[]
): Mat017ItemChange[] =>
  changes.filter(
    (item) =>
      item.itemStatus !== Mat017ItemStatus.removed &&
      !!item.newOverrides &&
      item.newOverrides.amountDividedByPriceUnit !== null &&
      item.currentOverrides.amountDividedByPriceUnit !== item.newOverrides.amountDividedByPriceUnit &&
      item.itemStatus !== Mat017ItemStatus.inactive
  );

export const getMat017ItemChangesWithRemovedOrInvalidStatus = (changes: Mat017ItemChange[]): Mat017ItemChange[] =>
  changes.filter(
    (item) => item.itemStatus === Mat017ItemStatus.removed || item.itemStatus === Mat017ItemStatus.inactive
  );

export const getMat017ItemChangesInConfigurations = (
  configurations: Configuration[],
  mat017ItemsBaseDataMap: Mat017ItemsBaseDataMap
): Mat017ItemChangesInConfigurations => {
  return configurations.reduce<Mat017ItemChangesInConfigurations>(
    (acc, configuration) => {
      const mat017Items = getUniqueMat017ItemsFromConfigurations([configuration]);
      const usedMat017Items = getUsedMat017ItemsFromConfiguration(configuration, mat017Items);

      const mat017ItemChanges = getChangesFromMat017Items(mat017Items, mat017ItemsBaseDataMap, usedMat017Items);
      const hasAmountDividedByPriceUnitChanged =
        getMat017ItemChangesWithChangedAmountDividedByPriceUnit(mat017ItemChanges).length > 0;
      const hasInvalidOrRemovedItems = getMat017ItemChangesWithRemovedOrInvalidStatus(mat017ItemChanges).length > 0;

      if (ArrayUtils.isNotEmpty(mat017ItemChanges)) {
        acc.configurations.push({
          id: configuration.id,
          matNumber: configuration.matNumber,
          mat017ItemsChanges: mat017ItemChanges,
        });
      }
      return {
        ...acc,
        ...(hasAmountDividedByPriceUnitChanged && { hasAmountDividedByPriceUnitChanged: true }),
        ...(hasInvalidOrRemovedItems && { hasInvalidOrRemovedItems: true }),
      };
    },
    { hasAmountDividedByPriceUnitChanged: false, hasInvalidOrRemovedItems: false, configurations: [] }
  );
};

export const getUniqueMat017ItemsWithOutdatedPricesFromOneConfiguration = (
  configuration: ConfigurationPresentation
): Mat017ItemWithWidenData[] => {
  const orderedUniqueMat017Items = getUniqueMat017ItemsFromConfiguration(configuration) as Mat017ItemWithWidenData[];

  return orderedUniqueMat017Items.filter(
    (item) =>
      item.itemStatus === Mat017ItemStatus.active &&
      !NumberUtils.areFloatsEqual(item.amountDividedByPriceUnit, item.overrides.amountDividedByPriceUnit)
  ) as Mat017ItemWithWidenData[];
};

const removeMat017ItemsFromOneSideOfConnectorInConfiguration = (
  configuration: Configuration,
  whichSide: keyof ConfigurationConnectorState,
  mat017Items: string[]
): RemoveMat017ItemsFromOneSideOfConnectorInConfigurationResult => {
  const connectorSide = configuration.state.connectorState[whichSide];
  const { addedMat017Items, removedFromAddedMat017Items } = Object.keys(connectorSide.addedMat017Items).reduce(
    (acc, next: string) => {
      if (mat017Items.includes(next)) {
        acc.removedFromAddedMat017Items.push(next);
      } else {
        acc.addedMat017Items = {
          ...acc.addedMat017Items,
          [next]: connectorSide.addedMat017Items[next],
        };
      }
      return acc;
    },
    { addedMat017Items: {}, removedFromAddedMat017Items: [] as string[] }
  );

  const result: RemoveMat017ItemsFromOneSideOfConnectorInConfigurationResult = {
    configuration: {
      ...configuration,
      state: {
        ...configuration.state,
        connectorState: {
          ...configuration.state.connectorState,
          [whichSide]: {
            addedMat017Items,
            mat017ItemListWithWidenData: connectorSide.mat017ItemListWithWidenData.filter(
              (item) => !mat017Items.includes(item.matNumber)
            ),
          },
        },
      },
    },
    removedFromAddedMat017Items,
    removedOverrides: [],
  };

  if (removedFromAddedMat017Items.length > 0) {
    const { workStepOverrides, removedOverrides } = removeOverrides(
      configuration.state.workStepOverrides,
      WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS
    );

    result.configuration.state.workStepOverrides = workStepOverrides;
    result.removedOverrides = [...removedOverrides];
  }

  return result;
};

const computeHasRemovedMat017Items = (removedMat017Items: string[], currentHasRemovedMat017Items: boolean): boolean => {
  return removedMat017Items.length > 0 || currentHasRemovedMat017Items;
};

const computeHasRemovedOverrides = (removedOverrides: string[], currentHasRemovedOverrides: boolean): boolean => {
  return removedOverrides.length > 0 || currentHasRemovedOverrides;
};

export const removeMat017ItemsInManyConfigurations = (
  sourceConfigurations: Configuration[],
  mat017ItemsToRemoveByConfigurationId: Record<string, string[]>
): ConfigurationsWithRemovedMat017Items => {
  return sourceConfigurations.reduce<ConfigurationsWithRemovedMat017Items>(
    (acc, configuration) => {
      const config = ObjectUtils.cloneDeep<Configuration>(configuration) as Configuration;
      let hasRemovedMat017Items = false;
      let hasRemovedOverrides = false;

      const defaultResult = {
        configuration: config,
        hasRemovedMat017Items,
        hasRemovedOverrides,
      };

      if (!config.state) {
        acc.updatedConfigurations.push(defaultResult);
        return acc;
      }

      const hasLeftConnector = !!config.state.connectorState?.leftConnector;
      const hasRightConnector = !!config.state.connectorState?.rightConnector;

      // in case of missing leftConnector we can stop here as there can't be rightConnector without left and no further computations are needed
      if (!hasLeftConnector) {
        acc.updatedConfigurations.push(defaultResult);
        return acc;
      }

      const mat017ItemsToRemove = ArrayUtils.fallBackToEmptyArray(mat017ItemsToRemoveByConfigurationId[config.id]);

      const {
        configuration: configurationWithUpdatedLeftConnector,
        removedFromAddedMat017Items: removedFromAddedMat017ItemsOfLeftSide,
        removedOverrides: removedOverridesForLeftConnector,
      } = removeMat017ItemsFromOneSideOfConnectorInConfiguration(config, 'leftConnector', mat017ItemsToRemove);

      hasRemovedMat017Items = computeHasRemovedMat017Items(
        removedFromAddedMat017ItemsOfLeftSide,
        hasRemovedMat017Items
      );
      hasRemovedOverrides = computeHasRemovedOverrides(removedOverridesForLeftConnector, hasRemovedOverrides);

      if (hasRemovedMat017Items) {
        acc.configurationsWithRemovedMat017ItemsMap.set(config.id, true);
      }

      if (hasRemovedOverrides) {
        acc.configurationsWithRemovedOverrides.set(config.id, removedOverridesForLeftConnector);
      }

      if (!hasRightConnector) {
        acc.updatedConfigurations.push({
          configuration: configurationWithUpdatedLeftConnector,
          hasRemovedMat017Items,
          hasRemovedOverrides,
        });

        return acc;
      }

      const {
        configuration: configurationWithUpdatedLeftAndRightConnectors,
        removedFromAddedMat017Items: removedFromAddedMat017ItemsOfRightSide,
        removedOverrides: removedOverridesForRightConnector,
      } = removeMat017ItemsFromOneSideOfConnectorInConfiguration(
        configurationWithUpdatedLeftConnector,
        'rightConnector',
        mat017ItemsToRemove
      );

      hasRemovedMat017Items = computeHasRemovedMat017Items(
        removedFromAddedMat017ItemsOfRightSide,
        hasRemovedMat017Items
      );
      hasRemovedOverrides = computeHasRemovedOverrides(removedOverridesForRightConnector, hasRemovedOverrides);

      if (hasRemovedMat017Items) {
        acc.configurationsWithRemovedMat017ItemsMap.set(config.id, true);
      }

      if (hasRemovedOverrides) {
        acc.configurationsWithRemovedOverrides.set(config.id, [
          ...removedOverridesForLeftConnector,
          ...removedOverridesForRightConnector,
        ]);
      }

      acc.updatedConfigurations.push({
        configuration: configurationWithUpdatedLeftAndRightConnectors,
        hasRemovedMat017Items,
        hasRemovedOverrides,
      });

      return acc;
    },
    {
      updatedConfigurations: [],
      configurationsWithRemovedMat017ItemsMap: new Map(),
      configurationsWithRemovedOverrides: new Map(),
    }
  );
};

export const getPriceUnitFromCode = (code: PriceUnitCharCode): number => {
  return getPriceUnit(code);
};

export const divideAmountByPriceUnit = (amount: number, priceUnit: PriceUnitCharCode): number => {
  const priceUnitCodeIntoValue = getPriceUnitFromCode(priceUnit);

  return amount / (NumberUtils.areFloatsEqual(priceUnitCodeIntoValue, 0) ? 1 : priceUnitCodeIntoValue);
};

export const calculateAmountDividedByPriceUnit = (amount: number, priceUnit: PriceUnitCharCode): number | null => {
  const price = divideAmountByPriceUnit(amount, priceUnit);

  if (!price || price <= 0) {
    return null;
  }

  return price < 0.01 ? 0.01 : NumberUtils.round(price);
};

export const cacheBustMat017ImageUrl = (picUrl: string | undefined): undefined | string => {
  return picUrl && picUrl.length > 0 ? `${picUrl}&cb=${new Date().getTime()}` : '';
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const sortByLastUpdateDate = (a: { last_update_date: Date }, b: { last_update_date: Date }): number => {
  return new Date(b.last_update_date).getTime() - new Date(a.last_update_date).getTime();
};

export const getLastUpdatedWidenDataItem = (items: WidenDataItem[]): WidenDataItem => {
  return items.sort(sortByLastUpdateDate)[0];
};

export const filterWidenItemsByTitleTag = (
  matchingItems: WidenDataItem[],
  titleTag: WidenTitleTag
): WidenDataItem[] => {
  return matchingItems.filter((widenItem) => widenItem.metadata.fields.titleTag[0] === titleTag);
};

export const updateMat017ItemWithWidenDataForTitleTag = (
  item: Mat017ItemWithWidenData,
  matchingItems: WidenDataItem[],
  titleTag: WidenTitleTag
): void => {
  const lastUpdatedItem = getLastUpdatedWidenDataItem(matchingItems); // each file format (png, jpg, etc.) gets it's own asset in widen, we want the newest one

  if (item[`${titleTag}VersionId`] !== lastUpdatedItem?.version_id) {
    item[`${titleTag}Url`] = cacheBustMat017ImageUrl(lastUpdatedItem?.embeds?.[WIDEN_EMBED_FORMAT]?.url);
    item[`${titleTag}VersionId`] = lastUpdatedItem?.version_id;
  }
};

export const updateUrlsInMat017ItemListWithWidenData = (
  currentItemList: Mat017ItemWithWidenData[],
  widenData: WidenData
): void => {
  if (widenData.total_count < 1) {
    return;
  }

  currentItemList.forEach((item) => {
    const matchingItems = widenData.items?.filter(
      (widenItem) => widenItem.metadata.fields.productid[0] === item.matNumber
    );

    const matchingPhotoItems = filterWidenItemsByTitleTag(matchingItems, 'photo');

    if (matchingPhotoItems?.length > 0) updateMat017ItemWithWidenDataForTitleTag(item, matchingPhotoItems, 'photo');

    if (item.mat017ItemGroup === 'RC-K2') {
      const matchingTechDrawItems = filterWidenItemsByTitleTag(matchingItems, 'techDraw');

      if (matchingTechDrawItems?.length > 0)
        updateMat017ItemWithWidenDataForTitleTag(item, matchingTechDrawItems, 'techDraw');

      const matchingPinAssItems = filterWidenItemsByTitleTag(matchingItems, 'pinAss');

      if (matchingPinAssItems?.length > 0)
        updateMat017ItemWithWidenDataForTitleTag(item, matchingPinAssItems, 'pinAss');
    }
  });
};
