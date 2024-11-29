import type { CreatingMat017ItemsSubmittedPayload } from '../../../connector-state/connector-state.model';

export class Submitted {
  public static readonly type = '[CreateMat017ItemsDialog] CreatingMat017Items Submitted';
  constructor(public payload: CreatingMat017ItemsSubmittedPayload) {}
}
