import { Injectable } from '@angular/core';

import { ApplicationConfig, AvailableLanguageResolver, LocaleMapper, LocaleResolver } from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import type { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslationResolver {
  private browserLanguage: string = this.translate.getBrowserLang();
  constructor(
    private readonly translate: TranslateService,
    private readonly localeResolver: LocaleResolver,
    private readonly localeMapper: LocaleMapper,
    private readonly availableLanguageResolver: AvailableLanguageResolver,
    private readonly applicationConfig: ApplicationConfig
  ) {}

  public resolve(): Observable<unknown> {
    return this.localeResolver.getLocale().pipe(
      switchMap((locale) => this.localeMapper.customLocaleToIETFLanguageTag(locale)),
      switchMap((language) => {
        const icalcLanguage =
          language === this.browserLanguage
            ? (this.translate.use(
                this.availableLanguageResolver.getClosestAvailableLanguageTag(language as string) ||
                  this.applicationConfig.defaultLocale
              ) as Observable<unknown>)
            : (this.translate.use(
                this.availableLanguageResolver.getClosestAvailableLanguageTag(this.browserLanguage as string) ||
                  this.applicationConfig.defaultLocale
              ) as Observable<unknown>);

        return icalcLanguage;
      })
    );
  }
}
