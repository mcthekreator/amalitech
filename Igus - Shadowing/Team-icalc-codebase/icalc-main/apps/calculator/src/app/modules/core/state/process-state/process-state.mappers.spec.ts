import type { ConfigurationWithChangedMat017ItemOverrides } from '@igus/icalc-domain';
import {
  Mat017ItemOverridesEnum,
  Mat017ItemStatus,
  createCalculationPresentation,
  createConfigurationPresentation,
  createMat017Item,
  createSingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import { ProcessStateMappers } from './process-state.mappers';
import type { ProcessStateModel } from './process-state.model';
import { createMockProcessState } from '../../utils';

describe('ProcessStateMappers', () => {
  const calculation = createCalculationPresentation();

  const scc1 = createSingleCableCalculationPresentation({
    id: 'uuid1',
    matNumber: 'mat1',
    chainflexLength: 1,
    batchSize: 2,
    configurationId: 'exConfigId1',
    configuration: createConfigurationPresentation({ id: 'exConfigId1' }),
    calculation,
    calculationId: calculation.id,
  });

  const scc2 = createSingleCableCalculationPresentation({
    id: 'uuid2',
    matNumber: 'mat1',
    chainflexLength: 3,
    batchSize: 4,
    configurationId: 'exConfigId2',
    configuration: createConfigurationPresentation({ id: 'exConfigId2' }),
    calculation,
    calculationId: calculation.id,
  });

  calculation.singleCableCalculations = [scc1, scc2];

  const mat017Item = createMat017Item();

  const configurations: ConfigurationWithChangedMat017ItemOverrides[] = [
    {
      id: 'exConfigId1',
      matNumber: 'mat1',
      mat017ItemsChanges: [
        {
          itemDescription1: mat017Item.itemDescription1,
          itemDescription2: mat017Item.itemDescription2,
          matNumber: mat017Item.matNumber,
          itemStatus: Mat017ItemStatus.active,
          usedInSketch: false,
          usedInPinAssignment: false,
          currentOverrides: {
            amountDividedByPriceUnit: 2,
            mat017ItemGroup: 'RC-K5',
          },
          newOverrides: {
            amountDividedByPriceUnit: 1,
            mat017ItemGroup: 'RC-K3',
          },
        },
        {
          itemDescription1: mat017Item.itemDescription1,
          itemDescription2: mat017Item.itemDescription2,
          matNumber: mat017Item.matNumber,
          itemStatus: Mat017ItemStatus.inactive,
          usedInSketch: false,
          usedInPinAssignment: false,
          currentOverrides: {
            amountDividedByPriceUnit: 9,
            mat017ItemGroup: 'RC-K5',
          },
          newOverrides: {
            amountDividedByPriceUnit: 6,
            mat017ItemGroup: 'RC-K5',
          },
        },
      ],
    },
    {
      id: 'exConfigId2',
      matNumber: 'mat2',
      mat017ItemsChanges: [
        {
          itemDescription1: mat017Item.itemDescription1,
          itemDescription2: mat017Item.itemDescription2,
          matNumber: mat017Item.matNumber,
          itemStatus: Mat017ItemStatus.inactive,
          usedInSketch: true,
          usedInPinAssignment: false,
          currentOverrides: {
            amountDividedByPriceUnit: 8,
            mat017ItemGroup: 'RC-K2',
          },
          newOverrides: {
            amountDividedByPriceUnit: 7,
            mat017ItemGroup: 'RC-K9',
          },
        },

        {
          itemDescription1: mat017Item.itemDescription1,
          itemDescription2: mat017Item.itemDescription2,
          matNumber: mat017Item.matNumber,
          itemStatus: Mat017ItemStatus.removed,
          usedInSketch: true,
          usedInPinAssignment: true,
          currentOverrides: {
            amountDividedByPriceUnit: 9.99,
            mat017ItemGroup: 'RC-K3',
          },
          newOverrides: {
            amountDividedByPriceUnit: 7.99,
            mat017ItemGroup: 'RC-K3',
          },
        },
      ],
    },
  ];

  const mockState = createMockProcessState(
    {
      selectedSingleCableCalculationId: scc1.id,
      informUserAboutWorkSteps: [],
      checkForNewChainflexPricesResult: {
        chainflexPricesHaveChanged: true,
        chainflexesAndPricesAvailable: false,
        singleCableCalculationPriceUpdateReferences: [
          {
            singleCableCalculationId: scc1.id,
            partNumber: 'part1',
            priceAvailable: false,
            priceDeviationDetected: true,
          },
          {
            singleCableCalculationId: scc2.id,
            partNumber: 'part2',
            priceAvailable: false,
            priceDeviationDetected: true,
          },
        ],
      },
      mat017ItemsModification: {
        hasAmountDividedByPriceUnitChanged: true,
        hasInvalidOrRemovedItems: true,
        configurations,
      },
    },
    [scc1, scc2]
  ) as ProcessStateModel;

  describe('toUpdateMat017ItemsOverridesRequestDto', () => {
    it('should return empty configurationIds when configurations mat017 items all have unchanged itemGroup', () => {
      const configsWithUnchangedMat017ItemGroup = [
        {
          ...configurations[0],
          mat017ItemsChanges: [
            {
              ...configurations[0].mat017ItemsChanges[0],
              newOverrides: {
                ...configurations[0].mat017ItemsChanges[0].newOverrides,
                mat017ItemGroup: 'RC-K5',
              },
            },
          ],
        },
        {
          ...configurations[1],
          mat017ItemsChanges: [
            {
              ...configurations[1].mat017ItemsChanges[0],
              newOverrides: {
                ...configurations[1].mat017ItemsChanges[0].newOverrides,
                mat017ItemGroup: 'RC-K2',
              },
            },
          ],
        },
      ];

      const result = ProcessStateMappers.toUpdateMat017ItemsOverridesRequestDto(
        mockState,
        configsWithUnchangedMat017ItemGroup
      );

      expect(result.configurationIds.length).toBe(0);
      expect(result.updateProperties).toEqual([Mat017ItemOverridesEnum.mat017ItemGroup]);
    });
    it('should return configuration ids of configs with mat017ItemGroup changes', () => {
      const result = ProcessStateMappers.toUpdateMat017ItemsOverridesRequestDto(mockState, configurations);

      expect(result.configurationIds.length).toBe(2);
      expect(result.updateProperties).toEqual([Mat017ItemOverridesEnum.mat017ItemGroup]);
    });
  });
  describe('toMat017ItemListPerItemStatus', () => {
    const itemStatus = [Mat017ItemStatus.removed, Mat017ItemStatus.inactive, Mat017ItemStatus.active];

    it('should return an empty array when there is no mat017Item modifications in calculation', () => {
      const state = {} as ProcessStateModel;
      const result = ProcessStateMappers.toMat017ItemListPerItemStatus(state, itemStatus);

      expect(result).toEqual([]);
    });

    it('should return configurations with mat017 items with updated prices', () => {
      const result = ProcessStateMappers.toMat017ItemListPerItemStatus(mockState, [Mat017ItemStatus.active]);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'exConfigId1',
            matNumber: 'mat1',
            assignments: 1,
            mat017ItemsChanges: expect.arrayContaining([
              expect.objectContaining({
                oldPrice: 2,
                newPrice: 1,
                usedInSketch: false,
                usedInPinAssignment: false,
              }),
            ]),
          }),
        ])
      );
    });

    it('should return configurations with inactive mat017 items', () => {
      const result = ProcessStateMappers.toMat017ItemListPerItemStatus(mockState, [Mat017ItemStatus.inactive]);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'exConfigId1',
            matNumber: 'mat1',
            assignments: 1,
            mat017ItemsChanges: expect.arrayContaining([
              expect.objectContaining({
                oldPrice: 9,
                newPrice: 6,
                mat017ItemGroup: 'RC-K5',
                usedInSketch: false,
                usedInPinAssignment: false,
              }),
            ]),
          }),
          expect.objectContaining({
            id: 'exConfigId2',
            matNumber: 'mat2',
            assignments: 1,
            mat017ItemsChanges: expect.arrayContaining([
              expect.objectContaining({
                oldPrice: 8,
                newPrice: 7,
                mat017ItemGroup: 'RC-K9',
                usedInSketch: true,
                usedInPinAssignment: false,
              }),
            ]),
          }),
        ])
      );
    });

    it('should return configurations with removed mat017 items', () => {
      const result = ProcessStateMappers.toMat017ItemListPerItemStatus(mockState, [Mat017ItemStatus.removed]);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'exConfigId2',
            matNumber: 'mat2',
            assignments: 1,
            mat017ItemsChanges: expect.arrayContaining([
              expect.objectContaining({
                oldPrice: 9.99,
                newPrice: 7.99,
                usedInSketch: true,
                usedInPinAssignment: true,
              }),
            ]),
          }),
        ])
      );
    });
  });
  describe('toChainFlexListWithNoPrices', () => {
    it('should return an empty array when checkForNewChainflexPricesResult is not present', () => {
      const state = {} as ProcessStateModel;
      const result = ProcessStateMappers.toChainFlexListWithNoPrices(state);

      expect(result).toEqual([]);
    });

    it('should filter out references with priceAvailable set to true', () => {
      const result = ProcessStateMappers.toChainFlexListWithNoPrices(mockState);

      expect(result.length).toBe(1);
      expect(result[0].configurationMatNumber).toBe(scc1.matNumber);
    });

    it('should accumulate deviations based on configurationMatNumber', () => {
      const result = ProcessStateMappers.toChainFlexListWithNoPrices(mockState);

      expect(result.length).toBe(1);
      expect(result[0].configurationMatNumber).toBe(scc1.matNumber);
      expect(result[0].chainflexPriceDeviations.length).toBe(2);
      expect(result[0].chainflexPriceDeviations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sccId: scc1.id,
            configurationMatNumber: scc1.matNumber,
            chainflexLength: scc1.chainflexLength,
            batchSize: scc1.batchSize,
          }),
          expect.objectContaining({
            sccId: scc2.id,
            chainflexLength: scc2.chainflexLength,
            configurationMatNumber: scc1.matNumber,
            batchSize: scc2.batchSize,
          }),
        ])
      );
    });
  });
});
