import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { AppStateFacadeService } from '../state/app-state/app-state-facade.service';

@Injectable()
export class AuthGuard {
  constructor(
    private appStateFacadeService: AppStateFacadeService,
    public router: Router
  ) {}

  public canActivate(): Observable<boolean> {
    return this.appStateFacadeService.isUserLoggedIn$.pipe(
      map((value) => {
        const result = value;

        if (result === false) {
          this.router.navigate([IcalcRoutes.auth]);
        }
        return result;
      })
    );
  }
}
