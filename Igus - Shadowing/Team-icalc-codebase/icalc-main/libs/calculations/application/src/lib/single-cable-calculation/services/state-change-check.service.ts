import { ConfigurationStateMapper, mat017ItemFieldsToOmit } from '@igus/icalc-domain';
import type {
  ConfigurationStatePresentation,
  Configuration,
  ConfigurationState,
  Mat017ItemWithWidenData,
} from '@igus/icalc-domain';
import { ObjectUtils } from '@igus/icalc-utils';
import { Injectable } from '@nestjs/common';
import { diff } from 'deep-object-diff';

@Injectable()
export class StateChangeCheckService {
  public changeDetected(
    oldConfiguration: Partial<Configuration>,
    newConfiguration: Partial<Configuration>,
    newConfigurationState: Partial<ConfigurationState>
  ): boolean {
    let result = false;

    const oldStateClone = ObjectUtils.cloneDeep<ConfigurationState>(oldConfiguration.state);
    const newStateClone = ObjectUtils.cloneDeep<ConfigurationState>(newConfigurationState);

    if (oldStateClone?.libraryState?.base64Image && newStateClone?.libraryState?.base64Image) {
      ObjectUtils.omitKeys(oldStateClone.libraryState, ['base64Image', 'sketchDate']);
      ObjectUtils.omitKeys(newStateClone.libraryState, ['base64Image', 'sketchDate']);
    }
    if (oldStateClone?.pinAssignmentState?.base64Image && newStateClone?.pinAssignmentState?.base64Image) {
      ObjectUtils.omitKeys(oldStateClone.pinAssignmentState, ['base64Image']);
      ObjectUtils.omitKeys(newStateClone.pinAssignmentState, ['base64Image']);
    }

    const detectedChange = this.hasStateChangedAtSomeKeys(oldStateClone, newStateClone, Object.keys(newStateClone));

    if (detectedChange) {
      result = true;
    }

    if (
      oldConfiguration.labelingLeft !== newConfiguration.labelingLeft ||
      oldConfiguration.labelingRight !== newConfiguration.labelingRight
    ) {
      result = true;
    }

    if (oldConfiguration.partNumber !== newConfiguration.partNumber) {
      result = true;
    }

    return result;
  }

  private hasStateChangedAtSomeKeys(
    oldState: ConfigurationState,
    newState: ConfigurationState,
    keys: string[]
  ): boolean {
    const workStepSetKeyValue = 'workStepSet';

    const additionalMat017ItemFieldsToOmit: (keyof Mat017ItemWithWidenData)[] = [
      'photoUrl',
      'techDrawUrl',
      'pinAssUrl',
      'photoVersionId',
      'techDrawVersionId',
      'pinAssVersionId',
    ];

    oldState = ConfigurationStateMapper.removeMat017ItemBaseDataFromConnectorState(
      oldState as ConfigurationStatePresentation,
      additionalMat017ItemFieldsToOmit
    );

    newState = ConfigurationStateMapper.removeMat017ItemBaseDataFromConnectorState(
      newState as ConfigurationStatePresentation,
      [...mat017ItemFieldsToOmit, ...additionalMat017ItemFieldsToOmit]
    );

    return keys.reduce((acc, nextKey) => {
      if (nextKey === workStepSetKeyValue) {
        if (oldState?.workStepSet !== newState.workStepSet) {
          return true;
        }
        return acc;
      }

      const detectedChange = diff(oldState[nextKey], newState[nextKey]) ?? {};

      if (Object.keys(detectedChange).length > 0) {
        return true;
      }

      return acc;
    }, false);
  }
}
