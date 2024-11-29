import type { ConfigurationPinAssignmentState, PinAssignmentValidationResult } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[PinAssignment] ValidatingPinAssignment Started';
  constructor(
    public payload: {
      calculationId: string;
      configurationId: string;
      pinAssignmentState?: ConfigurationPinAssignmentState;
    }
  ) {}
}

export class Succeeded {
  public static readonly type = '[PinAssignment] ValidatingPinAssignment Succeeded';
  constructor(public payload: PinAssignmentValidationResult) {}
}
