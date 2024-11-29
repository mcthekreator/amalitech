import type { Mat017Item, Mat017ItemWithWidenData, RedactedMat017ItemWithWidenData } from '../mat017-item';
import type {
  ConfigurationSnapshotData,
  ConfigurationState,
  Configuration,
  Mat017ItemsBaseDataMap,
  ConfigurationStatePresentation,
} from './configuration.model';
import { ObjectUtils } from '../../utils';

export const mat017ItemFieldsToOmit: (keyof Mat017ItemWithWidenData)[] = [
  'itemDescription1',
  'itemDescription2',
  'mat017ItemGroup',
  'supplierItemNumber',
  'amountDividedByPriceUnit',
  'supplierId',
  'itemStatus',
  'score',
  'modificationDate',
];

export class ConfigurationStateMapper {
  public static addMat017ItemBaseDataToConfigurationState(
    configurationState: ConfigurationState,
    mat017ItemsBaseDataByMatNumber: Mat017ItemsBaseDataMap
  ): ConfigurationState {
    const { leftConnector, rightConnector } = configurationState.connectorState;

    const configurationStateWithoutConnectorState = ObjectUtils.omitKeys(configurationState, ['connectorState']);

    if (!configurationStateWithoutConnectorState) {
      return configurationState;
    }

    return {
      ...configurationStateWithoutConnectorState,
      connectorState: {
        ...configurationState.connectorState,
        ...(!!leftConnector && {
          leftConnector: {
            ...leftConnector,
            mat017ItemListWithWidenData: leftConnector.mat017ItemListWithWidenData.map(
              (item: RedactedMat017ItemWithWidenData) => {
                return {
                  ...item,
                  overrides: {
                    ...(ObjectUtils.omitKeys(mat017ItemsBaseDataByMatNumber.get(item.matNumber) as Mat017Item, [
                      'matNumber',
                      'id',
                    ]) || {}),
                    ...item.overrides,
                  },
                };
              }
            ),
          },
        }),
        ...(!!rightConnector && {
          rightConnector: {
            ...rightConnector,
            mat017ItemListWithWidenData: rightConnector.mat017ItemListWithWidenData.map(
              (item: RedactedMat017ItemWithWidenData) => {
                return {
                  ...item,
                  overrides: {
                    ...(ObjectUtils.omitKeys(mat017ItemsBaseDataByMatNumber.get(item.matNumber) as Mat017Item, [
                      'matNumber',
                      'id',
                    ]) || {}),
                    ...item.overrides,
                  },
                };
              }
            ),
          },
        }),
      },
    };
  }

  public static removeMat017ItemBaseDataFromConnectorState(
    configurationState: ConfigurationStatePresentation,
    fieldsToRemove: (keyof Mat017ItemWithWidenData)[]
  ): ConfigurationStatePresentation {
    const configurationStateWithoutConnectorState = ObjectUtils.omitKeys(configurationState, ['connectorState']);

    if (!configurationStateWithoutConnectorState || !configurationState.connectorState) {
      return configurationState;
    }
    const { leftConnector, rightConnector } = configurationState.connectorState;

    return {
      ...configurationStateWithoutConnectorState,
      connectorState: {
        ...configurationState.connectorState,
        ...(!!leftConnector && {
          leftConnector: {
            ...leftConnector,
            mat017ItemListWithWidenData: leftConnector.mat017ItemListWithWidenData.map(
              (item: Mat017ItemWithWidenData) => {
                return ObjectUtils.omitKeys(item, fieldsToRemove);
              }
            ),
          },
        }),
        ...(!!rightConnector && {
          rightConnector: {
            ...rightConnector,
            mat017ItemListWithWidenData: rightConnector.mat017ItemListWithWidenData.map(
              (item: Mat017ItemWithWidenData) => {
                return ObjectUtils.omitKeys(item, fieldsToRemove);
              }
            ),
          },
        }),
      },
    } as ConfigurationStatePresentation;
  }
}

export class ConfigurationMapper {
  public static toSnapshotData(
    configuration: Configuration,
    mat017ItemsBaseDataByMatNumber: Mat017ItemsBaseDataMap
  ): ConfigurationSnapshotData {
    const {
      id,
      matNumber,
      labelingLeft,
      labelingRight,
      creationDate,
      modificationDate,
      createdBy,
      modifiedBy,
      partNumber,
      state,
      isCopyOfConfigurationId,
      description,
    } = configuration;

    return {
      id,
      matNumber,
      labelingLeft,
      labelingRight,
      creationDate,
      modificationDate,
      createdBy,
      modifiedBy,
      partNumber,
      state: ConfigurationMapper.addMat017ItemBaseDataToConfigurationState(state, mat017ItemsBaseDataByMatNumber),
      isCopyOfConfigurationId,
      description,
    };
  }

  private static addMat017ItemBaseDataToConfigurationState(
    configurationState: ConfigurationState,
    mat017ItemsBaseDataByMatNumber: Mat017ItemsBaseDataMap
  ): ConfigurationState {
    const { leftConnector, rightConnector } = configurationState.connectorState;

    const configurationStateWithoutConnectorState = ObjectUtils.omitKeys(configurationState, ['connectorState']);

    if (!configurationStateWithoutConnectorState) {
      return configurationState;
    }

    return {
      ...configurationStateWithoutConnectorState,
      connectorState: {
        ...configurationState.connectorState,
        ...(!!leftConnector && {
          leftConnector: {
            ...leftConnector,
            mat017ItemListWithWidenData: leftConnector.mat017ItemListWithWidenData.map(
              (item: RedactedMat017ItemWithWidenData) => {
                return {
                  ...item,
                  overrides: {
                    ...(ObjectUtils.omitKeys(mat017ItemsBaseDataByMatNumber.get(item.matNumber) as Mat017Item, [
                      'matNumber',
                      'priceUnit',
                      'amount',
                      'id',
                    ]) || {}),
                    itemStatus: item.itemStatus,
                    ...item.overrides,
                  },
                };
              }
            ),
          },
        }),
        ...(!!rightConnector && {
          rightConnector: {
            ...rightConnector,
            mat017ItemListWithWidenData: rightConnector.mat017ItemListWithWidenData.map(
              (item: RedactedMat017ItemWithWidenData) => {
                return {
                  ...item,
                  overrides: {
                    ...(ObjectUtils.omitKeys(mat017ItemsBaseDataByMatNumber.get(item.matNumber) as Mat017Item, [
                      'matNumber',
                      'priceUnit',
                      'amount',
                      'id',
                    ]) || {}),
                    itemStatus: item.itemStatus,
                    ...item.overrides,
                  },
                };
              }
            ),
          },
        }),
      },
    };
  }
}
