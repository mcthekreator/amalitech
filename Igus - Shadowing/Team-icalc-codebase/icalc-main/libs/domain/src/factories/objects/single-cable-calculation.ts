import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { SingleCableCalculation, SingleCableCalculationPresentation } from '../../models';
import { createCalculation } from './calculation';
import { createIcalcUser } from './icalc-user';
import { createConfiguration } from './configuration';

const singleCableCalculation = {
  id: 'exampleSingleCableCalculationId',
  calculation: createCalculation(),
  assignmentDate: new Date(),
  assignedBy: createIcalcUser(),
  batchSize: 1,
  chainflexLength: 1,
  commercialWorkStepOverrides: {},
};

/**
 * createSingleCableCalculation creates a SingleCableCalculation
 *
 * @param override pass any needed overrides for the requested SingleCableCalculation
 * @returns SingleCableCalculation
 */
export const createSingleCableCalculation = (
  override?: NestedPartial<SingleCableCalculation>
): SingleCableCalculation => {
  return mergePartially.deep(singleCableCalculation, override);
};

const calculation = createCalculation();
const configuration = createConfiguration();

const singleCableCalculationPresentation = {
  id: 'exampleSingleCableCalculationId',
  assignmentDate: new Date(),
  assignedBy: createIcalcUser(),
  batchSize: 1,
  chainflexLength: 1,
  commercialWorkStepOverrides: {},
  calculationId: calculation.id,
  configurationId: configuration.id,
};

/**
 * createSingleCableCalculationPresentation creates a SingleCableCalculationPresentation
 *
 * @param override pass any needed overrides for the requested SingleCableCalculationPresentation
 * @returns SingleCableCalculationPresentation
 */
export const createSingleCableCalculationPresentation = (
  override?: NestedPartial<SingleCableCalculationPresentation>
): SingleCableCalculationPresentation => {
  return mergePartially.deep(singleCableCalculationPresentation, override);
};

const partialSingleCableCalculation = {
  batchSize: 1,
  chainflexLength: 1,
};

/**
 * createPartialSingleCableCalculation creates a Partial SingleCableCalculation
 *
 * default:
 * - creates a partial SingleCableCalculation object which contains basic data for test objects
 * - including: batchSize, chainflexLength
 *
 * @param override pass any needed overrides for the requested Partial SingleCableCalculation
 * @returns Partial SingleCableCalculation
 */
export const createPartialSingleCableCalculation = (
  override?: NestedPartial<Partial<SingleCableCalculation>>
): Partial<SingleCableCalculation> => {
  return mergePartially.deep(partialSingleCableCalculation, override);
};
