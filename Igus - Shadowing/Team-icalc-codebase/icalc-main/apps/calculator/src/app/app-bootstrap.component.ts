import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter, first, pairwise } from 'rxjs/operators';

import { IcalcRoutes } from './constants/route.constants';
import { AppStateFacadeService } from './modules/core/state/app-state/app-state-facade.service';

/**
 * The `AppBootstrapComponent` has the responsibility to
 * bootstrap the whole application as wrapping element.
 *
 * This allows us to use an AppResolver before any other Component is initialized.
 *
 * If we would use the AppComponent directly, its and its template-nested child components ngOnInit
 * methods would be called before the AppResolver.
 */
@Component({
  selector: 'icalc-app-bootstrap',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBootstrapComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly appStateFacadeService: AppStateFacadeService
  ) {}

  /**
   * Removes splash from html
   */
  private static removeSplashScreen(): void {
    const splashElem = document.querySelector('#icalc_splash');

    if (splashElem) {
      splashElem.setAttribute('style', 'display:none;');
    }

    if ('splashscreen' in navigator) {
      (navigator as unknown as { splashscreen: { hide(): void } }).splashscreen.hide();
    }
  }

  /**
   * Removes splash after first navigation ends occurs
   */
  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        first(),
        delay(100)
      )
      .subscribe(() => AppBootstrapComponent.removeSplashScreen());
    this.appStateFacadeService.isUserLoggedIn$.pipe(pairwise()).subscribe((values) => {
      if (values[0] === false && values[1] === true) {
        this.router.navigate([`/app/${IcalcRoutes.metaData}`]);
      }
      if (values[0] === true && values[1] === false) {
        /**
         * this means that the rt is expired or user choose to log out.
         * we have to reload the page in order to delete everything
         * inside the state
         */
        location.reload();
      }
    });
  }
}
