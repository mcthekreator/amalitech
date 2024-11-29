import { HttpClient } from '@angular/common/http';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { CordovaFileService, WindowService, WindowServiceMock, WindowServiceMockProvider } from '@igus/kopla-app';
import { ICALC_APP_VERSION } from '../../../../version';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import type { TranslateLoader } from './translate.loader';
import { translateFactory } from './translate.loader';

describe('TranslateLoader', () => {
  class CordovaFileServiceMock {
    public getFileData(): Promise<string | undefined> {
      return Promise.resolve(undefined);
    }
  }

  class HttpMock {
    public get(_: string): Observable<{ json(): string | undefined }> {
      return of({ json: () => undefined });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CordovaFileService, useClass: CordovaFileServiceMock },
        { provide: HttpClient, useClass: HttpMock },
        WindowServiceMockProvider,
      ],
    });
  });

  let translateLoader: TranslateLoader;

  beforeEach(inject(
    [CordovaFileService, HttpClient, WindowService],
    (_cordovaFileService: CordovaFileService, _http: HttpClient, _windowService: WindowService) => {
      translateLoader = translateFactory(_http, _cordovaFileService, _windowService);
    }
  ));

  describe('getTranslation', () => {
    it('should request by http', waitForAsync(() => {
      const mockSpy = jest.spyOn(HttpMock.prototype, 'get').mockReturnValue(of({ json: () => '{}' }));

      translateLoader.getTranslation('en').subscribe(() => {
        expect(mockSpy).toHaveBeenCalledWith(`/i18n/en.${ICALC_APP_VERSION}.json`);
      });
    }));

    it('should request file service on cordova', waitForAsync(() => {
      jest.spyOn(WindowServiceMock.prototype, 'nativeWindow', 'get').mockReturnValue({
        cordova: {
          file: { applicationDirectory: '' },
        },
      } as never);
      const mockSpy = jest
        .spyOn(CordovaFileServiceMock.prototype, 'getFileData')
        .mockReturnValue(Promise.resolve('{}'));

      translateLoader.getTranslation('en').subscribe(() => {
        void expect(mockSpy).toHaveBeenCalled();
      });
    }));
  });
});
