import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'formatLengthWithFallBack' })
export class FormatLengthWithFallBackPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  public transform(value: number): string {
    return value ? `${value}m;` : this.translate.instant('icalc.results.NO-VALUE');
  }
}
