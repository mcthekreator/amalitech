import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import { CustomerTypeEnum, RISK_FACTORS } from '../../models';
import type { CalculationPresentation, Calculation } from '../../models';
import { createTestUserFullName } from './icalc-user';

const calculation: Calculation = {
  id: 'exampleCalculationId',
  calculationNumber: 'exampleCalculationNumber',
  calculationFactor: 1,
  customer: 'exampleCustomer',
  quoteNumber: 'exampleQuoteNumber',
  mat017ItemRiskFactor: RISK_FACTORS.defaultMat017ItemRiskFactor,
  mat017ItemAndWorkStepRiskFactor: RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor,
  customerType: CustomerTypeEnum.serialCustomer,
  creationDate: new Date(),
  createdBy: createTestUserFullName(),
  modificationDate: new Date(),
  modifiedBy: createTestUserFullName(),
  productionPlanExcelDownloaded: false,
  calculationExcelDownloaded: false,
  singleCableCalculations: [],
};

/**
 * createCalculation creates a Calculation
 *
 * @param override pass any needed overrides for the requested Calculation
 * @returns Calculation
 */
export const createCalculation = (override?: NestedPartial<Calculation>): Calculation => {
  return mergePartially.deep(calculation, override);
};

const calculationPresentation: CalculationPresentation = {
  id: 'exampleCalculationId',
  calculationNumber: 'exampleCalculationNumber',
  calculationFactor: 1,
  customer: 'exampleCustomer',
  quoteNumber: 'exampleQuoteNumber',
  mat017ItemRiskFactor: RISK_FACTORS.defaultMat017ItemRiskFactor,
  mat017ItemAndWorkStepRiskFactor: RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor,
  customerType: CustomerTypeEnum.serialCustomer,
  creationDate: new Date(),
  createdBy: createTestUserFullName(),
  modificationDate: new Date(),
  modifiedBy: createTestUserFullName(),
  productionPlanExcelDownloaded: false,
  calculationExcelDownloaded: false,
  isLocked: false,
  singleCableCalculations: [],
};

/**
 * createCalculation creates a CalculationPresentation
 *
 * @param override pass any needed overrides for the requested CalculationPresentation
 * @returns CalculationPresentation
 */
export const createCalculationPresentation = (
  override?: NestedPartial<CalculationPresentation>
): CalculationPresentation => {
  return mergePartially.deep(calculationPresentation, override);
};

const partialCalculation: Partial<Calculation> = {
  calculationNumber: 'exampleCalculationNumber',
  calculationFactor: 1,
  mat017ItemRiskFactor: RISK_FACTORS.defaultMat017ItemRiskFactor,
  mat017ItemAndWorkStepRiskFactor: RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor,
  customerType: CustomerTypeEnum.serialCustomer,
  createdBy: createTestUserFullName(),
};

/**
 * createPartialCalculation creates a Partial Calculation
 *
 * default:
 * - creates a partial Calculation object which contains basic data for test objects
 * - including: calculationNumber, calculationFactor, customerType
 *
 * @param override pass any needed overrides for the requested Partial Calculation
 * @returns Partial Calculation
 */
export const createPartialCalculation = (override?: NestedPartial<Partial<Calculation>>): Partial<Calculation> => {
  return mergePartially.deep(partialCalculation, override);
};
