import type { FormlyFieldConfig } from '@ngx-formly/core';
import type { CustomerTypeEnum } from '../calculation';
import type { Observable } from 'rxjs';
import type { AbstractControl } from '@angular/forms';

export interface IcalcMetaData {
  calculationNumber: string;
  matNumber: string;
  labelingLeft: string;
  labelingRight: string;
  batchSize: number;
  calculationFactor: number;
  customerType: CustomerTypeEnum;
}
export interface IcalcMetaDataFilter extends IcalcMetaData {
  labeling: string;
}

export interface IcalcCalculationOperands {
  calculationFactorOperand?: '<' | '>' | '=';
  batchSizeOperand?: '<' | '>' | '=';
}

export interface IcalcCalculationNumberGeneratorInput {
  key: string;
  type: string;
  props: {
    attributes: { [key: string]: string };
    label: string;
    placeholder: string;
    translate: boolean;
    required: boolean;
    appearance: string;
    keyup(field: FormlyFieldConfig): void;
  };
  modelOptions: { [key: string]: string };
  asyncValidators: { [key: string]: { expression(control: AbstractControl): Observable<boolean> } };
}
