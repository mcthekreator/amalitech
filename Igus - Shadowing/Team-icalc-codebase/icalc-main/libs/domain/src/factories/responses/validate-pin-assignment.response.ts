import type { PinAssignmentValidationResult } from '../../models';
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';

const validatePinAssignmentResponse: PinAssignmentValidationResult = {
  isValid: true,
  leftItemCount: 0,
  leftContactCount: 0,
  leftIsValid: true,
  rightItemCount: 0,
  rightContactCount: 0,
  rightIsValid: true,
};

/**
 * createValidatePinAssignmentResponse creates a PinAssignmentValidationResult (standard = valid)
 *
 * @param override pass any needed overrides for the requested PinAssignmentValidationResult
 * @returns PinAssignmentValidationResult
 */
export const createValidatePinAssignmentResponse = (
  override?: NestedPartial<PinAssignmentValidationResult>
): PinAssignmentValidationResult => {
  return mergePartially.deep(validatePinAssignmentResponse, override);
};
