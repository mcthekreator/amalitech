import type {
  ProcessResult,
  Calculation,
  ProcessManyResult,
  CalculationConfigurationStatus,
  IcalcValidationResult,
  SingleCableCalculation,
  CustomerTypeEnum,
  DiscountsBasedOnRiskFactors,
} from '@igus/icalc-domain';
import {
  CalculationStatus,
  ConfigurationStatus,
  IcalcValidationError,
  PinAssignmentValidator,
  CalculationConfigurationValidator,
  WorkStepPricesValueObject,
  RISK_FACTORS,
} from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigurationService } from '@igus/icalc-configurations-application';
import { CalculationDataAccessService } from '@igus/icalc-calculations-infrastructure';

import { StatusService } from '../../single-cable-calculation';
import { CalculationConfigurationProcessor } from './calculation-configuration-processor';

@Injectable()
export class ProcessService {
  constructor(
    private readonly calculationDataAccessService: CalculationDataAccessService,
    private readonly configurationService: ConfigurationService,
    private readonly statusService: StatusService
  ) {}

  public async validatePinAssignment(calculationId: string, configurationId: string): Promise<IcalcValidationResult> {
    const calculationConfigurationStatus = await this.statusService.findCalculationConfigurationStatusByIds({
      calculationId,
      configurationId,
    });

    if (!calculationConfigurationStatus) {
      throw new NotFoundException('No calculation configuration status found');
    }

    if (calculationConfigurationStatus.status === ConfigurationStatus.notApproved) {
      const configuration = await this.configurationService.findConfigurationById({ id: configurationId });

      if (!configuration) {
        throw new NotFoundException('Configuration not found');
      }

      const pinAssignmentValidator = new PinAssignmentValidator();

      return pinAssignmentValidator.validate(configuration);
    } else if (calculationConfigurationStatus.status === ConfigurationStatus.approved) {
      return {
        isValid: true,
      };
    } else {
      throw new HttpException('Invalid calculation configuration status', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  public async processCalculationWithManyConfigurations(
    calculationId: string,
    singleCableCalculationIds: string[]
  ): Promise<ProcessManyResult> {
    const calculation = await this.calculationDataAccessService.queryCalculationById(calculationId);

    if (!calculation) {
      throw new NotFoundException('Calculation not found');
    }

    if (this.isCalculationInValid(calculation)) {
      throw new HttpException('Invalid calculation (no assigned configurations)', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const processingRequests = singleCableCalculationIds.map((sccId) =>
      this.processCalculationWithConfiguration(calculation, sccId)
    );
    const processResults = await Promise.all(processingRequests);

    const lumpSums = processResults.map((result) => result.lumpSum);
    const calculationTotalPrice = lumpSums.reduce((acc, currVal) => acc + currVal);
    const allResultsValid = this.areAllResultsValid(processResults);

    return { processResults, allResultsValid, calculationTotalPrice };
  }

  public async processCalculationWithConfiguration(calculation: Calculation, sccId: string): Promise<ProcessResult> {
    const singleCableCalculation = calculation.singleCableCalculations.find((item) => item.id === sccId);

    if (!singleCableCalculation) {
      throw new NotFoundException('SingleCableCalculation not found');
    }

    let calculationConfigurationStatus: CalculationConfigurationStatus;

    if (calculation.status !== CalculationStatus.locked) {
      calculationConfigurationStatus = await this.statusService.findCalculationConfigurationStatusByIds({
        calculationId: calculation.id,
        configurationId:
          singleCableCalculation.configuration.id || singleCableCalculation.snapshot?.configurationData.id,
      });

      if (!calculationConfigurationStatus) {
        throw new NotFoundException('No calculation configuration status found');
      }
    }

    const calculationFactor = singleCableCalculation.calculationFactor
      ? singleCableCalculation.calculationFactor
      : calculation.calculationFactor;

    const discounts = this.getDiscounts(calculation.mat017ItemRiskFactor, calculation.mat017ItemAndWorkStepRiskFactor);

    return this.processConfiguration(
      calculation.status === CalculationStatus.locked,
      singleCableCalculation,
      discounts,
      calculationFactor,
      calculation.customerType,
      calculationConfigurationStatus
    );
  }

  private getDiscounts(
    mat017ItemRiskFactor: number,
    mat017ItemAndWorkStepRiskFactor: number
  ): DiscountsBasedOnRiskFactors {
    return {
      chainflexDiscount: RISK_FACTORS.defaultChainflexRiskFactor,
      mat017ItemDiscount: mat017ItemRiskFactor * mat017ItemAndWorkStepRiskFactor,
      workStepDiscount: mat017ItemAndWorkStepRiskFactor,
    };
  }

  private processConfiguration(
    isLockedCalculation: boolean,
    singleCableCalculation: SingleCableCalculation,
    discounts: DiscountsBasedOnRiskFactors,
    calculationFactor: number,
    customerType: CustomerTypeEnum,
    calculationConfigurationStatus?: CalculationConfigurationStatus
  ): ProcessResult {
    const { configuration, snapshot, batchSize, chainflexLength, commercialWorkStepOverrides } = singleCableCalculation;

    const configurationData = configuration || snapshot.configurationData;
    const { workStepSet, chainFlexState } = configurationData.state;

    const { value: workStepPricesValue, error } = WorkStepPricesValueObject.create(
      workStepSet,
      chainFlexState,
      snapshot?.workStepPrices
    ).getValue();

    if (error) {
      return this.returnAsInvalid(singleCableCalculation, [IcalcValidationError.invalidWorkStepPrices]);
    }

    const calculationConfigurationProcessor = CalculationConfigurationProcessor.create(
      configurationData,
      batchSize,
      chainflexLength,
      commercialWorkStepOverrides,
      customerType,
      discounts,
      calculationFactor,
      workStepPricesValue,
      workStepSet
    );

    if (!calculationConfigurationProcessor.isProcessable()) {
      return this.returnAsInvalid(singleCableCalculation, [IcalcValidationError.incompleteData]);
    }

    /**
     * At this stage it is assumed that an invalid configuration would have been approved before locking
     * so the validation can be skipped and the configuration can be handeled as approved
     */
    if (isLockedCalculation || calculationConfigurationStatus.status === ConfigurationStatus.approved) {
      let processResult = calculationConfigurationProcessor.process();

      processResult = {
        ...processResult,
        configurationReference: {
          ...processResult.configurationReference,
          sccId: singleCableCalculation.id,
        },
      };

      return processResult;
    }

    const calculationConfigurationValidator = new CalculationConfigurationValidator();
    const validationResult = calculationConfigurationValidator.validate(configurationData);

    if (!validationResult.isValid) {
      return this.returnAsInvalid(singleCableCalculation, validationResult.validationErrors);
    }

    if (validationResult.isValid) {
      let processResult = calculationConfigurationProcessor.process();

      processResult = {
        ...processResult,
        configurationReference: {
          ...processResult.configurationReference,
          sccId: singleCableCalculation.id,
        },
      };
      return processResult;
    }
  }

  private returnAsInvalid(
    singleCableCalculation: SingleCableCalculation,
    validationErrors: IcalcValidationError[]
  ): ProcessResult {
    const { id, configuration, batchSize, chainflexLength } = singleCableCalculation;

    const configurationReference = {
      sccId: id,
      matNumber: configuration.matNumber,
      configurationId: configuration.id,
      isValid: false,
      validationErrors,
    };

    return {
      batchSize,
      chainflexLength,
      configurationReference,
    } as ProcessResult;
  }

  private areAllResultsValid(results: ProcessResult[]): boolean {
    let valid = true;

    results.forEach((result) => {
      if (!result.configurationReference?.isValid) {
        valid = false;
      }
    });
    return valid;
  }

  private isCalculationInValid(calculation: Calculation): boolean {
    return ArrayUtils.isEmpty(calculation.singleCableCalculations);
  }
}
