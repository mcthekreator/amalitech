import type { WorkStepSet } from '@igus/icalc-result';
import { WorkStepName } from '@igus/icalc-result';
import { BaseWorkStepQuantitiesBuilder } from './base-work-step-quantities-builder';

export class CommonQuantities extends BaseWorkStepQuantitiesBuilder {
  constructor(private workStepSet: WorkStepSet) {
    super();
  }

  public setDrillingSealInsert(): void {
    this.output[WorkStepName.drillingSealInsert] = 0;
  }

  public setSendTestReport(): void {
    this.output[WorkStepName.sendTestReport] = 0;
  }

  public setPackage(): void {
    this.output[WorkStepName.package] = 1;
  }
}
