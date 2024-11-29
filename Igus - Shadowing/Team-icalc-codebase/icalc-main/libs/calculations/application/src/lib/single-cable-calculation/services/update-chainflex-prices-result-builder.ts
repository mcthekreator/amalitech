import type {
  SingleCableCalculation,
  SingleCableCalculationPriceUpdateReference,
  UpdateChainflexPricesResult,
} from '@igus/icalc-domain';
import type { ChainflexPriceDeviationResult } from './chainflex-price-change-check.service';
import { ChainflexPricesBaseResultBuilder } from './chainflex-prices-base-result-builder';

export class UpdateChainflexPricesResultBuilder extends ChainflexPricesBaseResultBuilder<UpdateChainflexPricesResult> {
  protected result: UpdateChainflexPricesResult = {
    singleCableCalculationPriceUpdateReferences: [],
  };

  public static createPriceUpdateReference(
    scc: SingleCableCalculation,
    deviation: ChainflexPriceDeviationResult
  ): SingleCableCalculationPriceUpdateReference {
    let initialReference: SingleCableCalculationPriceUpdateReference = {
      singleCableCalculationId: scc.id,
      configurationId: scc.configurationId,
      priceObjectUpdated: false,
    };

    const { chainflexPriceDeviationDetected, statePriceObject, priceAvailable, currentPriceObject } = deviation;

    if (chainflexPriceDeviationDetected && !priceAvailable) {
      initialReference = {
        ...initialReference,
        priceAvailable: false,
        oldPriceObject: statePriceObject,
      };
    }

    if (chainflexPriceDeviationDetected && priceAvailable) {
      initialReference = {
        ...initialReference,
        priceObjectUpdated: true,
        oldPriceObject: statePriceObject,
        newPriceObject: currentPriceObject,
      };
    }

    return initialReference;
  }

  public hasHandledGivenConfigurationId(configurationId: string): boolean {
    return this.result.singleCableCalculationPriceUpdateReferences
      .map((ref) => ref.configurationId)
      .includes(configurationId);
  }

  public addNewPriceUpdateReference(
    scc: SingleCableCalculation,
    deviation: ChainflexPriceDeviationResult
  ): SingleCableCalculationPriceUpdateReference {
    const priceUpdateReference: SingleCableCalculationPriceUpdateReference =
      UpdateChainflexPricesResultBuilder.createPriceUpdateReference(scc, deviation);

    this.result.singleCableCalculationPriceUpdateReferences.push(priceUpdateReference);

    return priceUpdateReference;
  }

  public addPriceUpdateReferenceFromExistingReference(
    scc: SingleCableCalculation
  ): SingleCableCalculationPriceUpdateReference {
    const priceUpdateReference: SingleCableCalculationPriceUpdateReference =
      this.result.singleCableCalculationPriceUpdateReferences.find(
        (sccReference) => sccReference.configurationId === scc.configurationId
      );

    priceUpdateReference.singleCableCalculationId = scc.id;

    this.result.singleCableCalculationPriceUpdateReferences.push(priceUpdateReference);

    return priceUpdateReference;
  }
}
