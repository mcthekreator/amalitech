import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Mat017ItemWithWidenData } from '@igus/icalc-domain';
import { Mat017ItemStatus } from '@igus/icalc-domain';

@Pipe({ name: 'disableMat017ItemSelection' })
export class DisableMat017ItemSelectionPipe implements PipeTransform {
  public transform(mat017Item: Mat017ItemWithWidenData, isLocked: boolean): boolean {
    const mat017ItemIsInvalid = mat017Item?.itemStatus !== Mat017ItemStatus.active;

    return isLocked || mat017ItemIsInvalid;
  }
}
