import type { PinAssignmentValidationResult } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[PinAssignment] ValidatingPinAssignment Succeeded';
  constructor(public payload: PinAssignmentValidationResult) {}
}
