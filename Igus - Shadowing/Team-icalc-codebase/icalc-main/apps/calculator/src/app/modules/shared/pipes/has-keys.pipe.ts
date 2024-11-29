import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'hasKeys' })
export class HasKeysPipe implements PipeTransform {
  public transform(value: object): boolean {
    return value && Object.keys(value).length > 0;
  }
}
