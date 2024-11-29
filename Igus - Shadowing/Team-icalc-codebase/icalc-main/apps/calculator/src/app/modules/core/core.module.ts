import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { applicationConfig } from '@icalc/frontend/app/app.config';
import {
  CordovaFileService,
  CultureSelectModule,
  KoplaCoreCordovaModule,
  SentryModule,
  WindowService,
} from '@igus/kopla-app';
import { TranslateLoader as NgTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { Angulartics2Module } from 'angulartics2';
import { getEnvironment } from '../../../environments/environment';

import { AppInitializationService } from './services/app-initialization.service';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';
import { RequiredDataGuard } from './services/required-data.guard';
import { translateFactory } from './services/translate.loader';
import { WithCredentialsInterceptor } from './services/with-credentials.interceptor';
import { AppState } from './state/app-state/app.state';
import { ChainflexState } from './state/chainflex-state/chainflex.state';
import { ConnectorState } from './state/connector-state/connector.state';
import { LibraryState } from './state/library-state/library-state';
import { PinAssignmentState } from './state/pin-assignment-state/pin-assignment-state';
import { ProcessState } from './state/process-state/process.state';
import { SearchState } from './state/search-state/search-state';

const initializeApplication = (appLoadService: AppInitializationService): (() => Promise<void>) => {
  return () => appLoadService.initializeApplication();
};

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      AppState,
      ChainflexState,
      ConnectorState,
      LibraryState,
      PinAssignmentState,
      ProcessState,
      SearchState,
    ]),
    NgxsDispatchPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({ name: 'icalc frontend state' }),
    KoplaCoreCordovaModule.forRoot(getEnvironment(), applicationConfig),
    Angulartics2Module.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: NgTranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient, CordovaFileService, WindowService],
      },
    }),
    SentryModule.forRoot(),
    CultureSelectModule.forRoot(),
  ],
  providers: [
    AppInitializationService,
    { provide: APP_INITIALIZER, useFactory: initializeApplication, deps: [AppInitializationService], multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    AuthGuard,
    LoginGuard,
    RequiredDataGuard,
  ],
  declarations: [],
  exports: [TranslateModule],
})
export class CoreModule {}
