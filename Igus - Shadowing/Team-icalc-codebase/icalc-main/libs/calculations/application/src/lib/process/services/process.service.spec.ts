import type {
  Calculation,
  CalculationConfigurationStatus,
  Configuration,
  SingleCableCalculation,
} from '@igus/icalc-domain';
import { mockProcessService } from './test-utils';
import { HttpException, NotFoundException } from '@nestjs/common';
import {
  defaultSingleCableCalculation,
  defaultTestCalculation,
  defaultTestCalculationConfigurationStatus,
  defaultTestConfiguration,
} from '@igus/icalc-domain';

const testConfiguration: Configuration = defaultTestConfiguration;
let testCalculation: Calculation = defaultTestCalculation;
const testCalculationConfigurationStatus: CalculationConfigurationStatus = defaultTestCalculationConfigurationStatus;
let testSingleCableCalculation: SingleCableCalculation = defaultSingleCableCalculation;

describe('ProcessService', () => {
  // VALIDATE PIN ASSIGNMENT
  it('validatePinAssignment should throw a http exception if no matching calculation configuration status is found', async () => {
    const processService = mockProcessService(testCalculation, null, null);

    try {
      await processService.validatePinAssignment(testCalculation.id, testConfiguration.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.message).toBe('No calculation configuration status found');
      expect(error.status).toBe(404);
    }
  });
  it('validatePinAssignment should throw a http exception if no matching configuration is found', async () => {
    const processService = mockProcessService(testCalculation, null, testCalculationConfigurationStatus);

    try {
      await processService.validatePinAssignment(testCalculation.id, testConfiguration.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.message).toBe('Configuration not found');
      expect(error.status).toBe(404);
    }
  });
  it('validatePinAssignment should throw a http exception if the configuration status is invalid', async () => {
    const processService = mockProcessService(
      testCalculation,
      null,
      testCalculationConfigurationStatus,
      'invalidStatus'
    );

    try {
      await processService.validatePinAssignment(testCalculation.id, testConfiguration.id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response).toBe('Invalid calculation configuration status');
      expect(error.status).toBe(422);
    }
  });

  // PROCESS WITH MANY Configuration
  it('processCalculationWithManyConfigurations should throw a http exception if no matching calculation is found', async () => {
    const processService = mockProcessService(null, null, null);

    try {
      await processService.processCalculationWithManyConfigurations(testCalculation.id, [
        testSingleCableCalculation.id,
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.message).toBe('Calculation not found');
      expect(error.status).toBe(404);
    }
  });
  it('processCalculationWithManyConfigurations should throw a http exception if no configurations are assigned to the calculation', async () => {
    const processService = mockProcessService(testCalculation, null, null);

    try {
      await processService.processCalculationWithManyConfigurations(testCalculation.id, [
        testSingleCableCalculation.id,
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response).toBe('Invalid calculation (no assigned configurations)');
      expect(error.status).toBe(422);
    }
  });

  // PROCESS WITH Configuration
  it('processCalculationWithConfiguration should throw a http exception if no matching single cable calculation is found', async () => {
    const processService = mockProcessService(null, null, null);

    try {
      await processService.processCalculationWithConfiguration(testCalculation, testSingleCableCalculation.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.message).toBe('SingleCableCalculation not found');
      expect(error.status).toBe(404);
    }
  });
  it('processCalculationWithConfiguration should throw a http exception if no matching calculation configuration status is found', async () => {
    testSingleCableCalculation = {
      ...testSingleCableCalculation,
      configuration: testConfiguration,
    };
    testCalculation = {
      ...testCalculation,
      singleCableCalculations: [testSingleCableCalculation],
    };
    const processService = mockProcessService(testCalculation, null, null);

    try {
      await processService.processCalculationWithConfiguration(testCalculation, testSingleCableCalculation.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.message).toBe('No calculation configuration status found');
      expect(error.status).toBe(404);
    }
  });
});
