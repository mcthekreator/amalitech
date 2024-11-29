import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DomainResolver, LiabilityDisclaimerService, LocaleResolver, ShopSessionHelperService } from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import type { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppStateFacadeService } from './modules/core/state/app-state/app-state-facade.service';
import { RevokeConfigurationApprovalComponent } from './modules/shared/components/revoke-configuration-approval/revoke-configuration-approval.component';
import { ProcessStateFacadeService } from './modules/core/state/process-state/process-state-facade.service';
import { PinAssignmentStateFacadeService } from './modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { LibraryStateFacadeService } from './modules/core/state/library-state/library-state-facade.service';
import { ConnectorStateFacadeService } from './modules/core/state/connector-state/connector-state-facade.service';
import { ChainflexStateFacadeService } from './modules/core/state/chainflex-state/chainflex-state-facade.service';

@Component({
  selector: 'icalc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public subscriptions = new Subscription();
  /**
   * Url for the imprint pop up
   * Base url is http://www.igus.de/Imprint
   * Several parameters are needed to open the imprint page as:
   * Parameter `POP=yes` allows window to open in pop up
   * Parameters of culture with `c={{country}}&l={{language}}`
   */
  public imprintUrl = 'http://www.igus.de/Imprint';

  /**
   * Url fot the data privacy page
   * Needs to be formatted as
   * http://www.igus.de/r05/staticContent/dse/dse_{{COUNTRY}}{{language}}.html
   */
  public dataPrivacyUrl = 'http://www.igus.de/r05/staticContent/dse/dse_';

  /**
   * Url to the igus' homepage
   * Has to be localized
   */
  public homepageUrl?: string;
  public mainCssClass$: Observable<string>;
  public isUserLoggedIn$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly liabilityDisclaimerService: LiabilityDisclaimerService,
    private readonly sessionHelperService: ShopSessionHelperService,
    private readonly translate: TranslateService,
    private readonly title: Title,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly localeResolver: LocaleResolver,
    private readonly appStateFacadeService: AppStateFacadeService,
    private readonly processStateFacadeService: ProcessStateFacadeService,
    private readonly pinAssignmentStateFacadeService: PinAssignmentStateFacadeService,
    private readonly libraryStateFacadeService: LibraryStateFacadeService,
    private readonly connectorStateFacadeService: ConnectorStateFacadeService,
    private readonly chainflexStateFacadeService: ChainflexStateFacadeService,
    private readonly domainResolver: DomainResolver,
    private matSnackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.mainCssClass$ = this.appStateFacadeService.mainCssClass$;
    this.isUserLoggedIn$ = this.appStateFacadeService.isUserLoggedIn$;
    this.setTitle();
    this.initRouter();
    this.initSessionHelperService();
    this.initializeConfigurationApprovalRevokeNotifier();

    // eslint-disable-next-line
    if ((window as any).Cypress) {
      // Expose StateFacadeServices on window for Cypress to load a user programmatically
      // TODO: Check for possible routing restrictions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).appStateFacadeService = this.appStateFacadeService;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).processStateFacadeService = this.processStateFacadeService;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).pinAssignmentStateFacadeService = this.pinAssignmentStateFacadeService;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).libraryStateFacadeService = this.libraryStateFacadeService;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).connectorStateFacadeService = this.connectorStateFacadeService;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).chainflexStateFacadeService = this.chainflexStateFacadeService;
    }

    this.localeResolver
      .getLocale()
      .pipe(
        switchMap(({ language, countryCode }) => {
          this.setCultureInMetaTags(language, countryCode);
          return this.setLocalizedLinks(language, countryCode);
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /****************************************************************************************
   * Initializing global services
   */

  public setCultureInMetaTags(language: string, country: string): void {
    const metaTags = document.getElementsByTagName('meta');

    Array.prototype.forEach.call(metaTags, (metaTag: HTMLMetaElement) => {
      if (metaTag.getAttribute('name') === 'DCSext.M_Country') {
        metaTag.setAttribute('content', country);
      }
      if (metaTag.getAttribute('name') === 'DCSext.M_Language') {
        metaTag.setAttribute('content', language);
      }
    });
  }

  public scrollToTop(): void {
    (this.elementRef.nativeElement as Element).scrollIntoView();
  }

  private initRouter(): void {}

  private setLocalizedLinks(language: string, countryCode: string): Observable<string> {
    return this.domainResolver.getDomainForCustomLocale({ language, countryCode }).pipe(
      tap((domain) => {
        this.homepageUrl = `https://${domain}`;
        this.imprintUrl += `?POP=yes&c=${countryCode}&l=${language}`;
        this.dataPrivacyUrl += `${countryCode}${language}.htm`;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  private initSessionHelperService(): void {
    this.sessionHelperService.sessionRemoved.subscribe(() => {
      this.liabilityDisclaimerService.reset();
    });
  }

  private setTitle(): void {
    this.translate.get('icalc.app.TITLE').subscribe((title) => {
      this.title.setTitle(title);
    });
  }

  private initializeConfigurationApprovalRevokeNotifier(): void {
    this.subscriptions.add(
      this.appStateFacadeService.hasConfigurationApprovalBeenRevoked$().subscribe(() => {
        this.matSnackBar.openFromComponent(RevokeConfigurationApprovalComponent, {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'icalc-snackbar-panel',
        });
      })
    );
  }
}
