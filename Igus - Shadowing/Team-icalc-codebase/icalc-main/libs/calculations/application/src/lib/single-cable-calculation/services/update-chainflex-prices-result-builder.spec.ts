import type { SingleCableCalculation } from '@igus/icalc-domain';
import { createConfiguration, createSingleCableCalculation } from '@igus/icalc-domain';
import { UpdateChainflexPricesResultBuilder } from './update-chainflex-prices-result-builder';
import type { ChainflexPriceDeviationResult } from './chainflex-price-change-check.service';

describe('UpdateChainflexPricesResultBuilder', () => {
  let builder: UpdateChainflexPricesResultBuilder;
  let sccOne: SingleCableCalculation;
  let deviationOne: ChainflexPriceDeviationResult;
  let sccTwo: SingleCableCalculation;
  let deviationTwo: ChainflexPriceDeviationResult;

  beforeEach(() => {
    builder = new UpdateChainflexPricesResultBuilder();
    sccOne = createSingleCableCalculation({
      id: 'sccId1',
      configurationId: 'testConfigId',
      configuration: createConfiguration({
        id: 'testConfigId',
        partNumber: 'testPartNumber',
      }),
    });

    deviationOne = {
      chainflexPriceDeviationDetected: true,
      priceAvailable: true,
      currentPriceObject: {
        id: 'testPriceId',
        partNumber: 'testPartNumber',
        germanListPrice: 100,
      },
    };

    sccTwo = createSingleCableCalculation({
      id: 'sccId2',
      configurationId: 'anotherTestConfigId',
      configuration: createConfiguration({
        id: 'anotherTestConfigId',
        partNumber: 'testPartNumber',
      }),
    });

    deviationTwo = {
      chainflexPriceDeviationDetected: true,
      priceAvailable: true,
      currentPriceObject: {
        id: 'testPriceId',
        partNumber: 'testPartNumber',
        germanListPrice: 200,
      },
    };
  });

  describe('addNewPriceUpdateReference', () => {
    it('should add a new price update references', () => {
      builder.addNewPriceUpdateReference(sccOne, deviationOne);
      builder.addNewPriceUpdateReference(sccTwo, deviationTwo);

      const result = builder.getResult();

      expect(result.singleCableCalculationPriceUpdateReferences.length).toBe(2);
    });
  });

  describe('hasHandledGivenConfigurationId', () => {
    it('should be able to tell if a configuration has been handled via a previous scc', () => {
      const anotherScc = createSingleCableCalculation({
        id: 'sccId3',
        configurationId: 'testConfigId',
        configuration: createConfiguration({
          id: 'testConfigId',
          partNumber: 'testPartNumber',
        }),
      });

      builder.addNewPriceUpdateReference(sccOne, deviationOne);
      const result = builder.hasHandledGivenConfigurationId(anotherScc.configurationId);

      expect(result).toBe(true);
    });
  });

  describe('addPriceUpdateReferenceFromExistingReference', () => {
    it('should add a new price update reference for scc with the same configuration as one of the previous sccs', () => {
      const anotherScc = createSingleCableCalculation({
        id: 'sccId3',
        configurationId: 'anotherTestConfigId',
        configuration: createConfiguration({
          id: 'anotherTestConfigId',
          partNumber: 'testPartNumber',
        }),
      });

      builder.addNewPriceUpdateReference(sccOne, deviationOne);
      builder.addNewPriceUpdateReference(sccTwo, deviationTwo);
      builder.addPriceUpdateReferenceFromExistingReference(anotherScc);

      const result = builder.getResult();

      expect(result.singleCableCalculationPriceUpdateReferences.length).toBe(3);

      const newPriceForSecondScc = result.singleCableCalculationPriceUpdateReferences[1].newPriceObject.germanListPrice;
      const newPriceSccWithSameConfigurationAsSecondScc =
        result.singleCableCalculationPriceUpdateReferences[2].newPriceObject.germanListPrice;

      expect(newPriceSccWithSameConfigurationAsSecondScc).toEqual(newPriceForSecondScc);
    });
  });
});
