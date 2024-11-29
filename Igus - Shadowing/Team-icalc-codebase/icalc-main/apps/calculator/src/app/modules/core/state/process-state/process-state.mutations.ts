import type {
  ChainflexCable,
  ConfigurationPinAssignmentState,
  ConnectorSide,
  OneSideOfConfigurationConnector,
  SingleCableCalculationPresentation,
  UpdatedConfigurationResult,
  WorkStepType,
} from '@igus/icalc-domain';
import {
  ArrayUtils,
  isCommercialWorkStepType,
  ObjectUtils,
  WORK_STEP_QUANTITIES_RELATED_TO_CHAINFLEX,
  WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS,
  WORK_STEP_QUANTITIES_RELATED_TO_META_DATA,
  WORK_STEP_QUANTITIES_RELATED_TO_PIN_ASSIGNMENT,
} from '@igus/icalc-domain';
import type { InformUserAboutWorkSteps, MetaDataViewModel, ProcessStateModel } from './process-state.model';
import { diff } from 'deep-object-diff';
import { ProcessStateMappers } from './process-state.mappers';

export class ProcessStateMutations {
  public static removeOverridesRelatedToMetaData(
    state: ProcessStateModel,
    selectedSingleCableCalculation: SingleCableCalculationPresentation,
    metaDataFromComponent: MetaDataViewModel
  ): {
    singleCableCalculation: SingleCableCalculationPresentation;
    informUserAboutWorkSteps?: InformUserAboutWorkSteps[];
  } {
    const hasChanged =
      selectedSingleCableCalculation.batchSize !== metaDataFromComponent.selectedSingleCableCalculationItem.batchSize;

    if (hasChanged) {
      const { singleCableCalculation, removedOverrides } = ProcessStateMutations.removeOverrides(
        selectedSingleCableCalculation,
        WORK_STEP_QUANTITIES_RELATED_TO_META_DATA
      );

      const newInformUserAboutWorkSteps = ProcessStateMutations.createInformAboutWorkSteps(
        state,
        singleCableCalculation,
        removedOverrides
      );

      return {
        singleCableCalculation,
        informUserAboutWorkSteps: newInformUserAboutWorkSteps,
      };
    }

    return { singleCableCalculation: selectedSingleCableCalculation };
  }

  public static removeOverridesRelatedToChainflex(
    state: ProcessStateModel,
    selectedSingleCableCalculation: SingleCableCalculationPresentation,
    newChainflexCable: ChainflexCable
  ): {
    singleCableCalculation: SingleCableCalculationPresentation;
    informUserAboutWorkSteps?: InformUserAboutWorkSteps[];
  } {
    const hasChanged =
      selectedSingleCableCalculation.configuration.state?.chainFlexState?.chainflexCable?.id !== newChainflexCable?.id;

    if (hasChanged) {
      const { singleCableCalculation, removedOverrides } = ProcessStateMutations.removeOverrides(
        selectedSingleCableCalculation,
        WORK_STEP_QUANTITIES_RELATED_TO_CHAINFLEX
      );

      //  we need to reset the pin assignment values inside the state if the selected chainflex changed
      singleCableCalculation.configuration.state.pinAssignmentState = null;

      const newInformUserAboutWorkSteps = ProcessStateMutations.createInformAboutWorkSteps(
        state,
        singleCableCalculation,
        removedOverrides
      );

      return {
        singleCableCalculation,
        informUserAboutWorkSteps: newInformUserAboutWorkSteps,
      };
    }

    return { singleCableCalculation: selectedSingleCableCalculation };
  }

