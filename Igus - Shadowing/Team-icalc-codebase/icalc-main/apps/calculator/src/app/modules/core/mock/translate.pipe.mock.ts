import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'translate' })
export class TranslatePipeStub implements PipeTransform {
  public transform(value: unknown, _: unknown[]): unknown {
    return value;
  }
}
