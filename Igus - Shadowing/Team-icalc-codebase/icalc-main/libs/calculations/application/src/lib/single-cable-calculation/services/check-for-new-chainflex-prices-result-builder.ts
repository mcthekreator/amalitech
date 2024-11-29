import type {
  CheckForNewChainflexPricesResult,
  SingleCableCalculation,
  SingleCableCalculationPriceUpdateReference,
} from '@igus/icalc-domain';
import type { ChainflexPriceDeviationResult } from './chainflex-price-change-check.service';
import { ChainflexPricesBaseResultBuilder } from './chainflex-prices-base-result-builder';

export class CheckForNewChainflexPricesResultBuilder extends ChainflexPricesBaseResultBuilder<CheckForNewChainflexPricesResult> {
  protected result: CheckForNewChainflexPricesResult = {
    chainflexPricesHaveChanged: false,
    chainflexesAndPricesAvailable: true,
    singleCableCalculationPriceUpdateReferences: [],
  };

  public static createPriceUpdateReference(
    scc: SingleCableCalculation,
    deviation: ChainflexPriceDeviationResult
  ): SingleCableCalculationPriceUpdateReference {
    let initialReference: SingleCableCalculationPriceUpdateReference = {
      singleCableCalculationId: scc.id,
      priceDeviationDetected: false,
      partNumber: scc.configuration.partNumber,
    };

    const { chainflexPriceDeviationDetected, statePriceObject, currentPriceObject, priceAvailable, cfCableProvided } =
      deviation;

    if (cfCableProvided === false) {
      initialReference = {
        ...initialReference,
        incomplete: true,
      };
      return initialReference;
    }

    if (chainflexPriceDeviationDetected && !priceAvailable) {
      initialReference = {
        ...initialReference,
        priceDeviationDetected: true,
        oldPriceObject: statePriceObject,
        priceAvailable: false,
      };
      return initialReference;
    }

    if (chainflexPriceDeviationDetected && priceAvailable) {
      initialReference = {
        ...initialReference,
        priceDeviationDetected: true,
        priceAvailable: true,
        oldPriceObject: statePriceObject,
        newPriceObject: currentPriceObject,
      };

      return initialReference;
    }

    return initialReference;
  }

  public addNewPriceUpdateReference(scc: SingleCableCalculation, deviation: ChainflexPriceDeviationResult): void {
    const priceUpdateReference: SingleCableCalculationPriceUpdateReference =
      CheckForNewChainflexPricesResultBuilder.createPriceUpdateReference(scc, deviation);

    this.markChainflexPricesAsChanged(priceUpdateReference);
    this.markIfChainflexOrPriceMissing(deviation);

    this.result.singleCableCalculationPriceUpdateReferences.push(priceUpdateReference);
  }

  private markChainflexPricesAsChanged(priceUpdateReference: SingleCableCalculationPriceUpdateReference): void {
    const isNewPriceObjectPresent = priceUpdateReference.newPriceObject;
    const pricesHaveNotChangedYet = !this.result.chainflexPricesHaveChanged;

    if (isNewPriceObjectPresent && pricesHaveNotChangedYet) {
      this.result.chainflexPricesHaveChanged = true;
    }
  }

  private markIfChainflexOrPriceMissing(deviation: ChainflexPriceDeviationResult): void {
    const deviationDetected = deviation.chainflexPriceDeviationDetected;
    const isPriceUnavailable = !deviation.priceAvailable;
    const pricesAreCurrentlyMarkedAsAvailable = this.result.chainflexesAndPricesAvailable;

    if (deviationDetected && isPriceUnavailable && pricesAreCurrentlyMarkedAsAvailable) {
      this.result.chainflexesAndPricesAvailable = false;
    }
  }
}
