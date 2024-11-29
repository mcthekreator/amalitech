import { Injectable } from '@angular/core';
import type { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import { getEnvironment } from '../../../../environments/environment';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';
import { ProcessStateFacadeService } from '../state/process-state/process-state-facade.service';

/**
 * for almost every step some state variables must be set:
 * example: for connector step we need a chainflex cable
 * this guard guards the routes and checks if inside the state
 * the necessary information is ready or not.
 */
@Injectable()
export class RequiredDataGuard {
  public canActivateRules: { [key in IcalcRoutes]?: Observable<boolean> };
  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private router: Router
  ) {
    this.canActivateRules = {
      [IcalcRoutes.metaData]: this.processStateFacadeService.isValid$,
      [IcalcRoutes.chainFlex]: this.processStateFacadeService.isValidChainflex$,
      [IcalcRoutes.connectorLeft]: this.processStateFacadeService.isLeftConnectorValid$,
      [IcalcRoutes.connectorRight]: this.processStateFacadeService.isLeftConnectorValid$,
      [IcalcRoutes.library]: this.processStateFacadeService.isLibraryValid$,
    };
  }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    if (getEnvironment().accessSubRoutes === 'disabled' && route?.data) {
      const isValid$ = this.canActivateRules[route.data.requiredData] as Observable<boolean>;

      if (!isValid$) {
        return of(true);
      }
      return isValid$?.pipe(
        map((value) => {
          if (!value) {
            return this.router.parseUrl(`app/${route.data.redirectTo}`);
          }
          return value;
        })
      );
    }
    return of(true);
  }
}
