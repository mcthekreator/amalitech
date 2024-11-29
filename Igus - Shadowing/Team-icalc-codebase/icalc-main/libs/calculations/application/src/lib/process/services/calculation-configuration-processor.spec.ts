import type {
  Calculation,
  Configuration,
  ConfigurationChainFlexState,
  ConfigurationConnectorState,
  ConfigurationPinAssignmentState,
  ConfigurationState,
  Mat017ItemWithWidenData,
  SingleCableCalculation,
} from '@igus/icalc-domain';
import { CalculationConfigurationProcessor } from './calculation-configuration-processor';
import {
  createIcalcTestConnectorState,
  createIcalcTestLibraryState,
  createIcalcTestPinAssignmentState,
  defaultSingleCableCalculation,
  defaultTestCalculation,
  defaultTestConfiguration,
  defaultTestConfigurationState,
  getWorkStepDefaultPrices,
  WorkStepSet,
} from '@igus/icalc-domain';
import { overwriteConfigurationInSCC } from './test-utils';
import { CommonQuantities, Mat017ItemsQuantities } from './work-step-quantities-builders';

const testCalculation: Calculation = defaultTestCalculation;
let testSingleCableCalculation: SingleCableCalculation = defaultSingleCableCalculation;
let testConfiguration: Configuration = defaultTestConfiguration;

testSingleCableCalculation.configuration = testConfiguration;
testSingleCableCalculation.calculation = testCalculation;

