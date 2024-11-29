import type { SaveSingleCableCalculationResponseDto } from '@igus/icalc-domain';
import type { LeavingPinAssignmentPageStartedPayload } from '../../../pin-assignment-state/pin-assignment-state.model';

export class Started {
  public static readonly type = '[PinAssignment] LeavingPinAssignmentPage Started';
  constructor(public payload: LeavingPinAssignmentPageStartedPayload) {}
}

export class NavigatingAllowed {
  public static readonly type = '[PinAssignment] LeavingPinAssignmentPage NavigatingAllowed';
  constructor(public payload: unknown) {}
}

export class PinAssignmentDataSaved {
  public static readonly type = '[PinAssignment] LeavingPinAssignmentPage PinAssignmentDataSaved';
  constructor(public payload: SaveSingleCableCalculationResponseDto) {}
}
