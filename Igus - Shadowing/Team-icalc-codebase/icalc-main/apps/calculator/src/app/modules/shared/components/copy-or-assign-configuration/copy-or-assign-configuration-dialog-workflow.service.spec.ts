import { of } from 'rxjs';
import { CopyOrAssignConfigurationDialogWorkflowService } from './copy-or-assign-configuration-dialog-workflow.service';
import type { ProcessStateFacadeService } from '../../../core/state/process-state/process-state-facade.service';
import type { CopyConfigurationWithUpdatedOverridesDialogService } from './copy-configuration-with-updated-overrides-dialog';
import { CopyWithUpdatedOverridesResult } from './copy-configuration-with-updated-overrides-dialog';
import type { ConfigurationPresentation, HaveMat017ItemsOverridesChangedResponseDto } from '@igus/icalc-domain';
import { Mat017ItemStatus, createConfigurationPresentation } from '@igus/icalc-domain';
import type { AssignConfigurationSearchDialogService } from './assign-configuration-search-dialog';
import { AssignConfigurationSearchDialogResult } from './assign-configuration-search-dialog';
import { AssignOrCopyConfigurationActionsEnum } from './copy-configuration-model';
import type { CopyConfigurationToExistingCalculationDialogService } from './copy-configuration-to-existing-calculation-dialog';
import type { AssignExistingConfigurationOrCopyDialogService } from './assign-existing-configuration-or-copy-dialog';
import { AssignExistingConfigurationOrCopyDialogResult } from './assign-existing-configuration-or-copy-dialog';
import type { AssignConfigurationDialogService } from './assign-configuration-dialog';
import type { CalculationApiService } from '../../../core/data-access/calculation-api.service';
import { mergePartially } from 'merge-partially';
import type { SelectedConfigurationRow } from '../../../core/state/process-state/process-state.model';

interface MockOverrides {
  mockProcessStateFacadeService: Partial<ProcessStateFacadeService>;
  mockCopyConfigurationWithUpdatedOverridesDialogService: Partial<CopyConfigurationWithUpdatedOverridesDialogService>;
  mockCopyConfigurationToExistingCalculationDialogService: Partial<CopyConfigurationToExistingCalculationDialogService>;
  mockAssignConfigurationSearchDialogService: Partial<AssignConfigurationSearchDialogService>;
  mockAssignExistingConfigurationOrCopyDialogService: Partial<AssignExistingConfigurationOrCopyDialogService>;
  mockAssignConfigurationDialogService: Partial<AssignConfigurationDialogService>;
  mockCalculationApiService: Partial<CalculationApiService>;
}

const mockConfiguration = createConfigurationPresentation();
const mockMat017Item = mockConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0];

const mockHaveMat017ItemsOverridesChangedResponseWithChanges: HaveMat017ItemsOverridesChangedResponseDto = {
  hasAmountDividedByPriceUnitChanged: true,
  hasInvalidOrRemovedItems: false,
  configurations: [
    {
      id: mockConfiguration.id,
      matNumber: mockConfiguration.matNumber,
      mat017ItemsChanges: [
        {
          matNumber: mockMat017Item.matNumber,
          itemDescription1: mockMat017Item.itemDescription1,
          itemDescription2: mockMat017Item.itemDescription2,
          currentOverrides: {
            amountDividedByPriceUnit: 2,
            mat017ItemGroup: 'RC-K8',
          },
          newOverrides: {
            amountDividedByPriceUnit: 7,
            mat017ItemGroup: 'RC-K8',
          },
          usedInPinAssignment: false,
          usedInSketch: false,
          itemStatus: Mat017ItemStatus.active,
        },
      ],
    },
  ],
};

const mockHaveMat017ItemsOverridesChangedResponseWithoutChanges: HaveMat017ItemsOverridesChangedResponseDto = {
  hasAmountDividedByPriceUnitChanged: true,
  hasInvalidOrRemovedItems: false,
  configurations: [
    {
      id: mockConfiguration.id,
      matNumber: mockConfiguration.matNumber,
      mat017ItemsChanges: [],
    },
  ],
};

const createSelectedConfigurationRow = (configuration: ConfigurationPresentation): SelectedConfigurationRow => {
  return {
    id: configuration.id,
    matNumber: configuration.matNumber,
    labelingLeft: configuration.labelingLeft,
    labelingRight: configuration.labelingRight,
    description: configuration.description,
  };
};

