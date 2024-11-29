import { createSingleCableCalculation, type SaveSingleCableCalculationResult } from '@igus/icalc-domain';
import { RemoveChainflexDataResultBuilder } from './remove-chainflex-data-result-builder';

describe('RemoveChainflexDataResultBuilder', () => {
  let builder: RemoveChainflexDataResultBuilder;
  let saveSccResultOne: SaveSingleCableCalculationResult;
  let saveSccResultTwo: SaveSingleCableCalculationResult;

  beforeEach(() => {
    builder = new RemoveChainflexDataResultBuilder();
    saveSccResultOne = {
      singleCableCalculation: createSingleCableCalculation({
        id: 'sccId1',
        configurationId: 'testConfigId',
      }),
      calculationConfigurationStatus: {
        hasApprovalBeenRevoked: true,
      },
    };

    saveSccResultTwo = {
      singleCableCalculation: createSingleCableCalculation({
        id: 'sccId2',
        configurationId: 'anotherTestConfigId',
      }),
      calculationConfigurationStatus: {
        hasApprovalBeenRevoked: false,
      },
    };
  });

  describe('addNewPriceUpdateReference', () => {
    it('should add a new save single cable calculation results', () => {
      builder.addSaveSingleCableCalculationResult(saveSccResultOne);
      builder.addSaveSingleCableCalculationResult(saveSccResultTwo);

      const result = builder.getResult();

      expect(result.savedSingleCableCalculations.length).toBe(2);
    });
  });

  describe('hasHandledGivenConfigurationId', () => {
    it('should be able to tell if a configuration has been handled via a previous scc', () => {
      const anotherScc = createSingleCableCalculation({
        id: 'sccId3',
        configurationId: 'testConfigId',
      });

      builder.addSaveSingleCableCalculationResult(saveSccResultOne);
      const result = builder.hasHandledGivenConfigurationId(anotherScc.configurationId);

      expect(result).toBe(true);
    });
  });

  describe('addSaveSingleCableCalculationResultFromExistingResult', () => {
    it('should add a new save single cable calculation result for scc with the same configuration as one of the previous sccs', () => {
      const anotherScc = createSingleCableCalculation({
        id: 'sccId3',
        configurationId: 'anotherTestConfigId',
      });

      builder.addSaveSingleCableCalculationResult(saveSccResultOne);
      builder.addSaveSingleCableCalculationResult(saveSccResultTwo);
      builder.addSaveSingleCableCalculationResultFromExistingResult(anotherScc);

      const result = builder.getResult();

      expect(result.savedSingleCableCalculations.length).toBe(3);

      const sccIdOfThirdResult = result.savedSingleCableCalculations[2].singleCableCalculation.id;

      expect(sccIdOfThirdResult).toEqual(anotherScc.id);

      const approvalStatusForSecondResult =
        result.savedSingleCableCalculations[1].calculationConfigurationStatus.hasApprovalBeenRevoked;
      const approvalStatusForThirdResult =
        result.savedSingleCableCalculations[2].calculationConfigurationStatus.hasApprovalBeenRevoked;

      expect(approvalStatusForThirdResult).toEqual(approvalStatusForSecondResult);
    });
  });
});
