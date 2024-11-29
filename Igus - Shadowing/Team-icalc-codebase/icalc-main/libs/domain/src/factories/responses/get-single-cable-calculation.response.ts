import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { SingleCableCalculationPresentation } from '../../models';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createConfigurationState,
  createSingleCableCalculationPresentation,
} from '../objects';
import { icalcTestConfiguration, icalcTestCalculation } from '../../mocks';

const calculation = createCalculationPresentation({
  ...icalcTestCalculation,
  singleCableCalculations: [],
  isLocked: false,
});
const configurationId = 'exampleConfigurationId';
const configuration = createConfigurationPresentation({
  ...icalcTestConfiguration,
  id: configurationId,
  singleCableCalculations: [],
  state: createConfigurationState({
    chainFlexState: {},
  }),
});

const newSingleCableCalculation = createSingleCableCalculationPresentation({
  configurationId,
  calculationId: calculation.id,
  calculationNumber: calculation.calculationNumber,
  matNumber: icalcTestConfiguration.matNumber,
});

calculation.singleCableCalculations = [{ ...newSingleCableCalculation }];
configuration.singleCableCalculations = [{ ...newSingleCableCalculation }];

/**
 * createGetSingleCableCalculationResponse creates a GET single-cable-calculation response
 *
 * @param override pass any needed overrides for the requested response
 * @returns GET single-cable-calculation response
 */
export const createGetSingleCableCalculationResponse = (
  override?: NestedPartial<SingleCableCalculationPresentation>
): SingleCableCalculationPresentation => {
  const defaultSingleCableCalculationPresentationOverrides = {
    calculation,
    configuration,
    calculationId: calculation.id,
    configurationId,
    matNumber: icalcTestConfiguration.matNumber,
    calculationNumber: icalcTestCalculation.calculationNumber,
    snapshotId: '',
  };
  const mergedSingleCableCalculationPresentationOverrides = mergePartially.deep(
    defaultSingleCableCalculationPresentationOverrides,
    override
  );

  return createSingleCableCalculationPresentation(mergedSingleCableCalculationPresentationOverrides);
};