const createMockService = (
  override?: Partial<MockOverrides>
): { service: CopyOrAssignConfigurationDialogWorkflowService; mocks: MockOverrides } => {
  const defaultMocks: MockOverrides = {
    mockProcessStateFacadeService: {
      selectedConfigurationData$: of(mockConfiguration),
    },
    mockCopyConfigurationWithUpdatedOverridesDialogService: {
      open: jest.fn(),
      mapToMat017ItemsWithOutdatedPrices: jest.fn(),
    },
    mockCopyConfigurationToExistingCalculationDialogService: {
      open: jest.fn().mockReturnValue(of({})),
    },
    mockAssignConfigurationSearchDialogService: {
      open: jest
        .fn()
        .mockReturnValue(
          of(AssignConfigurationSearchDialogResult.create(null, AssignOrCopyConfigurationActionsEnum.cancel))
        ),
    },
    mockAssignExistingConfigurationOrCopyDialogService: {
      open: jest.fn().mockReturnValue(of({})),
    },
    mockAssignConfigurationDialogService: {
      open: jest.fn().mockReturnValue(of({})),
    },
    mockCalculationApiService: {
      haveMat017ItemsOverridesChanged: jest
        .fn()
        .mockReturnValue(of(mockHaveMat017ItemsOverridesChangedResponseWithChanges)),
    },
  };

  const mocks = mergePartially.deep(defaultMocks, override);

  const {
    mockProcessStateFacadeService,
    mockCopyConfigurationWithUpdatedOverridesDialogService,
    mockCopyConfigurationToExistingCalculationDialogService,
    mockAssignConfigurationSearchDialogService,
    mockAssignExistingConfigurationOrCopyDialogService,
    mockAssignConfigurationDialogService,
    mockCalculationApiService,
  } = mocks;

  const service = new CopyOrAssignConfigurationDialogWorkflowService(
    mockProcessStateFacadeService as ProcessStateFacadeService,
    mockCopyConfigurationWithUpdatedOverridesDialogService as CopyConfigurationWithUpdatedOverridesDialogService,
    mockCopyConfigurationToExistingCalculationDialogService as CopyConfigurationToExistingCalculationDialogService,
    mockAssignConfigurationSearchDialogService as AssignConfigurationSearchDialogService,
    mockAssignExistingConfigurationOrCopyDialogService as AssignExistingConfigurationOrCopyDialogService,
    mockAssignConfigurationDialogService as AssignConfigurationDialogService,
    mockCalculationApiService as CalculationApiService
  );

  return { service, mocks };
};

