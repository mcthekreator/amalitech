import type { ApplicationConfig } from '@igus/kopla-app';
import { TranslateService } from '@igus/kopla-app';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';
import { ICALC_APP_VERSION } from '../version';

export const applicationConfig: ApplicationConfig = {
  appName: 'icalc',
  appVersion: ICALC_APP_VERSION,
  availableLocales: ['de', 'en', 'en-US'],
  defaultLocale: 'en',
  defaultCountry: 'DE',
  translateServiceProvider: { provide: TranslateService, useClass: NgxTranslateService },
};
