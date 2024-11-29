import type { RemoveMat017ItemsResponseDto } from '@igus/icalc-domain';
import {
  WorkStepName,
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import type { ProcessStateModel } from './process-state.model';
import { ProcessStateMutations } from './process-state.mutations';
import { createMockProcessState } from '../../utils';

describe('ProcessStateMutation', () => {
  describe('addInformAboutWorkSteps', () => {
    const scc1 = createSingleCableCalculationPresentation({
      id: 'uuid1',
      matNumber: 'mat1',
      chainflexLength: 1,
      batchSize: 2,
      configurationId: 'exConfigId1',
    });

    const scc2 = createSingleCableCalculationPresentation({
      id: 'uuid2',
      matNumber: 'mat1',
      chainflexLength: 3,
      batchSize: 4,
      configurationId: 'exConfigId2',
    });

    const calculation = createCalculationPresentation({ singleCableCalculations: [scc1, scc2] });
    const configuration = createConfigurationPresentation({ singleCableCalculations: [scc1, scc2] });

    const testScc1 = {
      ...scc1,
      configuration,
      calculation,
    };
    const testScc2 = {
      ...scc2,
      configuration,
      calculation,
    };
    const mockState = createMockProcessState(
      {
        selectedSingleCableCalculationId: scc1.id,
        informUserAboutWorkSteps: [],
      },
      [testScc1, testScc2]
    ) as ProcessStateModel;

    const removedMat017ItemsResponseWithoutOverrides: RemoveMat017ItemsResponseDto = [
      {
        configurationId: 'exConfigId1',
        matNumber: 'Mat017mock1',
        hasRemovedOverrides: false,
        removedOverrides: [],
        connectorState: null,
        workStepOverrides: null,
      },
      {
        configurationId: 'exConfigId2',
        matNumber: 'Mat017mock2',
        hasRemovedOverrides: false,
        removedOverrides: [],
        connectorState: null,
        workStepOverrides: null,
      },
    ];

    const removedMat017ItemsResponseWithOverrides = [
      {
        ...removedMat017ItemsResponseWithoutOverrides[0],
        hasRemovedOverrides: true,
        removedOverrides: [WorkStepName.consignment],
      },
    ];

    it('should return an empty informUserAboutWorkSteps if no configuration has removedOverrides', () => {
      const result = ProcessStateMutations.addInformAboutWorkSteps(
        mockState,
        removedMat017ItemsResponseWithoutOverrides
      );

      expect(result).toEqual([]);
    });

    it('should return informUserAboutWorkSteps with workSteps overrides from configuration that has removedOverrides', () => {
      const result = ProcessStateMutations.addInformAboutWorkSteps(mockState, removedMat017ItemsResponseWithOverrides);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            chainflexLength: scc1.chainflexLength,
            batchSize: scc1.batchSize,
            workStepTypes: [WorkStepName.consignment],
            configurationId: scc1.configurationId,
            matNumber: scc1.matNumber,
          }),
        ])
      );
    });

    it('should return already existing workSteps overrides in informUserAboutWorkSteps with or without overrides from configuration with removed mat017Items', () => {
      const stateWithExistingWorkStepsOverrides = createMockProcessState(
        {
          ...mockState,
          informUserAboutWorkSteps: [
            {
              configurationId: 'someConfigId',
              matNumber: 'someMatNumber',
              chainflexLength: 100,
              batchSize: 200,
              workStepTypes: [WorkStepName.strip, WorkStepName.assembly],
            },
          ],
        },
        [testScc1, testScc2]
      ) as ProcessStateModel;

      const noWorkStepOverridesResult = ProcessStateMutations.addInformAboutWorkSteps(
        stateWithExistingWorkStepsOverrides,
        removedMat017ItemsResponseWithoutOverrides
      );

      const withWorkStepOverridesResult = ProcessStateMutations.addInformAboutWorkSteps(
        stateWithExistingWorkStepsOverrides,
        removedMat017ItemsResponseWithOverrides
      );

      expect(noWorkStepOverridesResult).toHaveLength(1);
      expect(noWorkStepOverridesResult[0].workStepTypes).toContain(WorkStepName.assembly);
      expect(noWorkStepOverridesResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining(stateWithExistingWorkStepsOverrides.informUserAboutWorkSteps[0]),
        ])
      );

      expect(withWorkStepOverridesResult).toHaveLength(2);
      expect(noWorkStepOverridesResult[0].workStepTypes).not.toContain(WorkStepName.consignment);

      expect(withWorkStepOverridesResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining(stateWithExistingWorkStepsOverrides.informUserAboutWorkSteps[0]),
          expect.objectContaining({
            chainflexLength: scc1.chainflexLength,
            batchSize: scc1.batchSize,
            workStepTypes: [WorkStepName.consignment],
            configurationId: scc1.configurationId,
            matNumber: scc1.matNumber,
          }),
        ])
      );
    });
  });
});
