import { Pipe, PipeTransform } from '@angular/core';
import type { LocalizedStrings } from '@igus/icalc-domain';

@Pipe({
  name: 'translateGerman',
})
export class TranslateGermanPipe implements PipeTransform {
  public transform(value: LocalizedStrings): string {
    if (value && value['de_DE']) {
      return value['de_DE'];
    }
    return 'Übersetzung nicht verfügbar';
  }
}
