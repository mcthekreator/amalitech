import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { CommercialWorkStepType, ProcessResultWorkStepItem } from '@igus/icalc-domain';
import { defaultCommercialWorkStepNames, WorkStepCategory } from '@igus/icalc-domain';

@Pipe({ name: 'filterWorkStepsByCategory' })
export class FilterWorkStepsByCategory implements PipeTransform {
  public transform(workSteps: ProcessResultWorkStepItem[], category: WorkStepCategory): ProcessResultWorkStepItem[] {
    if (!workSteps) {
      return [];
    }

    if (category === WorkStepCategory.commercial) {
      return workSteps?.filter((workStep) =>
        defaultCommercialWorkStepNames.includes(workStep.name as CommercialWorkStepType)
      );
    }

    if (category === WorkStepCategory.technical) {
      return workSteps?.filter(
        (workStep) => !defaultCommercialWorkStepNames.includes(workStep.name as CommercialWorkStepType)
      );
    }
  }
}
