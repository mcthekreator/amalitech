import type {
  ActionSelectionContainer,
  ConfigurationConnectorState,
  RedactedMat017ItemWithWidenData,
} from '@igus/icalc-domain';
import { ArrayUtils, ObjectUtils } from '@igus/icalc-domain';

export class PinAssignmentStateMutations {
  public static removeNotExistentMat017ItemsFromActionModel(
    actionModelLineOrder: ActionSelectionContainer,
    connectorState: ConfigurationConnectorState
  ): ActionSelectionContainer {
    const actionModelLineOrderClone = ObjectUtils.cloneDeep<ActionSelectionContainer>(actionModelLineOrder);
    const leftMat017ItemList = ArrayUtils.fallBackToEmptyArray<RedactedMat017ItemWithWidenData>(
      connectorState?.leftConnector?.mat017ItemListWithWidenData
    );
    const rightMat017ItemList = ArrayUtils.fallBackToEmptyArray<RedactedMat017ItemWithWidenData>(
      connectorState?.rightConnector?.mat017ItemListWithWidenData
    );

    const leftActionModel = actionModelLineOrderClone.left;
    const rightActionModel = actionModelLineOrderClone.right;

    if (leftActionModel.actionSelect === 'mat017Item') {
      if (!leftMat017ItemList.map((item) => item.matNumber).includes(leftActionModel.mat017Item)) {
        leftActionModel.mat017Item = undefined;
      }
    }

    if (rightActionModel.actionSelect === 'mat017Item') {
      if (!rightMat017ItemList.map((item) => item.matNumber).includes(rightActionModel.mat017Item)) {
        rightActionModel.mat017Item = undefined;
      }
    }

    return actionModelLineOrderClone;
  }
}
