import {
  createConfigurationPresentation,
  createConfigurationSnapshot,
  createSingleCableCalculationPresentation,
} from '../../factories/objects';
import { ObjectUtils } from '../../utils/object-utils';
import type { SingleCableCalculationPresentation } from '../single-cable-calculation';
import { ExcelCalculationMat017ItemList, ExcelProductionPlanMat017ItemList } from './excel-file.model';

const mockSingleCableCalculation = createSingleCableCalculationPresentation({
  configuration: createConfigurationPresentation(),
  snapshotId: null,
});

const connectorState = mockSingleCableCalculation.configuration.state.connectorState;
const combinedMat017ItemList = [
  ...connectorState.leftConnector.mat017ItemListWithWidenData,
  ...connectorState.rightConnector.mat017ItemListWithWidenData,
];

const configurationSnapshot = createConfigurationSnapshot();

const mockSingleCableCalculationOfLockedCalculation = createSingleCableCalculationPresentation({
  configurationId: null,
  snapshotId: configurationSnapshot.id,
  snapshot: configurationSnapshot,
});

const connectorStateLocked =
  mockSingleCableCalculationOfLockedCalculation.snapshot.configurationData.state.connectorState;
const combinedMat017ItemListLocked = [
  ...connectorStateLocked.leftConnector.mat017ItemListWithWidenData,
  ...connectorStateLocked.rightConnector.mat017ItemListWithWidenData,
];

describe('ExcelCalculationMat017ItemList', () => {
  it('should not be able to create without configuration or configurationSnapshot', () => {
    expect(() => ExcelCalculationMat017ItemList.create(createSingleCableCalculationPresentation())).toThrow();
  });
  describe('getData', () => {
    it('should use "no Data" as fallback when value is missing', () => {
      const clonedMockSingleCableCalculation =
        ObjectUtils.cloneDeep<SingleCableCalculationPresentation>(mockSingleCableCalculation);

      const firstMat017Item =
        clonedMockSingleCableCalculation.configuration.state.connectorState.leftConnector
          .mat017ItemListWithWidenData[0];
      const secondMat017Item =
        clonedMockSingleCableCalculation.configuration.state.connectorState.leftConnector
          .mat017ItemListWithWidenData[1];

      delete firstMat017Item.itemDescription1;
      delete firstMat017Item.supplierItemNumber;

      delete secondMat017Item.itemDescription1;
      delete secondMat017Item.supplierItemNumber;

      const mat017ItemList = ExcelCalculationMat017ItemList.create(clonedMockSingleCableCalculation).getData();

      expect(mat017ItemList[0][1]).toEqual('no Data'); //itemDescription1
      expect(mat017ItemList[0][4]).toEqual('no Data'); //supplierItemNumber

      expect(mat017ItemList[1][1]).toEqual('no Data'); //itemDescription1
      expect(mat017ItemList[1][4]).toEqual('no Data'); //supplierItemNumber
    });

    describe('for active calculation', () => {
      it('should return correct array of mat017Item fields', () => {
        const mat017ItemList = ExcelCalculationMat017ItemList.create(mockSingleCableCalculation).getData();
        const firstMat017Item = combinedMat017ItemList[0];
        const secondMat017Item = combinedMat017ItemList[1];

        expect(mat017ItemList).toEqual([
          [
            firstMat017Item.matNumber,
            firstMat017Item.itemDescription1,
            firstMat017Item.itemDescription2,
            firstMat017Item.overrides.mat017ItemGroup,
            firstMat017Item.supplierItemNumber,
            firstMat017Item.overrides.amountDividedByPriceUnit,
            firstMat017Item.quantity,
          ],
          [
            secondMat017Item.matNumber,
            secondMat017Item.itemDescription1,
            secondMat017Item.itemDescription2,
            secondMat017Item.overrides.mat017ItemGroup,
            secondMat017Item.supplierItemNumber,
            secondMat017Item.overrides.amountDividedByPriceUnit,
            secondMat017Item.quantity,
          ],
        ]);
      });
    });
    describe('for locked calculation', () => {
      it('should return correct array of mat017Item fields', () => {
        const mat017ItemList = ExcelCalculationMat017ItemList.create(
          mockSingleCableCalculationOfLockedCalculation
        ).getData();
        const firstMat017Item = combinedMat017ItemListLocked[0];
        const secondMat017Item = combinedMat017ItemListLocked[1];

        expect(mat017ItemList).toEqual([
          [
            firstMat017Item.matNumber,
            firstMat017Item.overrides.itemDescription1,
            firstMat017Item.overrides.itemDescription2,
            firstMat017Item.overrides.mat017ItemGroup,
            firstMat017Item.overrides.supplierItemNumber,
            firstMat017Item.overrides.amountDividedByPriceUnit,
            firstMat017Item.quantity,
          ],
          [
            secondMat017Item.matNumber,
            secondMat017Item.overrides.itemDescription1,
            secondMat017Item.overrides.itemDescription2,
            secondMat017Item.overrides.mat017ItemGroup,
            secondMat017Item.overrides.supplierItemNumber,
            secondMat017Item.overrides.amountDividedByPriceUnit,
            secondMat017Item.quantity,
          ],
        ]);
      });
    });
  });
});

describe('ExcelProductionPlanMat017ItemList', () => {
  describe('getData', () => {
    describe('for active calculation', () => {
      it('should return correct array of mat017Item fields', () => {
        const mat017ItemList = ExcelProductionPlanMat017ItemList.create(mockSingleCableCalculation).getData();
        const firstMat017Item = combinedMat017ItemList[0];
        const secondMat017Item = combinedMat017ItemList[1];

        expect(mat017ItemList).toEqual([
          [
            firstMat017Item.matNumber,
            firstMat017Item.itemDescription1,
            firstMat017Item.itemDescription2,
            firstMat017Item.overrides.mat017ItemGroup,
            firstMat017Item.supplierItemNumber,
            firstMat017Item.quantity,
          ],
          [
            secondMat017Item.matNumber,
            secondMat017Item.itemDescription1,
            secondMat017Item.itemDescription2,
            secondMat017Item.overrides.mat017ItemGroup,
            secondMat017Item.supplierItemNumber,
            secondMat017Item.quantity,
          ],
        ]);
      });
    });
    describe('for locked calculation', () => {
      it('should return correct array of mat017Item fields', () => {
        const mat017ItemList = ExcelProductionPlanMat017ItemList.create(
          mockSingleCableCalculationOfLockedCalculation
        ).getData();
        const firstMat017Item = combinedMat017ItemListLocked[0];
        const secondMat017Item = combinedMat017ItemListLocked[1];

        expect(mat017ItemList).toEqual([
          [
            firstMat017Item.matNumber,
            firstMat017Item.overrides.itemDescription1,
            firstMat017Item.overrides.itemDescription2,
            firstMat017Item.overrides.mat017ItemGroup,
            firstMat017Item.overrides.supplierItemNumber,
            firstMat017Item.quantity,
          ],
          [
            secondMat017Item.matNumber,
            secondMat017Item.overrides.itemDescription1,
            secondMat017Item.overrides.itemDescription2,
            secondMat017Item.overrides.mat017ItemGroup,
            secondMat017Item.overrides.supplierItemNumber,
            secondMat017Item.quantity,
          ],
        ]);
      });
    });
  });
});