  public static removeOverridesRelatedToConnectors(
    state: ProcessStateModel,
    selectedSingleCableCalculation: SingleCableCalculationPresentation,
    previousConnectorState: OneSideOfConfigurationConnector,
    which: ConnectorSide
  ): {
    singleCableCalculation: SingleCableCalculationPresentation;
    informUserAboutWorkSteps?: InformUserAboutWorkSteps[];
  } {
    const changes = diff(
      previousConnectorState,
      selectedSingleCableCalculation.configuration.state.connectorState[which]
    );
    const hasChanges = !ObjectUtils.isEqualJSONRepresentation(changes, {});

    if (hasChanges) {
      const { singleCableCalculation, removedOverrides } = ProcessStateMutations.removeOverrides(
        selectedSingleCableCalculation,
        WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS
      );

      const newInformUserAboutWorkSteps = ProcessStateMutations.createInformAboutWorkSteps(
        state,
        singleCableCalculation,
        removedOverrides
      );

      return {
        singleCableCalculation,
        informUserAboutWorkSteps: newInformUserAboutWorkSteps,
      };
    }

    return { singleCableCalculation: selectedSingleCableCalculation };
  }

  public static removeOverridesAfterCloningConnector(
    state: ProcessStateModel,
    selectedSingleCableCalculation: SingleCableCalculationPresentation
  ): {
    singleCableCalculation: SingleCableCalculationPresentation;
    informUserAboutWorkSteps?: InformUserAboutWorkSteps[];
  } {
    const { singleCableCalculation, removedOverrides } = ProcessStateMutations.removeOverrides(
      selectedSingleCableCalculation,
      WORK_STEP_QUANTITIES_RELATED_TO_CONNECTORS
    );

    const newInformUserAboutWorkSteps = ProcessStateMutations.createInformAboutWorkSteps(
      state,
      selectedSingleCableCalculation,
      removedOverrides
    );

    return {
      singleCableCalculation,
      informUserAboutWorkSteps: newInformUserAboutWorkSteps,
    };
  }

  public static removeOverridesRelatedToPinAssignment(
    state: ProcessStateModel,
    selectedSingleCableCalculation: SingleCableCalculationPresentation,
    newPinAssignment: ConfigurationPinAssignmentState
  ): {
    singleCableCalculation: SingleCableCalculationPresentation;
    informUserAboutWorkSteps?: InformUserAboutWorkSteps[];
  } {
    const currentActionModels = selectedSingleCableCalculation.configuration.state?.pinAssignmentState?.actionModels;
    const newActionModels = newPinAssignment.actionModels;

    const hasChanges = !ObjectUtils.isEqualJSONRepresentation(currentActionModels, newActionModels);

    if (hasChanges) {
      const { singleCableCalculation, removedOverrides } = ProcessStateMutations.removeOverrides(
        selectedSingleCableCalculation,
        WORK_STEP_QUANTITIES_RELATED_TO_PIN_ASSIGNMENT
      );

      const newInformUserAboutWorkSteps = ProcessStateMutations.createInformAboutWorkSteps(
        state,
        singleCableCalculation,
        removedOverrides
      );

      return { singleCableCalculation, informUserAboutWorkSteps: newInformUserAboutWorkSteps };
    }

    return { singleCableCalculation: selectedSingleCableCalculation };
  }

  public static saveOverrides(
    singleCableCalculation: SingleCableCalculationPresentation,
    overrides: { [key in WorkStepType]?: number },
    quantitiesWithoutOverrides: { [key in WorkStepType]?: number }
  ): SingleCableCalculationPresentation {
    Object.keys(overrides).forEach((key) => (overrides[key] = +`${overrides[key]}`.replace(',', '.')));

    const workStepOverrides = {};

    Object.keys(overrides)
      .filter((workStep) => overrides[workStep] !== quantitiesWithoutOverrides[workStep])
      .forEach((workStep) => (workStepOverrides[workStep] = overrides[workStep]));

    const commercialOverrides = Object.keys(workStepOverrides)
      .filter((key) => isCommercialWorkStepType(key as WorkStepType))
      .reduce((prev, curr) => ((prev[curr] = workStepOverrides[curr]), prev), {});

    const technicalOverrides = Object.keys(workStepOverrides)
      .filter((key) => !isCommercialWorkStepType(key as WorkStepType))
      .reduce((prev, curr) => ((prev[curr] = workStepOverrides[curr]), prev), {});

    singleCableCalculation.commercialWorkStepOverrides = commercialOverrides;
    singleCableCalculation.configuration.state.workStepOverrides = technicalOverrides;

    return singleCableCalculation;
  }

