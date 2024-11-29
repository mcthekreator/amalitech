import type { Mat017Item } from '@igus/icalc-domain';
import { Mat017ItemStatus, createConfiguration, createMat017Item } from '@igus/icalc-domain';
import { PresentationMappers } from './presentation-mappers';

const mockConfiguration = createConfiguration();

const firstMat017Item = createMat017Item({
  matNumber: mockConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber,
});

const secondMat017Item = createMat017Item({
  matNumber: mockConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[1].matNumber,
});

const mockMat017ItemProps: Partial<Mat017Item> = {
  itemDescription1: 'mockItemDesc1',
  itemDescription2: 'mockItemDesc2',
  amountDividedByPriceUnit: 100,
  mat017ItemGroup: 'RC-K1',
  supplierItemNumber: 'mockSupplierItemNumber',
  itemStatus: Mat017ItemStatus.active,
};

const mockMat017ItemsBaseDataByMatNumber = new Map();

mockMat017ItemsBaseDataByMatNumber.set(firstMat017Item.matNumber, {
  ...firstMat017Item,
  ...mockMat017ItemProps,
});
mockMat017ItemsBaseDataByMatNumber.set(secondMat017Item.matNumber, {
  ...secondMat017Item,
  ...mockMat017ItemProps,
});

describe('PresentationMappers', () => {
  describe('mapToConfigurationPresentation', () => {
    it('should map RedactedMat017ItemWithWidenData to Mat017ItemWithWidenData within the ConnectorState', () => {
      const configurationPresentation = PresentationMappers.mapToConfigurationPresentation(
        mockConfiguration,
        mockMat017ItemsBaseDataByMatNumber
      );
      const firstMat017ItemFromConfigurationPresentation =
        configurationPresentation.state.connectorState.leftConnector.mat017ItemListWithWidenData[0];

      expect(firstMat017ItemFromConfigurationPresentation).toEqual(expect.objectContaining(mockMat017ItemProps));
    });
  });
});
