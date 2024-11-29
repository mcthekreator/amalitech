import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { WorkStepType } from '@igus/icalc-domain';
import { WorkStepName, WorkStepSet } from '@igus/icalc-domain';
import { TranslateService } from '@igus/kopla-app';

@Pipe({ name: 'shouldHighlightWorkStepName' })
export class ShouldHighlightWorkStepNamePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  public transform(workStepName: WorkStepType, workStepSet: WorkStepSet): { highlighted: boolean; text?: string } {
    if (workStepName === WorkStepName.stripShieldHandling && workStepSet === WorkStepSet.ethernet) {
      return {
        highlighted: true,
        text: this.translateService.instant('icalc.results.STRIP_SHIELD_HANDLING_HIGHLIGHT'),
      };
    }

    return {
      highlighted: false,
    };
  }
}
