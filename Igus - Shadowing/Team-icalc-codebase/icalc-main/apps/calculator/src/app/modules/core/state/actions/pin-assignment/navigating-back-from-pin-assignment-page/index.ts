import type { SaveSingleCableCalculationResponseDto } from '@igus/icalc-domain';
import type { NavigatingBackFromPinAssignmentPagePayload } from '../../../pin-assignment-state/pin-assignment-state.model';

export class Started {
  public static readonly type = '[PinAssignment] NavigatingBackFromPinAssignmentPage Started';
  constructor(public payload: NavigatingBackFromPinAssignmentPagePayload) {}
}

export class PinAssignmentDataSaved {
  public static readonly type = '[PinAssignment] NavigatingBackFromPinAssignmentPage PinAssignmentDataSaved';
  constructor(public payload: SaveSingleCableCalculationResponseDto) {}
}
