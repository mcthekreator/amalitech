import type { WorkStepType } from '@igus/icalc-result';

export abstract class BaseWorkStepQuantitiesBuilder {
  protected output: { [key in WorkStepType]?: number } = {};

  public getValue(): { [key in WorkStepType]?: number } {
    return this.output;
  }
}
