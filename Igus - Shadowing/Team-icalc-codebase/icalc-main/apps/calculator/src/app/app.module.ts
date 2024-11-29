import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ConsoleLoggerModule } from '@igus/kopla-app';

import { getEnvironment } from '../environments/environment';
import { AppBootstrapComponent } from './app-bootstrap.component';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routing';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [AppBootstrapComponent, AppComponent],
  bootstrap: [AppBootstrapComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    ConsoleLoggerModule,
    RouterModule.forRoot(appRoutes, { useHash: getEnvironment().useHash }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
