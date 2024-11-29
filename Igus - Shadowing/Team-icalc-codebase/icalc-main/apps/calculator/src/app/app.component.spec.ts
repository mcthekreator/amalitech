import { ChangeDetectorRef, ElementRef, ErrorHandler, NO_ERRORS_SCHEMA } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import type { Environment, Locale } from '@igus/kopla-app';
import {
  ConfigurationManagementService,
  ContactFormService,
  DomainResolver,
  EnvironmentService,
  FileService,
  LazyTranslatedNotificationService,
  LiabilityDisclaimerService,
  LocaleResolver,
  Logger,
  NotificationService,
  ShopSessionHelperService,
} from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { TranslationResolver } from './modules/core/services/translation.resolver';
import { AppStateFacadeService } from './modules/core/state/app-state/app-state-facade.service';
import { ProcessStateFacadeService } from './modules/core/state/process-state/process-state-facade.service';
import { PinAssignmentStateFacadeService } from './modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { ChainflexStateFacadeService } from './modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from './modules/core/state/connector-state/connector-state-facade.service';
import { LibraryStateFacadeService } from './modules/core/state/library-state/library-state-facade.service';

class Angulartics2Mock {}

class Angulartics2GoogleTagManagerMock {}

class FileServiceMock {}

class EnvironmentServiceMock {
  public getRawEnvironmentConfig(): Environment {
    return {} as Environment;
  }

  public getLogLevel(): string {
    return 'debug';
  }
}

class TranslateServiceMock {}

class TranslationResolverMock {
  public resolve(): Promise<void> {
    return Promise.resolve();
  }
}

class RouterMock {
  public events = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    subscribe: (): void => {},
  };
}

class NotificationServiceMock {}

class ElementRefMock {
  public get nativeElement(): { scrollIntoView(): void } {
    return {
      scrollIntoView: (): void => {
        return;
      },
    };
  }
}

class ChangeDetectorRefMock {
  public detectChanges(): void {
    return;
  }
}

class LiabilityDisclaimerServiceMock {
  public reset(): void {
    return;
  }
}

class ConfigurationManagementServiceMock {}

class ContactFormServiceMock {}

class FormBuilderMock {}

class ShopSessionHelperServiceMock {}

class ErrorHandlerMock {}

class ProcessStateFacadeServiceMock {}

class PinAssignmentStateFacadeServiceMock {}

class ChainflexStateFacadeServiceMock {}

class ConnectorStateFacadeServiceMock {}

class LibraryStateFacadeServiceMock {}

class LazyTranslatedNotificationServiceMock {
  public showNotifications(): void {
    return;
  }
}

class LocaleResolverMock {
  public getLocale(): Observable<Locale> {
    return of({ language: 'de', countryCode: 'DE' });
  }
}

class DomainResolverMock {
  public getDomainForCustomLocale(): Observable<string> {
    return of('test.de');
  }
}

describe('App: iCalc Calculator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AppComponent,
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslationResolver, useClass: TranslationResolverMock },
        { provide: Router, useClass: RouterMock },
        { provide: NotificationService, useClass: NotificationServiceMock },
        { provide: ElementRef, useClass: ElementRefMock },
        { provide: ChangeDetectorRef, useClass: ChangeDetectorRefMock },
        { provide: Logger, useClass: Logger },
        { provide: EnvironmentService, useClass: EnvironmentServiceMock },
        { provide: FileService, useClass: FileServiceMock },
        { provide: LiabilityDisclaimerService, useClass: LiabilityDisclaimerServiceMock },
        { provide: ConfigurationManagementService, useClass: ConfigurationManagementServiceMock },
        { provide: ContactFormService, useClass: ContactFormServiceMock },
        { provide: FormBuilder, useClass: FormBuilderMock },
        { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleTagManagerMock },
        { provide: ShopSessionHelperService, useClass: ShopSessionHelperServiceMock },
        { provide: Angulartics2, useClass: Angulartics2Mock },
        { provide: ErrorHandler, useClass: ErrorHandlerMock },
        { provide: LocaleResolver, useClass: LocaleResolverMock },
        { provide: DomainResolver, useClass: DomainResolverMock },
        { provide: LazyTranslatedNotificationService, useClass: LazyTranslatedNotificationServiceMock },
        { provide: AppStateFacadeService, useValue: { mainCssClass$: of(null) } },
        { provide: ProcessStateFacadeService, useClass: ProcessStateFacadeServiceMock },
        { provide: PinAssignmentStateFacadeService, useClass: PinAssignmentStateFacadeServiceMock },
        { provide: ChainflexStateFacadeService, useClass: ChainflexStateFacadeServiceMock },
        { provide: ConnectorStateFacadeService, useClass: ConnectorStateFacadeServiceMock },
        { provide: LibraryStateFacadeService, useClass: LibraryStateFacadeServiceMock },
        {
          provide: MatSnackBar,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should create the app', inject([AppComponent], (app: AppComponent) => {
    void expect(app).toBeDefined();
  }));
});
