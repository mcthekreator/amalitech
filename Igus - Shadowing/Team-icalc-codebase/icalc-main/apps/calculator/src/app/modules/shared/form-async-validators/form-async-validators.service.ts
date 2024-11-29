import { Injectable } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';
import { ConfigurationApiService } from '../../core/data-access/configuration-api.service';
import { CalculationApiService } from '../../core/data-access/calculation-api.service';
import { Mat017ItemApiService } from '../../core/data-access/mat017-item-api.service';
export interface AsyncValidatorExpression {
  expression(control: AbstractControl): Observable<boolean>;
}
export interface ValidatorExpression {
  message?: string;
  expression(control: AbstractControl): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FormAsyncValidatorsService {
  constructor(
    private readonly configurationApiService: ConfigurationApiService,
    private readonly calculationApiService: CalculationApiService,
    private mat017ItemApiService: Mat017ItemApiService
  ) {}

  public checkUniqueMatNumber(): AsyncValidatorExpression {
    return {
      expression: (control: AbstractControl): Observable<boolean> => {
        if (!control || control.pristine) {
          return of(true);
        }

        return this.configurationApiService.findByNumber(control.value).pipe(map((value) => !value));
      },
    };
  }

  public checkUniqueCalculationNumber(): AsyncValidatorExpression {
    return {
      expression: (control: AbstractControl): Observable<boolean> => {
        if (!control || control.pristine) {
          return of(true);
        }

        return this.calculationApiService.findByNumber(control.value).pipe(map((value) => !value));
      },
    };
  }

  public checkUniqueMat017ItemMatNumber(): AsyncValidatorExpression {
    return {
      expression: (control: AbstractControl): Observable<boolean> => {
        if (!control || !control.value) {
          return of(true);
        }

        return this.mat017ItemApiService.findByMatNumber(control.value).pipe(map((value) => !value));
      },
    };
  }
}
