import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Core, CableStructureItem } from '@igus/icalc-domain';

@Pipe({ name: 'coreToThickness' })
export class CoreToThicknessPipe implements PipeTransform {
  public transform(item: CableStructureItem): number {
    return (item as Core).thickness;
  }
}
