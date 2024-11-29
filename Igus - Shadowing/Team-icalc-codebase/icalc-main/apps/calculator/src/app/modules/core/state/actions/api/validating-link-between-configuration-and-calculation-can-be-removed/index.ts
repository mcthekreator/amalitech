import type { CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto } from '@igus/icalc-domain';
import type { HttpErrorResponse } from '@angular/common/http';

export class Succeeded {
  public static readonly type = '[API] ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved Succeeded';
  constructor(public payload: CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto) {}
}

export class Failed {
  public static readonly type = '[API] ValidatingCanLinkBetweenConfigurationAndCalculationBeRemoved Failed';
  constructor(public payload: HttpErrorResponse) {}
}
