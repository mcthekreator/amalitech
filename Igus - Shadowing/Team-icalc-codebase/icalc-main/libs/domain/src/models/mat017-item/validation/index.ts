import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Mat017ItemMatNumber } from '../mat017-item.model';

@ValidatorConstraint({ name: 'Mat017ItemNumberValidator', async: false })
export class Mat017ItemNumberValidator implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    return typeof value === 'string' && Mat017ItemMatNumber.create(value).isValid();
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value} must start with MAT017`;
  }
}
