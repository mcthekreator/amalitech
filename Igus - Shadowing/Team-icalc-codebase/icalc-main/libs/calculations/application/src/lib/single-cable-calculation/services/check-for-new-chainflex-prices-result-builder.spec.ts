import type { SingleCableCalculation } from '@igus/icalc-domain';
import { createConfiguration, createSingleCableCalculation } from '@igus/icalc-domain';
import { CheckForNewChainflexPricesResultBuilder } from './check-for-new-chainflex-prices-result-builder';
import type { ChainflexPriceDeviationResult } from './chainflex-price-change-check.service';

describe('CheckForNewChainflexPricesResultBuilder', () => {
  let builder: CheckForNewChainflexPricesResultBuilder;
  let sccOne: SingleCableCalculation;
  let deviationOne: ChainflexPriceDeviationResult;
  let sccTwo: SingleCableCalculation;
  let deviationTwo: ChainflexPriceDeviationResult;

  beforeEach(() => {
    builder = new CheckForNewChainflexPricesResultBuilder();
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
      chainflexPriceDeviationDetected: false,
      priceAvailable: true,
    };
  });

  describe('addNewPriceUpdateReference', () => {
    it('should add a new price update references', () => {
      builder.addNewPriceUpdateReference(sccOne, deviationOne);
      builder.addNewPriceUpdateReference(sccTwo, deviationTwo);

      const result = builder.getResult();

      expect(result.singleCableCalculationPriceUpdateReferences.length).toBe(2);
    });

    it('should mark prices as changed if a new price object is present in at least one added item', () => {
      builder.addNewPriceUpdateReference(sccOne, deviationOne);
      builder.addNewPriceUpdateReference(sccTwo, deviationTwo);

      const result = builder.getResult();

      expect(result.chainflexPricesHaveChanged).toBe(true);
      expect(result.chainflexesAndPricesAvailable).toBe(true);
    });

    it('should set chainflexesAndPricesAvailable to false when chainflex or price is unavailable in at least one added item', () => {
      const anotherScc = createSingleCableCalculation({
        id: 'sccId3',
        configurationId: 'anotherTestConfigId',
        configuration: createConfiguration({
          id: 'anotherTestConfigId',
          partNumber: 'testPartNumber',
        }),
      });

      const anotherDeviation: ChainflexPriceDeviationResult = {
        chainflexPriceDeviationDetected: true,
        priceAvailable: false,
      };

      builder.addNewPriceUpdateReference(sccOne, deviationOne);
      builder.addNewPriceUpdateReference(sccTwo, deviationTwo);
      builder.addNewPriceUpdateReference(anotherScc, anotherDeviation);

      const result = builder.getResult();

      expect(result.chainflexesAndPricesAvailable).toBe(false);
    });
  });
});
