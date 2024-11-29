import type { RemovedMat017ItemFormModel } from '@igus/icalc-domain';

export class Submitted {
  public static readonly type = '[Results] RemovingMat017ItemFromConfigurations Submitted';
  constructor(public payload: RemovedMat017ItemFormModel[]) {}
}
