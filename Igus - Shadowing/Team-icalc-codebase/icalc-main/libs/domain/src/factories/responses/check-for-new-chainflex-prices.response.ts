import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { CheckForNewChainflexPricesResult } from '../../models';

const checkForNewChainflexPricesResponse: CheckForNewChainflexPricesResult = {
  chainflexPricesHaveChanged: false,
  chainflexesAndPricesAvailable: true,
  singleCableCalculationPriceUpdateReferences: [],
};

/**
 * createCheckForNewChainflexPricesResponse creates a CheckForNewChainflexPricesResult
 *
 * @param override pass any needed overrides for the requested CheckForNewChainflexPricesResult
 * @returns CheckForNewChainflexPricesResult
 */
export const createCheckForNewChainflexPricesResponse = (
  override?: NestedPartial<CheckForNewChainflexPricesResult>
): CheckForNewChainflexPricesResult => {
  return mergePartially.deep(checkForNewChainflexPricesResponse, override);
};
