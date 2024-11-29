import type { EnteringPinAssignmentPagePayload } from '../../../pin-assignment-state/pin-assignment-state.model';

export class Started {
  public static readonly type = '[PinAssignment] EnteringPinAssignmentPage Started';
}

export class Entered {
  public static readonly type = '[PinAssignment] EnteringPinAssignmentPage Entered';
  constructor(public payload: EnteringPinAssignmentPagePayload) {}
}
