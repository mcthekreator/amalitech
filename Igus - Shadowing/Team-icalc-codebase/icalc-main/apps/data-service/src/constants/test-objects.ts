import type {
  ActionModels,
  Calculation,
  CalculationConfigurationStatus,
  ChainflexCable,
  CustomerTypeEnum,
  Configuration,
  ConfigurationConnectorState,
  ConfigurationPinAssignmentState,
  ConfigurationState,
  Mat017ItemWithWidenData,
  SingleCableCalculation,
} from '@igus/icalc-domain';
import { ConfigurationStatus } from '@igus/icalc-domain';

// basic configuration state with the minimum amount of processable data
export const defaultTestConfigurationState: ConfigurationState = {
  chainFlexState: {
    chainflexCable: {
      partNumber: 'TestCF.001',
    } as ChainflexCable,
  },
  connectorState: {
    leftConnector: {
      mat017ItemListWithWidenData: [
        {
          id: 'testItemId',
          matNumber: 'MAT017TestItem',
        } as Mat017ItemWithWidenData,
      ],
      addedMat017Items: {
        testItemId: 1,
      },
    },
  } as unknown as ConfigurationConnectorState,
  pinAssignmentState: {
    actionModels: {} as ActionModels,
  } as ConfigurationPinAssignmentState,
} as ConfigurationState;

export const defaultTestConfiguration: Configuration = {
  id: 'testConfigurationId1',
  matNumber: 'testMatNumber1',
  labelingLeft: 'leftLableing',
  labelingRight: 'rightLabeling',
  creationDate: new Date(),
  modificationDate: new Date(),
  createdBy: 'Tester',
  modifiedBy: 'Tester',
  partNumber: 'TestCF.001',
  state: defaultTestConfigurationState,
};

export const defaultTestCalculation: Calculation = {
  id: 'testCalculationId1',
  calculationNumber: 'testCalculationNumber1',
  calculationFactor: 1,
  customer: 'TestCustomer',
  quoteNumber: 'TestQuoteNumber',
  customerType: 'serialCustomer' as CustomerTypeEnum,
  creationDate: new Date(),
  createdBy: 'Tester',
  modificationDate: new Date(),
  modifiedBy: 'Tester',
  productionPlanExcelDownloaded: false,
  calculationExcelDownloaded: false,
  singleCableCalculations: [],
};

export const defaultTestCalculationConfigurationStatus: CalculationConfigurationStatus = {
  calculationId: 'testCalculationId1',
  calculation: defaultTestCalculation,
  configurationId: 'testConfigurationId1',
  configuration: defaultTestConfiguration,
  status: ConfigurationStatus.notApproved,
  modificationDate: new Date(),
  modifiedBy: 'Tester',
};

export const defaultSingleCableCalculation: SingleCableCalculation = {
  // base data
  batchSize: 1,
  chainflexLength: 1,
  // additional
  id: 'testSCC1',
  calculationFactor: 1,
  configuration: null,
  calculation: null,
  assignedBy: null,
  commercialWorkStepOverrides: {},
  assignmentDate: new Date(),
};
