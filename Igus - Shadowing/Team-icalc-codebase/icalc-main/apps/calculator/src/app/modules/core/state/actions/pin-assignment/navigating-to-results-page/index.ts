import type { SaveSingleCableCalculationResponseDto } from '@igus/icalc-domain';
import type { NavigatingToResultsPagePayload } from '../../../pin-assignment-state/pin-assignment-state.model';

export class Started {
  public static readonly type = '[PinAssignment] NavigatingToResultsPage Started';
  constructor(public payload: NavigatingToResultsPagePayload) {}
}

export class PinAssignmentDataSaved {
  public static readonly type = '[PinAssignment] NavigatingToResultsPage PinAssignmentDataSaved';
  constructor(public payload: SaveSingleCableCalculationResponseDto) {}
}
