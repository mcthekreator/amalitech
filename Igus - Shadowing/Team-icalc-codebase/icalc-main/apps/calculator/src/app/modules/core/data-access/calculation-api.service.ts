import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type {
  CalculationPresentation,
  CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto,
  CopyConfigurationToNewCalculationDto,
  CopyConfigurationToNewCalculationResponseDto,
  CreateCalculationAndConfigurationRequestDto,
  CreateCalculationAndConfigurationResponseDto,
  CreateNewConfigurationForExistingCalculationRequestDto,
  CreateNewConfigurationForExistingCalculationResponseDto,
  CopyConfigurationToExistingCalculationRequestDto,
  CopyConfigurationToExistingCalculationResponseDto,
  DuplicatingCalculationRequestDto,
  FilterCalculationResponseDto,
  HaveMat017ItemsOverridesChangedRequestDto,
  HaveMat017ItemsOverridesChangedResponseDto,
  AssignConfigurationToExistingCalculationRequestDto,
  AssignConfigurationToExistingCalculationResponseDto,
  RemoveLinkBetweenConfigurationAndCalculationRequestDto,
  RemoveLinkBetweenConfigurationAndCalculationResponseDto,
  RemoveMat017ItemsRequestDto,
  RemoveMat017ItemsResponseDto,
  SetExcelDownloadFlagsForCalculationRequestDto,
  SetExcelDownloadFlagsForCalculationResponseDto,
  UpdateCalculationRequestDto,
  UpdateCalculationWithSCC,
  UpdateMat017ItemsOverridesInConfigurationsResponseDto,
  UpdateMat017OverridesRequestDto,
} from '@igus/icalc-domain';
import type { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { getEnvironment } from '../../../../environments/environment';
import type { FilterCalculationsRequestParams } from '../state/search-state/search-state-model';

@Injectable({
  providedIn: 'root',
})
export class CalculationApiService {
  private readonly dataServiceUrl = getEnvironment().dataServiceUrl;
  constructor(private http: HttpClient) {}

  public removeLinkBetweenConfigurationAndCalculation(
    payload: RemoveLinkBetweenConfigurationAndCalculationRequestDto
  ): Observable<RemoveLinkBetweenConfigurationAndCalculationResponseDto | null> {
    return this.http
      .post<RemoveLinkBetweenConfigurationAndCalculationResponseDto>(
        `${this.dataServiceUrl}calculation/removeLinkBetweenConfigurationAndCalculation`,
        payload
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  public canLinkBetweenConfigurationAndCalculationBeRemoved(
    singleCableCalculationId: string
  ): Observable<CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto | unknown> {
    return this.http
      .post<CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto>(
        `${this.dataServiceUrl}calculation/canLinkBetweenConfigurationAndCalculationBeRemoved`,
        {
          singleCableCalculationId,
        }
      )

      .pipe(catchError((err: unknown) => of(err)));
  }

  public copyConfigurationToExistingCalculation(
    payload: CopyConfigurationToExistingCalculationRequestDto
  ): Observable<CopyConfigurationToExistingCalculationResponseDto | null> {
    return this.http
      .post<CopyConfigurationToExistingCalculationResponseDto>(
        `${this.dataServiceUrl}calculation/copyConfigurationToExistingCalculation`,
        payload
      )
      .pipe(catchError(() => of(null)));
  }

  public assignConfigurationToExistingCalculation(
    payload: AssignConfigurationToExistingCalculationRequestDto
  ): Observable<AssignConfigurationToExistingCalculationResponseDto | null> {
    return this.http
      .post<AssignConfigurationToExistingCalculationResponseDto>(
        `${this.dataServiceUrl}calculation/assignConfigurationToExistingCalculation`,
        payload
      )
      .pipe(catchError(() => of(null)));
  }

  public filterCalculations(
    filterCalculationsParams: FilterCalculationsRequestParams
  ): Observable<FilterCalculationResponseDto | null> {
    const params = new HttpParams({
      fromObject: {
        ...filterCalculationsParams.calculationListFilter,
        ...filterCalculationsParams.calculationListOperands,
        ...filterCalculationsParams.calculationListInformation,
      },
    });

    return this.http
      .get<FilterCalculationResponseDto>(`${this.dataServiceUrl}calculation/filter`, {
        params,
      })
      .pipe(catchError(() => of(null)));
  }

  public findByNumber(calculationNumber: string): Observable<CalculationPresentation> {
    return this.http.get<CalculationPresentation>(`${this.dataServiceUrl}calculation/findByNumber`, {
      params: new HttpParams().append('calculationNumber', `${calculationNumber}`),
    });
  }

  public copyConfigurationToNewCalculation(
    payload: CopyConfigurationToNewCalculationDto
  ): Observable<CopyConfigurationToNewCalculationResponseDto> {
    return this.http.post<CopyConfigurationToNewCalculationResponseDto>(
      `${this.dataServiceUrl}calculation/copyConfigurationToNewCalculation`,
      payload
    );
  }

  public duplicateCalculation(
    payload: DuplicatingCalculationRequestDto
  ): Observable<CopyConfigurationToNewCalculationResponseDto> {
    return this.http.post<CopyConfigurationToNewCalculationResponseDto>(
      `${this.dataServiceUrl}calculation/assignConfigurationItemsToCopiedCalculation`,
      payload
    );
  }

  public createNewConfigurationForExistingCalculation(
    payload: CreateNewConfigurationForExistingCalculationRequestDto
  ): Observable<CreateNewConfigurationForExistingCalculationResponseDto | null> {
    return this.http
      .post<CreateNewConfigurationForExistingCalculationResponseDto>(
        `${this.dataServiceUrl}calculation/createNewConfigurationForExistingCalculation`,
        payload
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  public createNewCalculationAndConfiguration(
    payload: CreateCalculationAndConfigurationRequestDto
  ): Observable<CreateCalculationAndConfigurationResponseDto | null> {
    return this.http
      .post<CreateCalculationAndConfigurationResponseDto>(
        `${this.dataServiceUrl}calculation/createCalculationAndConfiguration`,
        payload
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  public patchCalculation(payload: UpdateCalculationRequestDto): Observable<UpdateCalculationWithSCC> {
    return this.http.patch<UpdateCalculationWithSCC>(`${this.dataServiceUrl}calculation`, payload).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  public setExcelDownloadFlags(
    payload: SetExcelDownloadFlagsForCalculationRequestDto
  ): Observable<SetExcelDownloadFlagsForCalculationResponseDto> {
    return this.http
      .patch<SetExcelDownloadFlagsForCalculationResponseDto>(
        `${this.dataServiceUrl}calculation/setExcelDownloadFlags`,
        payload
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  public haveMat017ItemsOverridesChanged(
    payload: HaveMat017ItemsOverridesChangedRequestDto
  ): Observable<HaveMat017ItemsOverridesChangedResponseDto | null> {
    return this.http
      .post<HaveMat017ItemsOverridesChangedResponseDto>(
        `${this.dataServiceUrl}calculation/haveMat017ItemsOverridesChanged`,
        payload
      )
      .pipe(catchError(() => of(null)));
  }

  public updateMat017ItemOverrides(
    payload: UpdateMat017OverridesRequestDto
  ): Observable<UpdateMat017ItemsOverridesInConfigurationsResponseDto> {
    return this.http
      .patch<UpdateMat017ItemsOverridesInConfigurationsResponseDto>(
        `${this.dataServiceUrl}calculation/updateMat017ItemsOverrides`,
        payload
      )
      .pipe(
        catchError((_error: unknown) => {
          return of(null);
        })
      );
  }

  public removeMat017Items(payload: RemoveMat017ItemsRequestDto): Observable<RemoveMat017ItemsResponseDto | null> {
    return this.http
      .patch<RemoveMat017ItemsResponseDto>(`${this.dataServiceUrl}calculation/removeMat017Items`, payload)
      .pipe(catchError(() => of(null)));
  }
}
