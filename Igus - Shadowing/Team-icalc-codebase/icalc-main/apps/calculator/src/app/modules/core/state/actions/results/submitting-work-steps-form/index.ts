import type { SubmittingWorkStepsFormPayload } from '../../../process-state/process-state.model';

export class Submitted {
  public static readonly type = '[Results] SubmittingWorkStepsForm Submitted';
  constructor(public payload: SubmittingWorkStepsFormPayload) {}
}