describe('CopyOrAssignConfigurationDialogWorkflowService', () => {
  describe('searching for configuration', () => {
    it('should open AssignConfigurationSearchDialogComponent', () => {
      const { service, mocks } = createMockService();

      service.start();
      expect(mocks.mockAssignConfigurationSearchDialogService.open).toHaveBeenCalledWith(
        createSelectedConfigurationRow(mockConfiguration)
      );
    });
  });

  describe('choosing to assign or copy configuration', () => {
    describe('when selected a configuration', () => {
      it('should open AssignExistingConfigurationOrCopyDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
        });

        service.start();
        expect(mocks.mockAssignExistingConfigurationOrCopyDialogService.open).toHaveBeenCalledWith(
          mockConfiguration.matNumber
        );
      });
    });

    describe('when canceled dialog', () => {
      it('should not open AssignExistingConfigurationOrCopyDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.cancel
                  )
                )
              ),
          },
        });

        service.start();
        expect(mocks.mockAssignExistingConfigurationOrCopyDialogService.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('choosing current or new overrides', () => {
    describe('when selected to copy', () => {
      describe('and configuration has updated overrides', () => {
        it('should open CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
          const { service, mocks } = createMockService({
            mockAssignConfigurationSearchDialogService: {
              open: jest
                .fn()
                .mockReturnValue(
                  of(
                    AssignConfigurationSearchDialogResult.create(
                      createSelectedConfigurationRow(mockConfiguration),
                      AssignOrCopyConfigurationActionsEnum.assignConfiguration
                    )
                  )
                ),
            },
            mockAssignExistingConfigurationOrCopyDialogService: {
              open: jest
                .fn()
                .mockReturnValue(
                  of(
                    AssignExistingConfigurationOrCopyDialogResult.create(
                      AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation
                    )
                  )
                ),
            },
          });

          service.start();
          expect(mocks.mockCalculationApiService.haveMat017ItemsOverridesChanged).toHaveBeenCalledWith({
            configurationIds: [mockConfiguration.id],
          });
          expect(mocks.mockCopyConfigurationWithUpdatedOverridesDialogService.open).toHaveBeenCalled();
        });
      });
      describe('and configuration has no updated overrides', () => {
        it('should not open CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
          const { service, mocks } = createMockService({
            mockAssignConfigurationSearchDialogService: {
              open: jest
                .fn()
                .mockReturnValue(
                  of(
                    AssignConfigurationSearchDialogResult.create(
                      createSelectedConfigurationRow(mockConfiguration),
                      AssignOrCopyConfigurationActionsEnum.assignConfiguration
                    )
                  )
                ),
            },
            mockAssignExistingConfigurationOrCopyDialogService: {
              open: jest
                .fn()
                .mockReturnValue(
                  of(
                    AssignExistingConfigurationOrCopyDialogResult.create(
                      AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation
                    )
                  )
                ),
            },
            mockCalculationApiService: {
              haveMat017ItemsOverridesChanged: jest
                .fn()
                .mockReturnValue(of({ mockHaveMat017ItemsOverridesChangedResponseWithoutChanges })),
            },
          });

          service.start();

          expect(mocks.mockCalculationApiService.haveMat017ItemsOverridesChanged).toHaveBeenCalledWith({
            configurationIds: [mockConfiguration.id],
          });
          expect(mocks.mockCopyConfigurationWithUpdatedOverridesDialogService.open).not.toHaveBeenCalled();
        });
      });
    });

    describe('when selected to assign', () => {
      it('should not open CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
          mockAssignExistingConfigurationOrCopyDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignExistingConfigurationOrCopyDialogResult.create(
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
        });

        service.start();
        expect(mocks.mockCalculationApiService.haveMat017ItemsOverridesChanged).not.toHaveBeenCalled();
        expect(mocks.mockCopyConfigurationWithUpdatedOverridesDialogService.open).not.toHaveBeenCalled();
      });
    });

    describe('when canceled dialog', () => {
      it('should not open CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
          mockAssignExistingConfigurationOrCopyDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(AssignExistingConfigurationOrCopyDialogResult.create(AssignOrCopyConfigurationActionsEnum.cancel))
              ),
          },
        });

        service.start();
        expect(mocks.mockCalculationApiService.haveMat017ItemsOverridesChanged).not.toHaveBeenCalledWith();
        expect(mocks.mockCopyConfigurationWithUpdatedOverridesDialogService.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('providing configuration data', () => {
    describe('when confirmed to copy', () => {
      it('should open CopyConfigurationToExistingCalculationDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
          mockAssignExistingConfigurationOrCopyDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignExistingConfigurationOrCopyDialogResult.create(
                    AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation
                  )
                )
              ),
          },
          mockCopyConfigurationWithUpdatedOverridesDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(CopyWithUpdatedOverridesResult.create(AssignOrCopyConfigurationActionsEnum.copyWithPriceUpdates))
              ),
            mapToMat017ItemsWithOutdatedPrices: jest.fn(),
          },
        });

        service.start();
        expect(mocks.mockCopyConfigurationToExistingCalculationDialogService.open).toHaveBeenCalledWith({
          updatePrices: true,
          selectedConfiguration: createSelectedConfigurationRow(mockConfiguration),
        });
      });
    });

    describe('when confirmed to assign', () => {
      it('should open AssignConfigurationDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
          mockAssignExistingConfigurationOrCopyDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignExistingConfigurationOrCopyDialogResult.create(
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
          mockCopyConfigurationWithUpdatedOverridesDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(CopyWithUpdatedOverridesResult.create(AssignOrCopyConfigurationActionsEnum.copyWithPriceUpdates))
              ),
            mapToMat017ItemsWithOutdatedPrices: jest.fn(),
          },
        });

        service.start();
        expect(mocks.mockAssignConfigurationDialogService.open).toHaveBeenCalled();
      });
    });

    describe('when canceled dialog', () => {
      it('should not open any dialogs', () => {
        const { service, mocks } = createMockService({
          mockAssignConfigurationSearchDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignConfigurationSearchDialogResult.create(
                    createSelectedConfigurationRow(mockConfiguration),
                    AssignOrCopyConfigurationActionsEnum.assignConfiguration
                  )
                )
              ),
          },
          mockAssignExistingConfigurationOrCopyDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  AssignExistingConfigurationOrCopyDialogResult.create(
                    AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation
                  )
                )
              ),
          },
          mockCopyConfigurationWithUpdatedOverridesDialogService: {
            open: jest
              .fn()
              .mockReturnValue(of(CopyWithUpdatedOverridesResult.create(AssignOrCopyConfigurationActionsEnum.cancel))),
            mapToMat017ItemsWithOutdatedPrices: jest.fn(),
          },
        });

        service.start();
        expect(mocks.mockAssignConfigurationDialogService.open).not.toHaveBeenCalled();
        expect(mocks.mockCopyConfigurationToExistingCalculationDialogService.open).not.toHaveBeenCalledWith();
      });
    });
  });
});
