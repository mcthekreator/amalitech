import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { ArrayUtils } from '@igus/icalc-utils';
import { TranslateService } from '@ngx-translate/core';

// used for multiline tooltips which needs to access property in 1 nested object (e.g. configuration.matNumber)
@Pipe({ name: 'formatTooltip' })
export class FormatTooltipPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}
  public transform(value: unknown[], translationKey: string): string {
    const infoText = this.translateService.instant(translationKey);

    return `${infoText}\n \n${ArrayUtils.fallBackToEmptyArray(value).join('\n')}`;
  }
}

// used for multiline tooltips which needs to access property in 2 nested objects (e.g. snapshot.configurationData.matNumber)
@Pipe({ name: 'lockedFormatTooltip' })
export class LockedFormatTooltipPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}
  public transform(value: unknown[], translationKey: string, propertyName: string): string {
    const infoText = this.translateService.instant(translationKey);

    return `${infoText}\n \n${ArrayUtils.fallBackToEmptyArray(value)
      .map((item) => this.getByPropertyName(item, propertyName))
      .join('\n')}`;
  }

  private getByPropertyName(item: unknown, propertyName: string): unknown {
    if (propertyName.indexOf('.') > -1) {
      const splittedPropertyName = propertyName.split('.');

      return item[splittedPropertyName[0]][splittedPropertyName[1]][splittedPropertyName[2]];
    }

    return item[propertyName];
  }
}
