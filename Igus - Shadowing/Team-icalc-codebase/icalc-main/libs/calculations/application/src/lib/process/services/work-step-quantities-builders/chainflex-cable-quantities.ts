import type { ConfigurationState } from '@igus/icalc-domain';
import { WorkStepName } from '@igus/icalc-domain';
import { BaseWorkStepQuantitiesBuilder } from './base-work-step-quantities-builder';

export class ChainflexCableQuantities extends BaseWorkStepQuantitiesBuilder {
  private chainflexOuterDiameter: number;

  constructor(configurationState: ConfigurationState) {
    super();
    this.chainflexOuterDiameter = configurationState.chainFlexState?.chainflexCable?.outerDiameter?.amount ?? 0;
  }

  public setCutUnder20MM(): void {
    const cutUnder20MMQuantity = this.chainflexOuterDiameter <= 19.9 ? 1 : 0;

    this.output[WorkStepName.cutUnder20MM] = cutUnder20MMQuantity;
  }

  public setCutOver20MM(): void {
    const cutOver20MMQuantity = this.chainflexOuterDiameter > 19.9 ? 1 : 0;

    this.output[WorkStepName.cutOver20MM] = cutOver20MMQuantity;
  }
}
