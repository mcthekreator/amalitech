import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { ApplicationConfig, AvailableLanguageResolver, LocaleMapper, LocaleResolver } from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { TranslationResolver } from './translation.resolver';

describe('TranslationResolver', () => {
  class ApplicationConfigMock {
    public defaultLocale = 'en';
    public availableLocales = ['de', 'en', 'pl'];
  }

  class AvailableLanguageResolverMock {
    public getClosestAvailableLanguageTag(): string {
      return 'pl';
    }
  }

  class TranslateServiceMock {
    public use = (key: string): Observable<string> => of(key);
    public getBrowserLang(): string {
      return 'pl';
    }
  }

  class LocaleResolverMock {
    public getLocale(): Observable<{ language: string }> {
      return of({ language: 'pl' });
    }
  }

  class LocaleMapperMock {
    public customLocaleToIETFLanguageTag(): Observable<string> {
      return of('pl-PL');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TranslationResolver,
        { provide: AvailableLanguageResolver, useClass: AvailableLanguageResolverMock },
        { provide: LocaleResolver, useClass: LocaleResolverMock },
        { provide: LocaleMapper, useClass: LocaleMapperMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: ApplicationConfig, useClass: ApplicationConfigMock },
      ],
    });
  });

  let resolver: TranslationResolver;

  beforeEach(inject([TranslationResolver], (_ref: TranslationResolver) => {
    resolver = _ref;
  }));

  describe('resolve', () => {
    it('should return pl', waitForAsync(() => {
      resolver.resolve().subscribe((culture) => {
        void expect(culture).toBe('pl');
      });
    }));

    it('should return en', waitForAsync(() => {
      jest.spyOn(AvailableLanguageResolverMock.prototype, 'getClosestAvailableLanguageTag').mockReturnValue('en');
      resolver.resolve().subscribe((culture) => {
        void expect(culture).toBe('en');
      });
    }));

    it('should set the language correctly if the browser language matches the locale language', waitForAsync(() => {
      jest.spyOn(LocaleResolverMock.prototype, 'getLocale').mockReturnValue(of({ language: 'de' }));
      jest.spyOn(LocaleMapperMock.prototype, 'customLocaleToIETFLanguageTag').mockReturnValue(of('de'));
      jest.spyOn(TranslateServiceMock.prototype, 'getBrowserLang').mockReturnValue('de');

      let locale = '';

      LocaleMapperMock.prototype.customLocaleToIETFLanguageTag().subscribe((language) => {
        locale = language;
      });
      const browserLang = TranslateServiceMock.prototype.getBrowserLang();

      if (locale === browserLang) {
        jest.spyOn(AvailableLanguageResolverMock.prototype, 'getClosestAvailableLanguageTag').mockReturnValue(locale);
        resolver.resolve().subscribe((culture) => {
          void expect(culture).toBe(locale);
        });
      }
    }));

    it('should set the language to browser language when the browser language and locale language do not match', waitForAsync(() => {
      jest.spyOn(LocaleResolverMock.prototype, 'getLocale').mockReturnValue(of({ language: 'en' }));
      jest.spyOn(LocaleMapperMock.prototype, 'customLocaleToIETFLanguageTag').mockReturnValue(of('en'));
      jest.spyOn(TranslateServiceMock.prototype, 'getBrowserLang').mockReturnValue('de');

      let locale = '';

      LocaleMapperMock.prototype.customLocaleToIETFLanguageTag().subscribe((language) => {
        locale = language;
      });
      const browserLang = TranslateServiceMock.prototype.getBrowserLang();

      if (locale !== browserLang) {
        jest
          .spyOn(AvailableLanguageResolverMock.prototype, 'getClosestAvailableLanguageTag')
          .mockReturnValue(browserLang);
        resolver.resolve().subscribe((culture) => {
          void expect(culture).toBe(browserLang);
        });
      }
    }));

    it('should set the language to English when the browser language is neither English nor German', waitForAsync(() => {
      jest.spyOn(LocaleResolverMock.prototype, 'getLocale').mockReturnValue(of({ language: 'en' }));
      jest.spyOn(LocaleMapperMock.prototype, 'customLocaleToIETFLanguageTag').mockReturnValue(of('en'));
      jest.spyOn(TranslateServiceMock.prototype, 'getBrowserLang').mockReturnValue('es');
      const allowedLang = ['de', 'en'];
      const defaultLang = 'en';

      const browserLang = TranslateServiceMock.prototype.getBrowserLang();

      if (!allowedLang.includes(browserLang)) {
        jest
          .spyOn(AvailableLanguageResolverMock.prototype, 'getClosestAvailableLanguageTag')
          .mockReturnValue(defaultLang);
        resolver.resolve().subscribe((culture) => {
          void expect(culture).toBe(defaultLang);
        });
      }
    }));
  });
});
