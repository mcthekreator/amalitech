import type { ConfigurationState, RedactedMat017ItemWithWidenData } from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-domain';
import { WorkStepName } from '@igus/icalc-result';
import { BaseWorkStepQuantitiesBuilder } from './base-work-step-quantities-builder';

export class Mat017ItemsQuantities extends BaseWorkStepQuantitiesBuilder {
  private leftMat017ItemList: RedactedMat017ItemWithWidenData[];
  private rightMat017ItemList: RedactedMat017ItemWithWidenData[];

  constructor(configurationState: ConfigurationState) {
    super();
    this.leftMat017ItemList = ArrayUtils.fallBackToEmptyArray(
      configurationState.connectorState?.leftConnector.mat017ItemListWithWidenData
    );
    this.rightMat017ItemList = ArrayUtils.fallBackToEmptyArray(
      configurationState.connectorState?.rightConnector?.mat017ItemListWithWidenData
    );
  }

  public setConsignment(): void {
    const consignmentQuantity = [...this.leftMat017ItemList, ...this.rightMat017ItemList]
      .map((item) => item.quantity)
      .reduce((previous, next) => previous + next, 0);

    this.output[WorkStepName.consignment] = consignmentQuantity;
  }

  public setLabeling(): void {
    const labelingQuantity = [...this.leftMat017ItemList, ...this.rightMat017ItemList]
      .filter((mat017ItemWithWidenData) => mat017ItemWithWidenData.overrides.mat017ItemGroup === 'RC-K8')
      .map((item) => item.quantity)
      .reduce((previous, next) => previous + next, 0);

    this.output[WorkStepName.labeling] = labelingQuantity;
  }

  public setTestFieldPrep(): void {
    let testFieldPrep = 0;

    if (this.leftMat017ItemList.length > 0 && this.rightMat017ItemList.length === 0) {
      testFieldPrep = 1;
    } else if (this.leftMat017ItemList.length > 0 && this.rightMat017ItemList.length > 0) {
      testFieldPrep = 0;
    }

    this.output[WorkStepName.testFieldPrep] = testFieldPrep;
  }
}
