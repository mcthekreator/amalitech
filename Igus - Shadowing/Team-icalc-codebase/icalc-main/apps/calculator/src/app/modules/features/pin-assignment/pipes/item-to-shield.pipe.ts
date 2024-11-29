import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { CableStructureItem, Shield } from '@igus/icalc-domain';

// TODO revisit/refactor this when casting topic is clear
@Pipe({ name: 'itemToShield' })
export class ItemToShieldPipe implements PipeTransform {
  public transform(item: CableStructureItem): Shield {
    return item as Shield;
  }
}
