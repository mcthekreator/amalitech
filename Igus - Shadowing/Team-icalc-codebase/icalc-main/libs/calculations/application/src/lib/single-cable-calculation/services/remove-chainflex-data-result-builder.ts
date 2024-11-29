import type {
  RemoveChainflexDataResult,
  SaveSingleCableCalculationResult,
  SingleCableCalculation,
} from '@igus/icalc-domain';
import { ChainflexPricesBaseResultBuilder } from './chainflex-prices-base-result-builder';

export class RemoveChainflexDataResultBuilder extends ChainflexPricesBaseResultBuilder<RemoveChainflexDataResult> {
  protected result: RemoveChainflexDataResult = {
    savedSingleCableCalculations: [],
  };

  public hasHandledGivenConfigurationId(configurationId: string): boolean {
    return this.result.savedSingleCableCalculations
      .map((ref) => ref.singleCableCalculation.configurationId)
      .includes(configurationId);
  }

  public addSaveSingleCableCalculationResult(savedSccResult: SaveSingleCableCalculationResult): void {
    this.result.savedSingleCableCalculations.push(savedSccResult);
  }

  public addSaveSingleCableCalculationResultFromExistingResult(scc: SingleCableCalculation): void {
    const newSaveSccResult: SaveSingleCableCalculationResult = this.result.savedSingleCableCalculations.find(
      (saveSccResult) => saveSccResult.singleCableCalculation.configurationId === scc.configurationId
    );

    newSaveSccResult.singleCableCalculation = scc;

    this.result.savedSingleCableCalculations.push(newSaveSccResult);
  }
}
