import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import type { ScriptDefinition } from '@igus/kopla-app';
import { PiwikTagManagerService } from '@igus/kopla-app';
import { getEnvironment } from '../../../../environments/environment';
import { catchError, lastValueFrom, of, take } from 'rxjs';

import { AppStateFacadeService } from '../state/app-state/app-state-facade.service';
import type { UserData } from '../state/app-state/app-state.model';

@Injectable()
export class AppInitializationService {
  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private readonly http: HttpClient,
    private readonly piwikTagManager: PiwikTagManagerService,
    private readonly router: Router
  ) {}

  public async initializeApplication(): Promise<void> {
    const profile = await this.getUserProfile();

    this.initializeTracking();
    if (profile) {
      // we are logged in
      this.appStateFacadeService.setUser(profile);
    } else {
      // clean up and go to login page
      this.router.navigate([`/app/${IcalcRoutes.auth}`]);
    }
  }

  private initializeTracking(): Promise<string | ScriptDefinition> {
    const request$ = this.piwikTagManager.inject().pipe(
      take(1),
      catchError(() => '')
    );

    return lastValueFrom(request$);
  }

  private getUserProfile(): Promise<UserData> {
    const request$ = this.http
      .get<UserData>(`${getEnvironment().dataServiceUrl}auth/profile`, { withCredentials: true })
      .pipe(
        take(1),
        catchError((error: unknown) => {
          console.log(error);
          return of(null);
        })
      );

    return lastValueFrom(request$);
  }
}
