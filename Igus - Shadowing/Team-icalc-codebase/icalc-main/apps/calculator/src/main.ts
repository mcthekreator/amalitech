import type { NgModuleRef } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CordovaService } from '@igus/kopla-app';
import { getEnvironment } from './environments/environment';
import { firstValueFrom, from, fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppModule } from './app/app.module';
import './locales';
import { initSentry } from './sentry';

initSentry();

if (getEnvironment().production) {
  enableProdMode();
}

export const main = (): Promise<NgModuleRef<AppModule>> => {
  const bootstrap = (): Promise<NgModuleRef<AppModule>> => platformBrowserDynamic().bootstrapModule(AppModule);

  if (CordovaService.appRunsOnCordovaPlatform(window)) {
    return firstValueFrom(
      fromEvent(document, 'deviceready', { capture: false }).pipe(switchMap(() => from(bootstrap())))
    );
  } else {
    return bootstrap();
  }
};

main().catch((err) => console.log(err));
