import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { WorkStepType } from '@igus/icalc-domain';

@Pipe({ name: 'workStepHasOverride' })
export class WorkStepHasOverridePipe implements PipeTransform {
  public transform(workStepName: string, workStepOverrides?: { [key in WorkStepType]?: number }): boolean {
    const value = workStepOverrides?.[workStepName];

    if (isNaN(+value)) {
      return false;
    }
    return +value > -1;
  }
}