describe('ProcessService', () => {
  describe('process', () => {
    it('should return a valid ProcessResult', () => {
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength, calculation } =
        testSingleCableCalculation;

      const paramDiscounts = {
        chainflexDiscount: 1,
        mat017ItemDiscount: calculation.mat017ItemRiskFactor * calculation.mat017ItemAndWorkStepRiskFactor,
        workStepDiscount: calculation.mat017ItemRiskFactor,
      };
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        calculation.customerType,
        paramDiscounts,
        calculation.calculationFactor,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.process();

      expect(result).toHaveProperty('configurationReference');
      expect(result).toHaveProperty('discounts');

      const { discounts } = result;

      expect(discounts.chainflexDiscount).toBe(paramDiscounts.chainflexDiscount);
      expect(discounts.mat017ItemDiscount).toBe(paramDiscounts.mat017ItemDiscount);
      expect(discounts.workStepDiscount).toBe(paramDiscounts.workStepDiscount);
    });
  });

  describe('isProcessable', () => {
    it('should return true if all necessary data is set', () => {
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(true);
    });

    it('should return false if no configuration is set', () => {
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, null);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    it('should return false if no matNumber is set in the configuration', () => {
      testConfiguration = {
        ...defaultTestConfiguration,
        matNumber: null,
      };
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    it('should return false if no partNumber is set in the configuration', () => {
      testConfiguration = {
        ...defaultTestConfiguration,
        partNumber: null,
      };
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    it('should return false if no state is set in the configuration', () => {
      testConfiguration = {
        ...defaultTestConfiguration,
        state: null,
      };
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    it('should return false if no chainflex cable is set in the state of the configuration', () => {
      const testConfigurationState = {
        ...defaultTestConfigurationState,
        chainFlexState: {
          chainflexCable: null,
        } as ConfigurationChainFlexState,
      };

      testConfiguration = {
        ...defaultTestConfiguration,
        state: testConfigurationState,
      };
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    it('should return false if no leftConnector is set in the state of the configuration', () => {
      const testConfigurationState = {
        ...defaultTestConfigurationState,
        connectorState: {
          leftConnector: null,
        } as ConfigurationConnectorState,
      };

      testConfiguration = {
        ...defaultTestConfiguration,
        state: testConfigurationState,
      };
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    it('should return false if no leftConnector mat017ItemListWithWidenData is empty in the state of the configuration', () => {
      const testConfigurationState = {
        ...defaultTestConfigurationState,
        connectorState: {
          leftConnector: {
            mat017ItemListWithWidenData: [],
          },
        } as ConfigurationConnectorState,
      };

      testConfiguration = {
        ...defaultTestConfiguration,
        state: testConfigurationState,
      };
      testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
      const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
      const calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        null,
        null,
        null,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );

      const result = calcConfigProcessor.isProcessable();

      expect(result).toBe(false);
    });

    describe('isActionModelValid', () => {
      it('should return false when chainflexCableStructureInformation is undefined', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          chainFlexState: {
            chainflexCable: {
              cableStructureInformation: undefined,
            },
          },
          pinAssignmentState: createIcalcTestPinAssignmentState({
            actionModels: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              '0': {
                left: { actionSelect: 'mat017Item', mat017Item: 'Test123' },
                type: 'core',
                right: { actionSelect: 'none' },
              },
            },
          }),
        } as ConfigurationState;

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return false when actionModels is undefined', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          pinAssignmentState: {
            actionModels: null,
          } as ConfigurationPinAssignmentState,
        };

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return false when actionModels have no keys set', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          pinAssignmentState: {
            actionModels: {},
          } as ConfigurationPinAssignmentState,
        };

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return false when given actionModels contain other mat017 items as mat017Item on the left, than the selected mat017 items of the leftConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          pinAssignmentState: createIcalcTestPinAssignmentState({
            actionModels: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              '0': {
                left: { actionSelect: 'mat017Item', mat017Item: 'Test123' },
                type: 'core',
                right: { actionSelect: 'none' },
              },
            },
          }),
        };

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return false when given actionModels contain other mat017 items as mat017Item on the right, than the selected mat017 items of the rightConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          pinAssignmentState: createIcalcTestPinAssignmentState({
            actionModels: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              '0': {
                left: { actionSelect: 'none' },
                type: 'core',
                right: { actionSelect: 'mat017Item', mat017Item: 'Test123' },
              },
            },
          }),
          connectorState: createIcalcTestConnectorState({
            rightConnector: {
              mat017ItemListWithWidenData: [
                {
                  id: 'testItemId',
                  matNumber: 'MAT017TestItem',
                  quantity: 1,
                  overrides: {
                    amountDividedByPriceUnit: 1,
                    mat017ItemGroup: 'RC-K5',
                  },
                },
              ],
              addedMat017Items: {
                testItemId: 1,
              },
            },
          }),
        } as ConfigurationState;

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return true when given actionModels contain same mat017 items as mat017Item on the left and the selected mat017 items of the leftConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          pinAssignmentState: createIcalcTestPinAssignmentState({
            actionModels: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              '0': {
                left: { actionSelect: 'mat017Item', mat017Item: 'MAT017TestItem' },
                type: 'core',
                right: { actionSelect: 'none' },
              },
            },
          }),
        };

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(true);
      });

      it('should return true when given actionModels contain same mat017 items as mat017Item on the right and the selected mat017 items of the rightConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          pinAssignmentState: createIcalcTestPinAssignmentState({
            actionModels: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              '0': {
                left: { actionSelect: 'none' },
                type: 'core',
                right: { actionSelect: 'mat017Item', mat017Item: 'MAT017TestItem' },
              },
            },
          }),
          connectorState: createIcalcTestConnectorState({
            rightConnector: {
              mat017ItemListWithWidenData: [
                {
                  id: 'testItemId',
                  matNumber: 'MAT017TestItem',
                  quantity: 1,
                  overrides: {
                    amountDividedByPriceUnit: 1,
                    mat017ItemGroup: 'RC-K5',
                  },
                },
              ],
              addedMat017Items: {
                testItemId: 1,
              },
            },
          }),
        } as ConfigurationState;

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(true);
      });
    });

    describe('isLibraryValid', () => {
      it('should return true when libraryState is undefined', () => {
        testConfiguration = {
          ...defaultTestConfiguration,
          state: {
            ...defaultTestConfigurationState,
            libraryState: undefined,
          },
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(true);
      });

      it('should return false when given libraryStates images mat numbers on the left side are different from the selected mat017 items of the leftConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          libraryState: createIcalcTestLibraryState({
            imageList: [{ side: 'left', matNumber: 'Test123' }],
          }),
        };

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return false when given libraryStates images mat numbers on the right side are different from the selected mat017 items of the rightConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          libraryState: createIcalcTestLibraryState({
            imageList: [{ side: 'right', matNumber: 'Test123' }],
          }),
          connectorState: createIcalcTestConnectorState({
            rightConnector: {
              mat017ItemListWithWidenData: [
                {
                  id: 'testItemId',
                  matNumber: 'MAT017TestItem',
                  quantity: 1,
                  overrides: {
                    amountDividedByPriceUnit: 1,
                    mat017ItemGroup: 'RC-K5',
                  },
                },
              ],
              addedMat017Items: {
                testItemId: 1,
              },
            },
          }),
        } as ConfigurationState;

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(false);
      });

      it('should return true when given libraryStates images mat numbers on the left side are the same as the selected mat017 items of the leftConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          libraryState: createIcalcTestLibraryState({
            imageList: [{ side: 'left', matNumber: 'MAT017TestItem' }],
          }),
        };

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(true);
      });

      it('should return true when given libraryStates images mat numbers on the right side are the same as the selected mat017 items of the rightConnector', () => {
        const testConfigurationState = {
          ...defaultTestConfigurationState,
          libraryState: createIcalcTestLibraryState({
            imageList: [{ side: 'right', matNumber: 'MAT017TestItem' }],
          }),
          connectorState: createIcalcTestConnectorState({
            rightConnector: {
              mat017ItemListWithWidenData: [
                {
                  id: 'testItemId',
                  matNumber: 'MAT017TestItem',
                  quantity: 1,
                  overrides: {
                    amountDividedByPriceUnit: 1,
                    mat017ItemGroup: 'RC-K5',
                  },
                },
              ],
              addedMat017Items: {
                testItemId: 1,
              },
            },
          }),
        } as ConfigurationState;

        testConfiguration = {
          ...defaultTestConfiguration,
          state: testConfigurationState,
        };
        testSingleCableCalculation = overwriteConfigurationInSCC(testSingleCableCalculation, testConfiguration);
        const { configuration, batchSize, commercialWorkStepOverrides, chainflexLength } = testSingleCableCalculation;
        const calcConfigProcessor = new CalculationConfigurationProcessor(
          configuration,
          batchSize,
          chainflexLength,
          commercialWorkStepOverrides,
          null,
          null,
          null,
          getWorkStepDefaultPrices(WorkStepSet.standard),
          WorkStepSet.standard
        );

        const result = calcConfigProcessor.isProcessable();

        expect(result).toBe(true);
      });
    });

    describe('CommonQuantities behavior', () => {
      it('should set CommonQuantities accordingly', () => {
        const commonQuantities = new CommonQuantities(WorkStepSet.standard);

        commonQuantities.setDrillingSealInsert();
        commonQuantities.setPackage();
        commonQuantities.setSendTestReport();

        expect(commonQuantities.getValue().package).toBe(1);
        expect(commonQuantities.getValue().sendTestReport).toBe(0);
        expect(commonQuantities.getValue().drillingSealInsert).toBe(0);
      });
    });

    describe('Mat017ItemsQuantities with left and right side mat017 items behavior', () => {
      let mat017ItemsQuantities: Mat017ItemsQuantities;

      beforeEach(() => {
        testSingleCableCalculation = overwriteConfigurationInSCC(defaultSingleCableCalculation, {
          ...defaultTestConfiguration,
          state: {
            ...defaultTestConfiguration.state,
            connectorState: {
              ...defaultTestConfiguration.state.connectorState,
              rightConnector: {
                mat017ItemListWithWidenData: [
                  {
                    id: 'testItemId',
                    matNumber: 'MAT017TestItem',
                    quantity: 1,
                  } as Mat017ItemWithWidenData,
                ],
                addedMat017Items: {
                  testItemId: 1,
                },
              },
            },
          },
        });
        const { configuration } = testSingleCableCalculation;

        mat017ItemsQuantities = new Mat017ItemsQuantities(configuration.state);
      });

      it('should set quantity of testFieldPrep to 0 if MAT017 items have been chosen for both sides', () => {
        mat017ItemsQuantities.setTestFieldPrep();
        expect(mat017ItemsQuantities.getValue().testFieldPrep).toBe(0);
      });

      it('should set quantity of consignment to 2 if 2 MAT017 items have been selected', () => {
        mat017ItemsQuantities.setConsignment();
        expect(mat017ItemsQuantities.getValue().consignment).toBe(2);
      });
    });

    describe('Mat017ItemsQuantities with left side mat017 items ONLY behavior', () => {
      let mat017ItemsQuantities: Mat017ItemsQuantities;

      beforeEach(() => {
        testSingleCableCalculation = overwriteConfigurationInSCC(
          defaultSingleCableCalculation,
          defaultTestConfiguration
        );
        const { configuration } = testSingleCableCalculation;

        mat017ItemsQuantities = new Mat017ItemsQuantities(configuration.state);
      });

      it('should set quantity of testFieldPrep to 1 if MAT017 items have been chosen for the left side, but not the right side', () => {
        mat017ItemsQuantities.setTestFieldPrep();
        expect(mat017ItemsQuantities.getValue().testFieldPrep).toBe(1);
      });

      it('should set quantity of consignment to 1 if only one MAT017 item has been selected', () => {
        mat017ItemsQuantities.setConsignment();
        expect(mat017ItemsQuantities.getValue().consignment).toBe(1);
      });

      it('should set quantity of labeling to 0 if no rck8 item was selected', () => {
        mat017ItemsQuantities.setLabeling();
        expect(mat017ItemsQuantities.getValue().labeling).toBe(0);
      });
    });
  });
  describe('getPinAssignmentWorkStepQuantities', () => {
    let calcConfigProcessor: CalculationConfigurationProcessor;

    beforeEach(() => {
      testSingleCableCalculation = overwriteConfigurationInSCC(defaultSingleCableCalculation, defaultTestConfiguration);
      const { configuration, calculation, batchSize, commercialWorkStepOverrides, chainflexLength } =
        testSingleCableCalculation;

      calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        calculation.customerType,
        null,
        calculation.calculationFactor,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.standard
      );
    });

    it('should set quantitiesWithoutOverrides', () => {
      const result = calcConfigProcessor.process();

      expect(result.quantitiesWithoutOverrides.assembly).toBe(0);
      expect(result.quantitiesWithoutOverrides.consignment).toBe(1);
      expect(result.quantitiesWithoutOverrides.crimp).toBe(0);
      expect(result.quantitiesWithoutOverrides.cutOver20MM).toBe(0);
      expect(result.quantitiesWithoutOverrides.cutUnder20MM).toBe(1);
      expect(result.quantitiesWithoutOverrides.drillingSealInsert).toBe(0);
      expect(result.quantitiesWithoutOverrides.labeling).toBe(0);
      expect(result.quantitiesWithoutOverrides.package).toBe(1);
      expect(result.quantitiesWithoutOverrides.sendTestReport).toBe(0);
      expect(result.quantitiesWithoutOverrides.stripShieldHandling).toBe(0);
      expect(result.quantitiesWithoutOverrides.shieldHandling).toBe(0);
      expect(result.quantitiesWithoutOverrides.skinning).toBe(0);
      expect(result.quantitiesWithoutOverrides.strip).toBe(0);
      expect(result.quantitiesWithoutOverrides.test).toBe(0);
      expect(result.quantitiesWithoutOverrides.testFieldPrep).toBe(1);
    });

    it('should set standard WorkSteps if standard WorkStepSet is selected', () => {
      const result = calcConfigProcessor.process();

      expect(result.workSteps.find((w) => w.name === 'shieldHandling').quantity).toBe(0);
      expect(result.workSteps.find((w) => w.name === 'strip').quantity).toBe(0);
      expect(result.workSteps.find((w) => w.name === 'assembly')).toBe(undefined);
      expect(result.workSteps.find((w) => w.name === 'stripShieldHandling')).toBe(undefined);
    });

    it('should set driveCliq WorkSteps if driveCliq WorkStepSet is selected', () => {
      testSingleCableCalculation = overwriteConfigurationInSCC(defaultSingleCableCalculation, defaultTestConfiguration);
      const { configuration, calculation, batchSize, commercialWorkStepOverrides, chainflexLength } =
        testSingleCableCalculation;

      calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        calculation.customerType,
        null,
        calculation.calculationFactor,
        getWorkStepDefaultPrices(WorkStepSet.standard),
        WorkStepSet.driveCliq
      );

      const result = calcConfigProcessor.process();

      expect(result.workSteps.find((w) => w.name === 'shieldHandling')).toBe(undefined);
      expect(result.workSteps.find((w) => w.name === 'strip')).toBe(undefined);
      expect(result.workSteps.find((w) => w.name === 'assembly').quantity).toBe(0);
      expect(result.workSteps.find((w) => w.name === 'stripShieldHandling').quantity).toBe(0);
    });

    it('should set machineLine WorkSteps if machineLine WorkStepSet is selected', () => {
      testSingleCableCalculation = overwriteConfigurationInSCC(defaultSingleCableCalculation, defaultTestConfiguration);
      const { configuration, calculation, batchSize, commercialWorkStepOverrides, chainflexLength } =
        testSingleCableCalculation;

      calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        calculation.customerType,
        null,
        calculation.calculationFactor,
        getWorkStepDefaultPrices(WorkStepSet.machineLine),
        WorkStepSet.machineLine
      );

      const result = calcConfigProcessor.process();

      expect(result.workSteps.find((w) => w.name === 'shieldHandlingOuterShield')).toBeDefined();
      expect(result.workSteps.find((w) => w.name === 'shieldHandlingInnerShield')).toBeDefined();
      expect(result.workSteps.find((w) => w.name === 'stripOuterJacket')).toBeDefined();
      expect(result.workSteps.find((w) => w.name === 'stripInnerJacket')).toBeDefined();
      expect(result.workSteps.find((w) => w.name === 'assembly')).toBeUndefined();
      expect(result.workSteps.find((w) => w.name === 'stripShieldHandling')).toBeUndefined();
    });

    it('should set ethernet WorkSteps if ethernet WorkStepSet is selected', () => {
      testSingleCableCalculation = overwriteConfigurationInSCC(defaultSingleCableCalculation, defaultTestConfiguration);
      const { configuration, calculation, batchSize, commercialWorkStepOverrides, chainflexLength } =
        testSingleCableCalculation;

      calcConfigProcessor = new CalculationConfigurationProcessor(
        configuration,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides,
        calculation.customerType,
        null,
        calculation.calculationFactor,
        getWorkStepDefaultPrices(WorkStepSet.ethernet),
        WorkStepSet.ethernet
      );

      const result = calcConfigProcessor.process();

      expect(result.workSteps.find((w) => w.name === 'shieldHandlingOuterShield')).toBeUndefined();
      expect(result.workSteps.find((w) => w.name === 'shieldHandlingInnerShield')).toBeUndefined();
      expect(result.workSteps.find((w) => w.name === 'stripOuterJacket')).toBeUndefined();
      expect(result.workSteps.find((w) => w.name === 'stripInnerJacket')).toBeUndefined();
      expect(result.workSteps.find((w) => w.name === 'assembly')).toBeDefined();
      expect(result.workSteps.find((w) => w.name === 'stripShieldHandling')).toBeDefined();
    });
  });
});
