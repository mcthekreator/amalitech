import type { RedactedMat017ItemWithWidenData } from '../mat017-item';
import type { Configuration } from '../configuration';
import type { ActionSelectionContainer } from '../../models';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export enum IcalcValidationError {
  incompleteData = 'INCOMPLETE_DATA',
  invalidWorkStepPrices = 'INVALID_WORK_STEP_PRICES',
  // pinAssignmentFaultyAkeneoData = 'PIN_ASSIGNMENT__FAULTY_AKENEO_DATA',
  pinAssignmentLeftRCK6ItemContactMismatch = 'PIN_ASSIGNMENT__LEFT_RCK6_ITEM_CONTACT_MISMATCH',
  pinAssignmentRightRCK6ItemContactMismatch = 'PIN_ASSIGNMENT__RIGHT_RCK6_ITEM_CONTACT_MISMATCH',
  pinAssignmentLeftAndRightRCK6ItemContactMismatch = 'PIN_ASSIGNMENT__LEFT_AND_RIGHT_RCK6_ITEM_CONTACT_MISMATCH',
}

export interface IcalcValidator {
  validate(configuration: Configuration): IcalcValidationResult;
}

export interface IcalcValidationResult {
  isValid: boolean;
  validationErrors?: IcalcValidationError[];
}

export interface PinAssignmentValidationResult extends IcalcValidationResult {
  leftItemCount?: number;
  leftContactCount?: number;
  leftIsValid?: boolean;
  rightItemCount?: number;
  rightContactCount?: number;
  rightIsValid?: boolean;
}

export class PinAssignmentValidator implements IcalcValidator {
  public validate(configuration: Configuration): PinAssignmentValidationResult {
    const leftItemCount = this.getRCK6ItemCount(
      configuration.state?.connectorState?.leftConnector?.mat017ItemListWithWidenData
    );
    const rightItemCount = this.getRCK6ItemCount(
      configuration.state?.connectorState?.rightConnector?.mat017ItemListWithWidenData
    );

    if (!configuration.state?.pinAssignmentState?.actionModels) {
      return {
        isValid: false,
        validationErrors: [IcalcValidationError.incompleteData],
      };
    }

    const actionModelsArray = Object.entries(configuration.state?.pinAssignmentState?.actionModels);
    const actionsArray: ActionSelectionContainer[] = [];

    actionModelsArray.forEach((arrayEntry) => {
      actionsArray.push(arrayEntry[1]); // adds the actions objects to the actions array
    });

    let leftContactCount = 0;
    const leftUniqueContacts: string[] = [];
    let rightContactCount = 0;
    const rightUniqueContacts: string[] = [];

    actionsArray.forEach((actionsObject) => {
      const leftActionSelect = actionsObject.left?.actionSelect;
      const leftPinDescription = actionsObject.left?.pinDescriptionInput;

      if (
        leftPinDescription !== undefined &&
        leftActionSelect === 'setOnContact' &&
        !leftUniqueContacts.includes(leftPinDescription) &&
        leftPinDescription !== ''
      ) {
        leftContactCount++;
        leftUniqueContacts.push(leftPinDescription);
      }

      const rightActionSelect = actionsObject.right?.actionSelect;
      const rightPinDescription = actionsObject.right?.pinDescriptionInput;

      if (
        rightPinDescription !== undefined &&
        rightActionSelect === 'setOnContact' &&
        !rightUniqueContacts.includes(rightPinDescription) &&
        rightPinDescription !== ''
      ) {
        rightContactCount++;
        rightUniqueContacts.push(rightPinDescription);
      }
    });

    let validationResult = true;
    let leftValidationResult = true;
    let rightValidationResult = true;
    let validationErrors: IcalcValidationError[] = [];

    if (leftItemCount !== leftContactCount) {
      validationResult = false;
      leftValidationResult = false;
      validationErrors.push(IcalcValidationError.pinAssignmentLeftRCK6ItemContactMismatch);
    }
    if (rightItemCount !== rightContactCount) {
      validationResult = false;
      rightValidationResult = false;
      validationErrors.push(IcalcValidationError.pinAssignmentRightRCK6ItemContactMismatch);
    }
    if (leftItemCount !== leftContactCount && rightItemCount !== rightContactCount) {
      validationErrors = [IcalcValidationError.pinAssignmentLeftAndRightRCK6ItemContactMismatch];
    }

    if (validationResult) {
      return {
        isValid: validationResult,
      };
    }

    return {
      isValid: validationResult,
      leftItemCount,
      leftContactCount,
      leftIsValid: leftValidationResult,
      rightItemCount,
      rightContactCount,
      rightIsValid: rightValidationResult,
      validationErrors,
    };
  }

  private getRCK6ItemCount(mat017ItemListWithWidenData: RedactedMat017ItemWithWidenData[] = []): number {
    let itemCount = 0;

    mat017ItemListWithWidenData
      .filter((item) => item.overrides.mat017ItemGroup === 'RC-K6')
      .forEach((item) => {
        itemCount = itemCount + item.quantity;
      });

    return itemCount;
  }
}

const icalcValidators: IcalcValidator[] = [new PinAssignmentValidator()];

/**
 * CalculationConfigurationValidator combines all icalc-relevant validators for configuration items
 *
 */
export class CalculationConfigurationValidator implements IcalcValidator {
  public validationResults: IcalcValidationResult[] = [];

  /**
   * Validates the provided configuration using all icalc-relevant validators.
   *
   * @param configuration - The configuration item that needs to be validated.
   * @returns An object containing the validation results.
   */
  public validate(configuration: Configuration): IcalcValidationResult {
    icalcValidators.forEach((validator) => {
      this.validationResults.push(validator.validate(configuration));
    });

    let isValid = true;
    const validationErrors: IcalcValidationError[] = [];

    this.validationResults.forEach((result) => {
      if (!result.isValid) {
        isValid = false;
        if (result.validationErrors) {
          result.validationErrors.forEach((error) => {
            validationErrors.push(error);
          });
        }
      }
    });

    return {
      isValid,
      validationErrors,
    };
  }
}

export enum Mat017ItemImportBaseDataValidationFailureReason {
  itemDescription1 = 'itemDescription1',
  mat017ItemGroup = 'mat017ItemGroup',
}

export enum Mat017ItemImportPriceValidationFailureReason {
  priceUnit = 'priceUnit',
  amount = 'amount',
}

export enum Mat017ItemUsageValidationFailureReason {
  matNumber = 'matNumber',
  chainflexPartNumber = 'chainflexPartNumber',
  bomId = 'bomId',
}

@ValidatorConstraint({ name: 'ShouldNotContainWhitespace', async: false })
export class ShouldNotContainWhitespaceValidator implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return !/\s/.test(value);
  }

  public defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments?.value} should not contain whitespace characters`;
  }
}
