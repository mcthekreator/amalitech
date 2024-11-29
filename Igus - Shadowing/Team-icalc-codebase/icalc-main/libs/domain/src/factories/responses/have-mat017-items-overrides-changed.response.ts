import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { HaveMat017ItemsOverridesChangedResponseDto } from '../../dtos';

const haveMat017ItemsOverridesChangedResponse: HaveMat017ItemsOverridesChangedResponseDto = {
  hasAmountDividedByPriceUnitChanged: false,
  hasInvalidOrRemovedItems: false,
  configurations: [],
};

/**
 * createHaveMat017ItemsOverridesChangedResponse creates a HaveMat017ItemsOverridesChangedResponse
 *
 * @param override pass any needed overrides for the requested HaveMat017ItemsOverridesChangedRespone
 * @returns HaveMat017ItemsOverridesChangedResponse
 */
export const createHaveMat017ItemsOverridesChangedResponse = (
  override?: NestedPartial<HaveMat017ItemsOverridesChangedResponseDto>
): HaveMat017ItemsOverridesChangedResponseDto => {
  return mergePartially.deep(haveMat017ItemsOverridesChangedResponse, override);
};
