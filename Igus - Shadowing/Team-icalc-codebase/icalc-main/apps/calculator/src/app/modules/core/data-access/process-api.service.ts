import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map, catchError, of } from 'rxjs';
import { getEnvironment } from '../../../../environments/environment';
import type {
  CreateExcelCalculationFileRequestDto,
  CreateExcelProductionPlanFileRequestDto,
  PinAssignmentValidationResult,
  ProcessCalculationRequestDto,
  ProcessManyResult,
} from '@igus/icalc-domain';

@Injectable({
  providedIn: 'root',
})
export class ProcessApiService {
  private readonly dataServiceUrl = getEnvironment().dataServiceUrl;
  constructor(private http: HttpClient) {}

  public validatePinAssignment(
    calculationId: string,
    configurationId: string
  ): Observable<PinAssignmentValidationResult | null> {
    return this.http
      .post<PinAssignmentValidationResult>(
        `${this.dataServiceUrl}process/validatePinAssignment/${calculationId}/${configurationId}`,
        {}
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  public createExcelProductionPlanFile(data: CreateExcelProductionPlanFileRequestDto): Observable<Blob | null> {
    return this.http
      .post(`${this.dataServiceUrl}process/createExcelProductionPlanFile`, data, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        catchError(() => of(null)),
        map((response) => response.body)
      );
  }

  public createExcelCalculation(data: CreateExcelCalculationFileRequestDto): Observable<Blob | null> {
    return this.http
      .post(`${this.dataServiceUrl}process/createExcelCalculationFile`, data, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        catchError(() => of(null)),
        map((response) => response.body)
      );
  }

  public process(payload: ProcessCalculationRequestDto): Observable<ProcessManyResult> {
    return this.http.post<ProcessManyResult>(`${this.dataServiceUrl}process`, payload).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }
}
