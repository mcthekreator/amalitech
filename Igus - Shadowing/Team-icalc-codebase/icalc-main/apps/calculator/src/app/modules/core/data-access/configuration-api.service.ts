import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { ConfigurationPresentation, FilterConfigurationResponseDto } from '@igus/icalc-domain';
import type { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { getEnvironment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationApiService {
  constructor(private http: HttpClient) {}

  public findByNumber(matNumber: string): Observable<ConfigurationPresentation | null | HttpErrorResponse> {
    return this.http
      .get<ConfigurationPresentation>(`${getEnvironment().dataServiceUrl}configuration/findByNumber`, {
        params: new HttpParams().append('matNumber', `${matNumber}`),
      })
      .pipe(
        catchError((error: unknown) => {
          console.log(error);
          return of(error as HttpErrorResponse);
        })
      );
  }

  public filterConfigurations(filterConfigurationsParams: {
    configurationListFilter;
    configurationListOperands;
    configurationListInformation;
  }): Observable<FilterConfigurationResponseDto> {
    const params = new HttpParams({
      fromObject: {
        ...filterConfigurationsParams.configurationListFilter,
        ...filterConfigurationsParams.configurationListOperands,
        ...filterConfigurationsParams.configurationListInformation,
      },
    });

    return this.http
      .get<FilterConfigurationResponseDto>(`${getEnvironment().dataServiceUrl}configuration/filterConfiguration`, {
        params,
      })
      .pipe(catchError(() => of(null)));
  }
}
