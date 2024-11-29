import { WorkStepName } from '@igus/icalc-result';
import { BaseWorkStepQuantitiesBuilder } from './base-work-step-quantities-builder';

export class BatchSizeQuantities extends BaseWorkStepQuantitiesBuilder {
  private standardOneToBatchSizeValue: number;

  constructor(batchSize: number) {
    super();
    this.standardOneToBatchSizeValue = Number((1 / batchSize).toFixed(2));
  }

  public setProjektierung(): void {
    this.output[WorkStepName.projektierung] = this.standardOneToBatchSizeValue;
  }

  public setAuftragsmanagement(): void {
    this.output[WorkStepName.auftragsmanagement] = this.standardOneToBatchSizeValue;
  }

  public setEinkaufDispo(): void {
    this.output[WorkStepName.einkaufDispo] = this.standardOneToBatchSizeValue;
  }

  public setTransportStock(): void {
    this.output[WorkStepName.transportStock] = this.standardOneToBatchSizeValue;
  }
}
