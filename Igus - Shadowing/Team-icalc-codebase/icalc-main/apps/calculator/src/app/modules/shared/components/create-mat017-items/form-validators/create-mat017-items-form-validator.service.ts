import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Mat017ItemMatNumber, PriceUnitCharCode, StringUtils, Mat017ItemCreationData } from '@igus/icalc-domain';
import { map, Observable, of, take } from 'rxjs';

export interface AsyncValidatorExpression {
  expression(control: AbstractControl): Observable<boolean>;
}
export interface ValidatorExpression {
  message?: string;
  expression(control: AbstractControl): boolean;
}

// TO-DO: add unit tests
export const createHasNoDuplicateValuesExpression = (key: keyof Mat017ItemCreationData) => {
  return (control: AbstractControl): Observable<boolean> => {
    if (!control.value) {
      return of(true);
    }

    // grab latest value of the whole form to access all rows
    return control.root.valueChanges.pipe(
      take(1), // completes the observable, otherwise async validator might leave the form in PENDING status
      map((values) => {
        const allValues = values.rows.map((item) => item[key]).filter(Boolean);
        const hasDuplicates = allValues.filter((value) => value === control.value).length > 1;

        return !hasDuplicates;
      })
    );
  };
};

export const checkIfHasNoDuplicatesOfMatNumber = createHasNoDuplicateValuesExpression('matNumber');
export const checkIfHasNoDuplicatesOfSupplierItemNumber = createHasNoDuplicateValuesExpression('supplierItemNumber');

@Injectable({ providedIn: 'root' })
export class CreateMat017ItemsFormValidatorService {
  // TO-DO: add unit tests
  public checkIfFormHasSomeValues(): ValidatorExpression {
    return {
      expression: (control: AbstractControl<Mat017ItemCreationData[]>): boolean => {
        return control.value.some((item) => Object.values(item).map(StringUtils.coerceToNullIfEmpty).some(Boolean));
      },
    };
  }

  public checkDuplicatesOfMatNumberInForm(): AsyncValidatorExpression {
    return {
      expression: checkIfHasNoDuplicatesOfMatNumber,
    };
  }

  public checkDuplicatesOfSupplierItemNumberInForm(): AsyncValidatorExpression {
    return {
      expression: checkIfHasNoDuplicatesOfSupplierItemNumber,
    };
  }

  public checkValidPriceUnit(): ValidatorExpression {
    return {
      expression: (control: AbstractControl): boolean => {
        const value = control?.value;
        const priceUnitArr: PriceUnitCharCode[] = ['H', 'M', 'S', 'T'];

        if (value && value.trim() !== '') {
          return priceUnitArr.includes(value.trim());
        }

        return true;
      },
    };
  }

  public checkValidMat017ItemMatNumber(): ValidatorExpression {
    return {
      expression: (control: AbstractControl): boolean => {
        const rawValue = control?.value;

        if (rawValue) {
          return Mat017ItemMatNumber.create(rawValue).isValid();
        }
        return true;
      },
    };
  }
}
