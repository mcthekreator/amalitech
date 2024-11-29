import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type {
  CalculationConfigurationStatus,
  CheckForNewChainflexPricesRequestDto,
  CheckForNewChainflexPricesResult,
  RemoveChainflexDataRequestDto,
  RemoveChainflexDataResponseDto,
  SaveSingleCableCalculationRequestData,
  SaveSingleCableCalculationResponseDto,
  SingleCableCalculationPresentation,
  UpdateChainflexPricesRequestDto,
  UpdateChainflexPricesResult,
} from '@igus/icalc-domain';
import type { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { getEnvironment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SingleCableCalculationApiService {
  private readonly dataServiceUrl = getEnvironment().dataServiceUrl;
  constructor(private http: HttpClient) {}

  public fetchOneByCalculationId(calculationId: string): Observable<SingleCableCalculationPresentation> {
    return this.http
      .get<SingleCableCalculationPresentation>(
        `${this.dataServiceUrl}single-cable-calculation?calculationId=${calculationId}`
      )
      .pipe(catchError(() => of(null)));
  }

  public fetchOneByConfigurationId(configurationId: string): Observable<SingleCableCalculationPresentation> {
    return this.http
      .get<SingleCableCalculationPresentation>(
        `${this.dataServiceUrl}single-cable-calculation?configurationId=${configurationId}`
      )
      .pipe(catchError(() => of(null)));
  }

  public fetchOneBySingleCableCalculationId(
    singleCableCalculationId: string
  ): Observable<SingleCableCalculationPresentation> {
    return this.http
      .get<SingleCableCalculationPresentation>(
        `${this.dataServiceUrl}single-cable-calculation?singleCableCalculationId=${singleCableCalculationId}`
      )
      .pipe(catchError(() => of(null)));
  }

  public saveSingleCableCalculation(
    payload: SaveSingleCableCalculationRequestData
  ): Observable<SaveSingleCableCalculationResponseDto | null> {
    return this.http
      .post<SaveSingleCableCalculationResponseDto>(
        `${this.dataServiceUrl}single-cable-calculation/saveSingleCableCalculation`,
        payload
      )
      .pipe(catchError(() => of(null)));
  }

  public approve(calculationId: string, configurationId: string): Observable<CalculationConfigurationStatus> {
    return this.http
      .post<CalculationConfigurationStatus>(
        `${this.dataServiceUrl}single-cable-calculation/configuration/status/approve`,
        {
          calculationId,
          configurationId,
        }
      )
      .pipe(catchError(() => of(null)));
  }

  public checkChainflexAndPriceExistence(
    paylod: CheckForNewChainflexPricesRequestDto
  ): Observable<CheckForNewChainflexPricesResult | null> {
    return this.http
      .post<CheckForNewChainflexPricesResult>(
        `${this.dataServiceUrl}single-cable-calculation/checkChainflexAndPriceExistence`,
        paylod
      )
      .pipe(catchError(() => of(null)));
  }

  public updateChainflexPrices(
    payload: UpdateChainflexPricesRequestDto
  ): Observable<UpdateChainflexPricesResult | null> {
    return this.http
      .post<UpdateChainflexPricesResult>(
        `${this.dataServiceUrl}single-cable-calculation/updateChainflexPrices`,
        payload
      )
      .pipe(catchError(() => of(null)));
  }

  public removeChainflexData(
    payload: RemoveChainflexDataRequestDto
  ): Observable<RemoveChainflexDataResponseDto | null> {
    return this.http
      .post<RemoveChainflexDataResponseDto>(
        `${this.dataServiceUrl}single-cable-calculation/removeChainflexData`,
        payload
      )
      .pipe(catchError(() => of(null)));
  }
}
