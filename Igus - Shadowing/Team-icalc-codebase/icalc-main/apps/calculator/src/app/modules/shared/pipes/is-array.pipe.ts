import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'isArray' })
export class IsArrayPipe implements PipeTransform {
  public transform(value: unknown): boolean {
    return Array.isArray(value);
  }
}
