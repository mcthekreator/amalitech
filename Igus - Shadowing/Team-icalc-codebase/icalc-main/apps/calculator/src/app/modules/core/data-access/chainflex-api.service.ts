import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { getEnvironment } from '../../../../environments/environment';
import type { ChainflexCable, IcalcListInformation, IcalcListResult } from '@igus/icalc-domain';

@Injectable({
  providedIn: 'root',
})
export class ChainflexApiService {
  constructor(private http: HttpClient) {}

  public search(listInformation: Partial<IcalcListInformation>): Observable<IcalcListResult<ChainflexCable>> {
    return this.http.get<IcalcListResult<ChainflexCable>>(getEnvironment().dataServiceUrl + 'chainflex', {
      params: { ...listInformation },
    });
  }
}
