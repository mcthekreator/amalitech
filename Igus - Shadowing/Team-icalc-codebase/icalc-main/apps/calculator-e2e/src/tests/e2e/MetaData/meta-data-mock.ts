import {
  icalcTestCalculation,
  icalcTestConfiguration,
  icalcTestSingleCableCalculation,
  ICALC_DYNAMIC_CALC_NUMBER_PREFIX,
  icalcLockedTestConfiguration,
} from '@igus/icalc-domain';

export interface MockDataByCalculation {
  calculationNumber: string;
  configurationNumber: string;
  calculationFactor: string;
  customerType: string;
  batchSize: string;
  chainflexLength: string;
  quoteNumber?: string;
  description?: string;
  label?: string;
  customer?: string;
}

export interface MetaDataMockData {
  createNewCalculationAndConfiguration: MockDataByCalculation;
  openExistingCalculation: MockDataByCalculation;
  assignConfigurationToExistingCalculation: MockDataByCalculation;
  copyConfigurationFromLockedToNewCalculation: MockDataByCalculation;
  copyConfigurationWithCurrentPricesToNewCalculation: MockDataByCalculation;
  copyConfigurationWithOldPricesToNewCalculation: MockDataByCalculation;
  copyConfigurationToExistingCalculation: MockDataByCalculation;
  displayDataOfSelectedCalculation: MockDataByCalculation;
  copyCalculationAndAssignConfiguration: MockDataByCalculation;
}

export const mockDataByScenario: MetaDataMockData = {
  createNewCalculationAndConfiguration: {
    calculationNumber: `${icalcTestCalculation.calculationNumber}-new`,
    calculationFactor: icalcTestCalculation.calculationFactor.toString(),
    customerType: 'betriebsMittler',
    configurationNumber: `${icalcTestConfiguration.matNumber}-new`,
    batchSize: icalcTestSingleCableCalculation.batchSize.toString(),
    chainflexLength: '3',
    quoteNumber: 'new Quote Number',
    label: 'new label',
    customer: 'new Customer',
    description: 'new configuration description',
  },
  openExistingCalculation: {
    calculationNumber: icalcTestCalculation.calculationNumber,
    calculationFactor: icalcTestCalculation.calculationFactor.toString(),
    customerType: 'serialCustomer',
    configurationNumber: icalcTestConfiguration.matNumber,
    batchSize: icalcTestSingleCableCalculation.batchSize.toString(),
    chainflexLength: '3',
  },
  assignConfigurationToExistingCalculation: {
    calculationNumber: icalcTestCalculation.calculationNumber,
    calculationFactor: icalcTestCalculation.calculationFactor.toString(),
    customerType: 'serialCustomer',
    configurationNumber: `${icalcTestConfiguration.matNumber}-add-assignment`,
    batchSize: '2',
    chainflexLength: '3',
    description: 'example description',
  },
  copyConfigurationFromLockedToNewCalculation: {
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-new-calc-copied-from-locked`,
    calculationFactor: '2',
    customerType: 'serialCustomer',
    configurationNumber: `${icalcTestConfiguration.matNumber}-copied-config-from-locked-to-new-calculation`,
    batchSize: '3',
    chainflexLength: '3',
    description: 'example description',
  },
  copyConfigurationWithCurrentPricesToNewCalculation: {
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-new-calc-with-config-current-prices`,
    calculationFactor: '2',
    customerType: 'serialCustomer',
    configurationNumber: `${icalcTestConfiguration.matNumber}-copied-config-without-price-updates-to-new-calculation`,
    batchSize: '3',
    chainflexLength: '3',
    description: 'example description',
  },
  copyConfigurationWithOldPricesToNewCalculation: {
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-new-calc-with-config-old-prices`,
    calculationFactor: '2',
    customerType: 'serialCustomer',
    configurationNumber: `${icalcTestConfiguration.matNumber}-copy-config-with-old-prices-to-new-calc`,
    batchSize: '3',
    chainflexLength: '3',
  },
  copyConfigurationToExistingCalculation: {
    calculationNumber: icalcTestCalculation.calculationNumber,
    calculationFactor: '1',
    customerType: 'serialCustomer',
    configurationNumber: `${icalcTestConfiguration.matNumber}-copied-config-to-current-calculation`,
    batchSize: '3',
    chainflexLength: '3',
    description: 'example description',
  },
  copyCalculationAndAssignConfiguration: {
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-copy-of-locked`,
    configurationNumber: icalcLockedTestConfiguration.matNumber,
    calculationFactor: icalcTestCalculation.calculationFactor.toString(),
    customerType: 'serialCustomer',
    batchSize: icalcTestSingleCableCalculation.batchSize.toString(),
    chainflexLength: '3',
  },
  displayDataOfSelectedCalculation: {
    calculationNumber: icalcTestCalculation.calculationNumber,
    calculationFactor: icalcTestCalculation.calculationFactor.toString(),
    customerType: 'serialCustomer',
    configurationNumber: icalcTestConfiguration.matNumber,
    batchSize: icalcTestSingleCableCalculation.batchSize.toString(),
    chainflexLength: '3',
  },
};