  public static addInformAboutWorkSteps(
    state: ProcessStateModel,
    removeMat017ItemsResponse: UpdatedConfigurationResult[]
  ): InformUserAboutWorkSteps[] {
    const relatedSingleCableCalculations = ProcessStateMappers.toRelatedSingleCableCalculationsOfCalculation(state);
    const configurationsWithRemovedMat017Item = removeMat017ItemsResponse.filter(
      (configuration) => configuration.hasRemovedOverrides
    );

    const newWorkSteps = relatedSingleCableCalculations
      .filter((scc) => configurationsWithRemovedMat017Item.some((item) => item.configurationId === scc.configurationId))
      .map((currScc) => {
        const configurationWithRemovedMat017Item = configurationsWithRemovedMat017Item.find(
          (item) => item.configurationId === currScc.configurationId
        );

        return ProcessStateMutations.createInformAboutWorkStep(
          currScc.configurationId,
          currScc.matNumber,
          currScc.chainflexLength,
          currScc.batchSize,
          configurationWithRemovedMat017Item.removedOverrides
        );
      });

    return ProcessStateMutations.mergeInformAboutWorkSteps(state, newWorkSteps);
  }

  private static removeOverrides(
    singleCableCalculation: SingleCableCalculationPresentation,
    workStepTypes: WorkStepType[]
  ): { singleCableCalculation: SingleCableCalculationPresentation; removedOverrides: WorkStepType[] } {
    const scc = ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(singleCableCalculation);
    const technicalWorkStepOverrides = scc.configuration.state.workStepOverrides || {};
    const commercialWorkStepOverrides = scc.commercialWorkStepOverrides;
    const removedOverrides: WorkStepType[] = [];

    workStepTypes.forEach((overrideToBeDeleted) => {
      const overrides = isCommercialWorkStepType(overrideToBeDeleted)
        ? commercialWorkStepOverrides
        : technicalWorkStepOverrides;

      if (overrides[overrideToBeDeleted]) {
        delete overrides[overrideToBeDeleted];
        removedOverrides.push(overrideToBeDeleted);
      }
    });

    return {
      singleCableCalculation: scc,
      removedOverrides,
    };
  }

  private static createInformAboutWorkSteps(
    state: ProcessStateModel,
    singleCableCalculation: SingleCableCalculationPresentation,
    overrides: WorkStepType[]
  ): InformUserAboutWorkSteps[] {
    const informUserAboutWorkSteps = ObjectUtils.cloneDeep<InformUserAboutWorkSteps[]>(state.informUserAboutWorkSteps);

    if (
      informUserAboutWorkSteps.some((value) => value.configurationId === singleCableCalculation.configurationId) ||
      ArrayUtils.isEmpty(overrides)
    ) {
      return informUserAboutWorkSteps;
    }

    const newWorkStep = ProcessStateMutations.createInformAboutWorkStep(
      singleCableCalculation.configurationId,
      singleCableCalculation.matNumber,
      singleCableCalculation.chainflexLength,
      singleCableCalculation.batchSize,
      overrides
    );

    return ProcessStateMutations.mergeInformAboutWorkSteps(state, [newWorkStep]);
  }

  private static createInformAboutWorkStep(
    configurationId: string,
    matNumber: string,
    chainflexLength: number,
    batchSize: number,
    workStepTypes: WorkStepType[]
  ): InformUserAboutWorkSteps {
    return {
      configurationId,
      matNumber,
      chainflexLength,
      batchSize,
      workStepTypes: [...workStepTypes],
    };
  }

  private static mergeInformAboutWorkSteps(
    state: ProcessStateModel,
    newWorkSteps: InformUserAboutWorkSteps[]
  ): InformUserAboutWorkSteps[] {
    const informUserAboutWorkSteps = ObjectUtils.cloneDeep<InformUserAboutWorkSteps[]>(state.informUserAboutWorkSteps);
    const mergedWorkSteps = newWorkSteps.filter(
      (newWorkStep) =>
        !informUserAboutWorkSteps.some(
          (existingWorkStep) => existingWorkStep.configurationId === newWorkStep.configurationId
        )
    );

    return [...informUserAboutWorkSteps, ...mergedWorkSteps];
  }
}
