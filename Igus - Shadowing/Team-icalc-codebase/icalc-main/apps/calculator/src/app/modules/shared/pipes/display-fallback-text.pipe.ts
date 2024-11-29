import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'displayWithFallback' })
export class DisplayWithFallbackPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  public transform(value: string): string {
    return value ? value : this.translate.instant('icalc.results.NOT-AVAILABLE');
  }
}
