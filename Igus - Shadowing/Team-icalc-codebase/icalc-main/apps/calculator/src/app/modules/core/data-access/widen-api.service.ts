import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEnvironment } from '../../../../environments/environment';
import { catchError, Observable, of, throwError } from 'rxjs';
import { WidenData, WidenDataItem, WidenUploadImage } from '@igus/icalc-domain';

@Injectable({
  providedIn: 'root',
})
export class WidenApiService {
  private readonly dataServiceUrl = getEnvironment().dataServiceUrl;
  constructor(private http: HttpClient) {}

  public uploadImage(widenUploadImage: WidenUploadImage): Observable<string | null> {
    const formData = new FormData();

    formData.append('file', widenUploadImage.file);
    formData.append('filename', widenUploadImage.filename);
    formData.append('description', widenUploadImage.description);
    formData.append('matNumber', widenUploadImage.matNumber);
    formData.append('titleTag', widenUploadImage.titleTag);

    return this.http.post(this.dataServiceUrl + 'mat017-item/image', formData, { responseType: 'text' }).pipe(
      catchError((error: unknown) => {
        console.error('error uploading images', error);
        return of(null);
      })
    );
  }

  public getImages(matNumbers: string[] | string): Observable<WidenDataItem | unknown> {
    const params = new HttpParams({
      fromObject: {
        matNumbers,
      },
    });

    return this.http
      .get<WidenData>(this.dataServiceUrl + 'mat017-item/images', {
        params,
      })
      .pipe(
        catchError((_: unknown) => {
          console.error('error requesting images');
          return null;
        })
      );
  }

  public getImage(url: string): Observable<WidenDataItem | unknown> {
    const params = new HttpParams({
      fromObject: {
        url,
      },
    });

    return this.http.get<WidenDataItem>(this.dataServiceUrl + 'mat017-item/image', { params }).pipe(
      // eslint-disable-next-line rxjs/no-implicit-any-catch, @typescript-eslint/no-explicit-any
      catchError((error: any) => {
        if (url) {
          console.error(`Upload progress incomplete for image with url: ${url}`);
        }
        return throwError(() => error);
      })
    );
  }
}
