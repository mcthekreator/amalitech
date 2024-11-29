import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

/**
 * @deprecated
 * Currently not using this pipe because all items are fractionable regardless of the group it belongs to.
 */
@Pipe({ name: 'itemGroupFractionable' })
export class ItemGroupFractionablePipe implements PipeTransform {
  public transform(value: string): boolean {
    const fractionableItemGroups = ['RC-A3', 'RC-D2', 'RC-D3', 'RC-K8', 'RC-K11', 'RC-L3']; // for more information on these item groups see ICALC-139

    if (fractionableItemGroups.includes(value)) {
      return true;
    }

    return false;
  }
}
