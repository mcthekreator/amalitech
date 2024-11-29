import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Core, CableStructureItem, Shield, Twisting } from '@igus/icalc-domain';

@Pipe({ name: 'itemToType' })
export class ItemToTypePipe implements PipeTransform {
  public transform(item: CableStructureItem): Core | Shield | Twisting {
    switch (item.type) {
      case 'core':
        return item as Core;
      case 'shield':
        return item as Shield;
      case 'twisting':
        return item as Twisting;
      default:
        return;
    }
  }
}
