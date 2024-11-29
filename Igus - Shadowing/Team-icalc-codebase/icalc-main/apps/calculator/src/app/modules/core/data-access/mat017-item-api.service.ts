import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEnvironment } from '../../../../environments/environment';
import type {
  CreateMat017ItemManuallyRequestDto,
  CreateMat017ItemManuallyResponseDto,
  Mat017Item,
  Mat017ItemsLatestModificationDate,
} from '@igus/icalc-domain';
import { catchError, of, type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Mat017ItemApiService {
  private readonly dataServiceUrl = getEnvironment().dataServiceUrl;
  constructor(private http: HttpClient) {}

  public delete(matNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.dataServiceUrl}mat017-item/${matNumber}`).pipe(catchError(() => of(null)));
  }

  public getLatestModificationDate(): Observable<Mat017ItemsLatestModificationDate> {
    return this.http
      .get<Mat017ItemsLatestModificationDate>(`${this.dataServiceUrl}mat017-item/latestModificationDate`)
      .pipe(catchError(() => of(null)));
  }

  public findByMatNumber(matNumber: string): Observable<Mat017Item> {
    return this.http
      .get<Mat017Item>(`${this.dataServiceUrl}mat017-item/findByMatNumber`, {
        params: new HttpParams().append('matNumber', `${matNumber}`),
      })
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  public createMat017Item(
    payload: CreateMat017ItemManuallyRequestDto[]
  ): Observable<CreateMat017ItemManuallyResponseDto[] | unknown> {
    return this.http
      .post<CreateMat017ItemManuallyResponseDto>(`${this.dataServiceUrl}mat017-item`, { mat017Items: payload })
      .pipe(catchError((err: unknown) => of(err)));
  }
}
