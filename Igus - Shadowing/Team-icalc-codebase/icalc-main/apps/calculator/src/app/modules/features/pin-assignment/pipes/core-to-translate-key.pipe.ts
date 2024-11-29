import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Core, CableStructureItem } from '@igus/icalc-domain';

@Pipe({ name: 'coreToTranslateKey' })
export class CoreToTranslateKeyPipe implements PipeTransform {
  public transform(item: CableStructureItem): string {
    return (item as Core).color.translateKey;
  }
}
