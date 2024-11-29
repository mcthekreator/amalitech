import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import type { UnitSystem } from '@igus/kopla-app';
import { AboutComponent, LiabilityDisclaimerService, NotificationService, UnitSystemResolver } from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2 } from 'angulartics2';
import {
  ICALC_APP_VERSION,
  ICALC_DOMAIN_VERSION,
  KOPLA_APP_VERSION,
  KOPLA_DOMAIN_VERSION,
} from '../../../../../version';

import { AppStateFacadeService } from '../../../core/state/app-state/app-state-facade.service';

@Component({
  selector: 'icalc-header-menu',
  templateUrl: './header-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMenuComponent implements OnInit {
  @Input()
  public homepageUrl = '/';

  @Input()
  public imprintUrl = '/';

  @Input()
  public dataPrivacyUrl = '/';

  @Input()
  public imprintLabel = '_imprint';

  @Input()
  public dataPrivacyLabel = '_dataPrivacy';

  @ViewChild(AboutComponent, { static: false })
  private readonly aboutOverlay!: AboutComponent;

  public unitSystem?: UnitSystem;
  public versions = [
    { name: '@igus/icalc-calculator', version: ICALC_APP_VERSION },
    { name: '@igus/icalc-domain', version: ICALC_DOMAIN_VERSION },
    { name: '@igus/kopla-app', version: KOPLA_APP_VERSION },
    { name: '@igus/kopla-domain', version: KOPLA_DOMAIN_VERSION },
  ];

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly unitSystemResolver: UnitSystemResolver,
    private readonly liabilityDisclaimerService: LiabilityDisclaimerService,
    private readonly angulartics2: Angulartics2,
    private appStateFacadeService: AppStateFacadeService
  ) {}

  public get loadNewConfig(): () => void {
    return (): void => {
      this.trackNewConfigClick();
      void this.router.navigate(['/']).then(() => {
        this.notifyInfo(this.translate.instant('kopla.common.CONFIGURATION_RESET_CONFIRMATION'));
      });
      this.liabilityDisclaimerService.reset();
    };
  }

  public ngOnInit(): void {
    this.initUnitSystemSwitch();
  }

  public openAdminDashboard(): void {
    this.router.navigate([IcalcRoutes.admin]);
  }

  /****************************************************************************************
   * Tracking
   */

  public trackNewConfigClick(): void {
    this.angulartics2.eventTrack.next({ action: 'MyConfig|ResetConfig|List' });
  }

  public trackMenuIconClick(): void {
    this.angulartics2.eventTrack.next({ action: 'Menu|Button' });
  }

  public trackViewClick(viewId: string): void {
    switch (viewId) {
      case 'configuration':
        this.angulartics2.eventTrack.next({ action: 'MyConfig|List' });
        break;
      case 'unitsystemswitch':
        this.angulartics2.eventTrack.next({ action: 'Settings|List' });
        break;
      default:
        return;
    }
  }

  public onLogout(): void {
    this.appStateFacadeService.logoutUser();
  }

  public cultureTrack(action: string): void {
    this.angulartics2.eventTrack.next({ action: 'Culture|' + action + '|Textlink' });
  }

  private initUnitSystemSwitch(): void {
    this.unitSystemResolver.unitSystem$.subscribe((unitSystem) => (this.unitSystem = unitSystem));
  }

  private notifyInfo(label: string, clickHandler?: () => void, link?: string, timeout?: boolean): void {
    this.notificationService.showToast({
      type: 'info',
      label,
      clickHandler,
      linkLabel: link,
      timeout,
    });
  }
}
