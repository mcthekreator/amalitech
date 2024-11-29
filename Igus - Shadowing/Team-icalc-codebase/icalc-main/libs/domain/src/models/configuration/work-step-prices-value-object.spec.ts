import { getWorkStepDefaultPrices } from '../result/calculation.prices';
import { WorkStepSet } from '../result/work-step.model';
import { WorkStepPricesValueObject } from './work-step-prices-value-object';
import { createIcalcTestChainflexStateWithValidChainflex } from '../../factories/objects/test/chainflex';
import type { ConfigurationChainFlexState } from '..';
import { mergePartially } from 'merge-partially';

describe('WorkStepPricesValueObject', () => {
  const defaultCfStateWithoutInnerShields = createIcalcTestChainflexStateWithValidChainflex();

  it('should have an error if required parameter is not passed', () => {
    const valueObject = WorkStepPricesValueObject.create(null, defaultCfStateWithoutInnerShields);
    const { value, error } = valueObject.getValue();

    expect(value).toEqual({});
    expect(error).not.toEqual(null);
    expect(error.message).toBeDefined();
    expect(error.message).toEqual('workStepSet is required.');
  });

  it('should use default WorkStepPrices if no provided', () => {
    const valueObject = WorkStepPricesValueObject.create(WorkStepSet.standard, defaultCfStateWithoutInnerShields);
    const { value, error } = valueObject.getValue();

    expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.standard, defaultCfStateWithoutInnerShields));
    expect(error).toEqual(null);
  });

  describe('Standard WorkStepSet', () => {
    it('should have an validation error if an invalid object is passed', () => {
      const testPrices = getWorkStepDefaultPrices(WorkStepSet.standard);
      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.machineLine,
        defaultCfStateWithoutInnerShields,
        testPrices
      );

      const { value, error } = valueObject.getValue();

      expect(value).toEqual({});
      expect(error).not.toEqual(null);
      expect(error.message).toBeDefined();
      expect(error.message).toEqual('workStepPrices are not valid.');
    });

    it('should have no errors if a valid object is passed', () => {
      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.standard,
        defaultCfStateWithoutInnerShields,
        getWorkStepDefaultPrices(WorkStepSet.standard)
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.standard));
      expect(error).toEqual(null);
    });
  });

  describe('DriveCliq WorkStepSet', () => {
    it('should have an validation error if an invalid object is passed', () => {
      const testPrices = getWorkStepDefaultPrices(WorkStepSet.machineLine);

      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.driveCliq,
        defaultCfStateWithoutInnerShields,
        testPrices
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual({});
      expect(error).not.toEqual(null);
      expect(error.message).toBeDefined();
      expect(error.message).toEqual('workStepPrices are not valid.');
    });

    it('should have no errors if a valid object is passed', () => {
      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.driveCliq,
        defaultCfStateWithoutInnerShields,
        getWorkStepDefaultPrices(WorkStepSet.driveCliq)
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.driveCliq));
      expect(error).toEqual(null);
    });
  });

  describe('MachineLine WorkStepSet', () => {
    it('should have an validation error if an invalid object is passed', () => {
      const testPrices = getWorkStepDefaultPrices(WorkStepSet.standard);

      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.machineLine,
        defaultCfStateWithoutInnerShields,
        testPrices
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual({});
      expect(error).not.toEqual(null);
      expect(error.message).toBeDefined();
      expect(error.message).toEqual('workStepPrices are not valid.');
    });

    it('should have no errors if a valid object is passed', () => {
      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.machineLine,
        defaultCfStateWithoutInnerShields,
        getWorkStepDefaultPrices(WorkStepSet.machineLine)
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.machineLine));
      expect(error).toEqual(null);
    });
  });

  describe('Ethernet WorkStepSet', () => {
    it('should have an validation error if an invalid object is passed', () => {
      const testPrices = getWorkStepDefaultPrices(WorkStepSet.machineLine);

      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.ethernet,
        defaultCfStateWithoutInnerShields,
        testPrices
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual({});
      expect(error).not.toEqual(null);
      expect(error.message).toBeDefined();
      expect(error.message).toEqual('workStepPrices are not valid.');
    });

    it('should have no errors if a valid object is passed', () => {
      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.ethernet,
        defaultCfStateWithoutInnerShields,
        getWorkStepDefaultPrices(WorkStepSet.ethernet)
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.ethernet));
      expect(error).toEqual(null);
    });

    it('should compute stripShieldHandling without inner shields', () => {
      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.ethernet,
        defaultCfStateWithoutInnerShields,
        getWorkStepDefaultPrices(WorkStepSet.ethernet, defaultCfStateWithoutInnerShields)
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.ethernet));
      expect(value['stripShieldHandling'].serialCustomer).toBe(2.16);
      expect(error).toEqual(null);
    });

    it('should compute stripShieldHandling with inner shields', () => {
      const cfStateWithInnerShields: ConfigurationChainFlexState = mergePartially.deep(
        createIcalcTestChainflexStateWithValidChainflex(),
        {
          chainflexCable: {
            cableStructureInformation: {
              structure: [
                {
                  description: 'SH1',
                  horizontalOrder: 3,
                  shieldedItemCount: 12,
                  type: 'shield',
                },
                {
                  description: 'SH0',
                  horizontalOrder: 3,
                  shieldedItemCount: 12,
                  type: 'shield',
                },
              ],
            },
          },
        }
      );

      const valueObject = WorkStepPricesValueObject.create(
        WorkStepSet.ethernet,
        cfStateWithInnerShields,
        getWorkStepDefaultPrices(WorkStepSet.ethernet, cfStateWithInnerShields)
      );
      const { value, error } = valueObject.getValue();

      expect(value).toEqual(getWorkStepDefaultPrices(WorkStepSet.ethernet, cfStateWithInnerShields));
      expect(value['stripShieldHandling'].serialCustomer).toBe(9.45);
      expect(error).toEqual(null);
    });
  });
});
