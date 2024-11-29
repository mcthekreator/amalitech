import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'displayColumnWithFallBack' })
export class DisplayColumnWithFallBackPipe implements PipeTransform {
  public transform(value: unknown, fallBack = '-'): string {
    if (value === 0) {
      return '0';
    }
    if (!value) {
      return fallBack;
    }
    return `${value}`;
  }
}
