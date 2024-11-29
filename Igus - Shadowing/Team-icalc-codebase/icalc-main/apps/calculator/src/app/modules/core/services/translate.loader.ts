import type { HttpClient } from '@angular/common/http';
import type { CordovaFileService, CordovaWindow, WindowService } from '@igus/kopla-app';
import { CordovaService } from '@igus/kopla-app';
import type { TranslateLoader as NgTranslateLoader } from '@ngx-translate/core';
import { ICALC_APP_VERSION } from '../../../../version';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

type CordovaFile = {
  applicationDirectory: string;
};

export class TranslateLoader implements NgTranslateLoader {
  constructor(
    private readonly http: HttpClient,
    private readonly cordovaFileService: CordovaFileService,
    private readonly windowService: WindowService,
    private readonly prefix: string,
    private readonly suffix: string,
    private readonly version: string
  ) {}

  /**
   * Gets the translations from the server or the file system if running inside cordova app
   *
   * @param lang The language code to get the translations for
   */
  public getTranslation(lang: string): Observable<Record<string, Record<string, string>>> {
    const window = this.windowService.nativeWindow as CordovaWindow;

    if (CordovaService.appRunsOnCordovaPlatform(window)) {
      const cordovaFilePath = window.cordova.file as CordovaFile;
      const fileDirectory = `${cordovaFilePath.applicationDirectory}www${this.prefix}/`;
      const fileName = `${lang}.${this.version}${this.suffix}`;

      return from(this.cordovaFileService.getFileData<string>(fileDirectory, fileName, false)).pipe(
        map((data) => (data ? (JSON.parse(data) as Record<string, Record<string, string>>) : {}))
      );
    } else {
      return this.http.get<Record<string, Record<string, string>>>(
        `${this.prefix}/${lang}.${this.version}${this.suffix}`
      );
    }
  }
}

/**
 * Creates a {@link TranslateLoader} instance.
 *
 * @param http A HttpClient instance
 * @param cordovaFileService A CordovaFileService instance
 * @param windowService A WindowService instance
 */
export const translateFactory = (
  http: HttpClient,
  cordovaFileService: CordovaFileService,
  windowService: WindowService
): TranslateLoader => {
  return new TranslateLoader(http, cordovaFileService, windowService, '/i18n', '.json', ICALC_APP_VERSION);
};
