import type {
  Calculation,
  CalculationPresentation,
  Configuration,
  ConfigurationPresentation,
  ConfigurationSnapshot,
  ConfigurationSnapshotPresentation,
  ConfigurationState,
  ConfigurationStatePresentation,
  Mat017Item,
  OneSideOfConfigurationConnector,
  OneSideOfConfigurationConnectorPresentation,
  RedactedMat017ItemWithWidenData,
  SingleCableCalculation,
  SingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import { CalculationStatus, Mat017ItemMappers } from '@igus/icalc-domain';
import { ArrayUtils, ObjectUtils } from '@igus/icalc-utils';

export class PresentationMappers {
  public static mapToCalculationPresentation(calculation: Calculation): CalculationPresentation {
    const { singleCableCalculations = [] } = calculation;

    return {
      ...ObjectUtils.omitKeys(calculation, ['status', 'singleCableCalculations']),
      isLocked: calculation.status === CalculationStatus.locked,
      singleCableCalculations: singleCableCalculations
        .map((scc) => PresentationMappers.mapToSingleCableCalculationPresentation(scc))
        .sort(ArrayUtils.sortByAssignmentDate),
    };
  }

  public static mapToConfigurationPresentation(
    configuration: Configuration,
    mat017ItemsBaseDataByMatNumber?: Map<string, Mat017Item>
  ): ConfigurationPresentation {
    const { singleCableCalculations = [], snapshots = [] } = configuration;

    return {
      ...ObjectUtils.omitKeys(configuration, ['snapshots', 'singleCableCalculations', 'state']),
      state: PresentationMappers.mapToConfigurationStatePresentation(
        configuration.state,
        mat017ItemsBaseDataByMatNumber
      ),
      singleCableCalculations: [
        ...singleCableCalculations,
        ...snapshots.map((snapshot) => snapshot?.singleCableCalculation),
      ]
        .map((scc) => PresentationMappers.mapToSingleCableCalculationPresentation(scc))
        .sort(ArrayUtils.sortByAssignmentDate),
    };
  }

  public static mapToConfigurationSnapshotPresentation(
    snapshot: ConfigurationSnapshot
  ): ConfigurationSnapshotPresentation {
    const { singleCableCalculation = [], configurations = { singleCableCalculations: [] } } = snapshot;

    return {
      ...ObjectUtils.omitKeys(snapshot, ['configurations', 'singleCableCalculation', 'configurationData']),
      configurationData: {
        ...snapshot.configurationData,
        state: PresentationMappers.mapToConfigurationStatePresentation(snapshot.configurationData.state),
      },
      singleCableCalculations: [singleCableCalculation, ...configurations.singleCableCalculations]
        .map((scc) => PresentationMappers.mapToSingleCableCalculationPresentation(scc))
        .sort(ArrayUtils.sortByAssignmentDate),
    };
  }

  public static mapToSingleCableCalculationPresentation(
    scc: SingleCableCalculation,
    withRelationships?: boolean,
    mat017ItemsBaseDataByMatNumber?: Map<string, Mat017Item>
  ): SingleCableCalculationPresentation {
    const { configuration, calculation, snapshot } = scc;

    return {
      matNumber: configuration?.matNumber || snapshot?.configurationMatNumber,
      calculationNumber: calculation?.calculationNumber,
      ...ObjectUtils.omitKeys(scc, ['calculation', 'configuration', 'snapshot']),
      ...(withRelationships && {
        calculation: PresentationMappers.mapToCalculationPresentation(calculation),
        configuration: configuration
          ? PresentationMappers.mapToConfigurationPresentation(configuration, mat017ItemsBaseDataByMatNumber)
          : undefined,
        snapshot: snapshot ? PresentationMappers.mapToConfigurationSnapshotPresentation(snapshot) : undefined,
      }),
    };
  }

  public static mapToConfigurationStatePresentation(
    configurationState: ConfigurationState,
    mat017ItemsBaseDataByMatNumber?: Map<string, Mat017Item>
  ): ConfigurationStatePresentation {
    if (!configurationState.connectorState) {
      return configurationState as unknown as ConfigurationStatePresentation;
    }
    const { leftConnector, rightConnector } = configurationState.connectorState;

    return {
      ...ObjectUtils.omitKeys(configurationState, ['connectorState']),
      connectorState: {
        ...configurationState.connectorState,
        ...(!!leftConnector && {
          leftConnector: PresentationMappers.mapOneSideOfConnectorStateToPresentation(
            leftConnector,
            mat017ItemsBaseDataByMatNumber
          ),
        }),
        ...(!!rightConnector && {
          rightConnector: PresentationMappers.mapOneSideOfConnectorStateToPresentation(
            rightConnector,
            mat017ItemsBaseDataByMatNumber
          ),
        }),
      },
    };
  }

  private static mapOneSideOfConnectorStateToPresentation(
    oneSideOfConnectorState: OneSideOfConfigurationConnector,
    mat017ItemsBaseDataByMatNumber?: Map<string, Mat017Item>
  ): OneSideOfConfigurationConnectorPresentation {
    return {
      ...oneSideOfConnectorState,
      mat017ItemListWithWidenData: oneSideOfConnectorState.mat017ItemListWithWidenData.map(
        (item: RedactedMat017ItemWithWidenData) => {
          const mat017ItemBaseData =
            mat017ItemsBaseDataByMatNumber && mat017ItemsBaseDataByMatNumber?.get(item.matNumber)
              ? mat017ItemsBaseDataByMatNumber?.get(item.matNumber)
              : Mat017ItemMappers.fromRedactedMat017ItemWithWidenDataToMat017Item(item); //This is relevant for configuration snapshots (locked calculation).

          return Mat017ItemMappers.fromRedactedMat017ItemWithWidenDataToMat017ItemWithWidenData(
            item,
            mat017ItemBaseData
          );
        }
      ),
    };
  }
}
