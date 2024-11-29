import type { WorkStepSet } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[Results] ChangingWorkStepSets Started';
  constructor(public payload: { workStepSet: WorkStepSet }) {}
}
