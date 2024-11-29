import type { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { IcalcAuthResponse } from '@igus/icalc-domain';
import { getEnvironment } from '../../../../environments/environment';
import type { Observable } from 'rxjs';
import { catchError, of, switchMap, throwError } from 'rxjs';

import { AppStateFacadeService } from '../state/app-state/app-state-facade.service';

const refreshUrl = `${getEnvironment().dataServiceUrl}auth/refresh`;

@Injectable({
  providedIn: 'root',
})
export class WithCredentialsInterceptor implements HttpInterceptor {
  constructor(
    private readonly http: HttpClient,
    private readonly appStateFacadeService: AppStateFacadeService
  ) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const withCredentials = req.url.indexOf(getEnvironment().dataServiceUrl) === 0;

    return next.handle(req.clone({ withCredentials })).pipe(
      catchError((error: unknown) => {
        if (req.url !== refreshUrl && (error as HttpErrorResponse).status === 401) {
          return this.http.post<IcalcAuthResponse>(refreshUrl, {}).pipe(
            catchError(() => {
              this.appStateFacadeService.removeUser();
              return of('failed' as IcalcAuthResponse);
            }),
            switchMap((refreshResult) => {
              if (refreshResult === 'refreshed') {
                return next.handle(req.clone({ withCredentials: true }));
              }
              return null;
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
