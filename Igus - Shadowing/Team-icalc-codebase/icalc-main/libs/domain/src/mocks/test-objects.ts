import type {
  ActionModels,
  ChainflexCable,
  Calculation,
  CalculationConfigurationStatus,
  CustomerTypeEnum,
  Configuration,
  ConfigurationConnectorState,
  ConfigurationPinAssignmentState,
  ConfigurationState,
  Mat017ItemWithWidenData,
  CableStructureInformation,
} from '../models/';
import { RISK_FACTORS, ConfigurationStatus } from '../models/';

// basic configuration state with the minimum amount of processable data
export const defaultTestConfigurationState: ConfigurationState = {
  chainFlexState: {
    chainflexCable: {
      partNumber: 'TestCF.001',
      price: { germanListPrice: 20.01, id: 'testCFId', partNumber: 'TestCF.001' },
      cableStructureInformation: {
        isValid: true,
        structure: [
          {
            color: {
              cssClassName: 'white',
              translateKey: 'CORE_DESC_WH',
            },
            thickness: 0.14,
            type: 'core',
          },
          {
            description: 'SH0',
            horizontalOrder: 3,
            shieldedItemCount: 12,
            type: 'shield',
          },
          {
            description: 'SH0',
            horizontalOrder: 3,
            shieldedItemCount: 12,
            type: 'litze',
          },
        ],
        validationErrors: [],
      } as CableStructureInformation,
    } as ChainflexCable,
  },
  connectorState: {
    leftConnector: {
      mat017ItemListWithWidenData: [
        {
          id: 'testItemId',
          matNumber: 'MAT017TestItem',
          quantity: 1,
          overrides: {
            amountDividedByPriceUnit: 1,
            mat017ItemGroup: 'RC-K5',
          },
        } as Mat017ItemWithWidenData,
      ],
      addedMat017Items: {
        testItemId: 1,
      },
    },
  } as unknown as ConfigurationConnectorState,
  pinAssignmentState: {
    actionModels: {
      ['0']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['1']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['2']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['3']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['4']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['5']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['6']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['7']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['8']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['9']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['10']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['11']: { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      ['12']: { left: { actionSelect: 'none' }, type: 'shield', right: { actionSelect: 'none' } },
    } as ActionModels,
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
  mat017ItemRiskFactor: RISK_FACTORS.defaultMat017ItemRiskFactor,
  mat017ItemAndWorkStepRiskFactor: RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor,
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

export const defaultSingleCableCalculation = {
  // base data
  batchSize: 1,
  chainflexLength: 1,
  id: 'testSCC1',
  calculationFactor: 1,
  configuration: defaultTestConfiguration,
  calculation: undefined,
  assignedBy: undefined,
  commercialWorkStepOverrides: {},
  assignmentDate: new Date(),
};
