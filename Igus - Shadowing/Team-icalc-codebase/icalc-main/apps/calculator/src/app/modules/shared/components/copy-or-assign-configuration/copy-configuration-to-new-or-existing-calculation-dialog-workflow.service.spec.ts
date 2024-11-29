import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import type { ProcessStateFacadeService } from '../../../core/state/process-state/process-state-facade.service';
import type { CopyConfigurationToExistingCalculationDialogService } from './copy-configuration-to-existing-calculation-dialog';
import type { CopyConfigurationWithUpdatedOverridesDialogService } from './copy-configuration-with-updated-overrides-dialog';
import { mergePartially } from 'merge-partially';
import { CopyConfigurationToNewOrExistingCalculationDialogWorkflowService } from './copy-configuration-to-new-or-existing-calculation-dialog-workflow.service';
import type { CopyConfigurationOptionsDialogService } from './copy-configuration-options-dialog';
import { CopyConfigurationOptionsDialogResult } from './copy-configuration-options-dialog';
import type { CopyConfigurationToNewCalculationDialogService } from './copy-configuration-to-new-calculation-dialog';
import { of } from 'rxjs';
import { AssignOrCopyConfigurationActionsEnum } from './copy-configuration-model';

interface MockOverrides {
  mockProcessStateFacadeService: Partial<ProcessStateFacadeService>;
  mockCopyConfigurationOptionsDialogService: Partial<CopyConfigurationOptionsDialogService>;
  mockCopyConfigurationWithUpdatedOverridesDialogService: Partial<CopyConfigurationWithUpdatedOverridesDialogService>;
  mockCopyConfigurationToExistingCalculationDialogService: Partial<CopyConfigurationToExistingCalculationDialogService>;
  mockCopyConfigurationToNewCalculationDialogService: Partial<CopyConfigurationToNewCalculationDialogService>;
}

const mockSingleCableCalculation = createSingleCableCalculationPresentation({
  calculation: createCalculationPresentation(),
  configuration: createConfigurationPresentation(),
});

const createMockService = (
  override?: Partial<MockOverrides>
): { service: CopyConfigurationToNewOrExistingCalculationDialogWorkflowService; mocks: MockOverrides } => {
  const defaultMocks: MockOverrides = {
    mockProcessStateFacadeService: {
      selectedSingleCableCalculation$: of(mockSingleCableCalculation),
    },
    mockCopyConfigurationWithUpdatedOverridesDialogService: {
      open: jest.fn(),
      mapToMat017ItemsWithOutdatedPrices: jest.fn(),
    },
    mockCopyConfigurationToExistingCalculationDialogService: {
      open: jest.fn().mockReturnValue(of({})),
    },
    mockCopyConfigurationOptionsDialogService: {
      open: jest.fn().mockReturnValue(of({})),
    },
    mockCopyConfigurationToNewCalculationDialogService: {
      open: jest.fn().mockReturnValue(of({})),
    },
  };

  const mocks = mergePartially.deep(defaultMocks, override);

  const {
    mockProcessStateFacadeService,
    mockCopyConfigurationOptionsDialogService,
    mockCopyConfigurationWithUpdatedOverridesDialogService,
    mockCopyConfigurationToExistingCalculationDialogService,
    mockCopyConfigurationToNewCalculationDialogService,
  } = mocks;

  const service = new CopyConfigurationToNewOrExistingCalculationDialogWorkflowService(
    mockProcessStateFacadeService as ProcessStateFacadeService,
    mockCopyConfigurationOptionsDialogService as CopyConfigurationOptionsDialogService,
    mockCopyConfigurationWithUpdatedOverridesDialogService as CopyConfigurationWithUpdatedOverridesDialogService,
    mockCopyConfigurationToExistingCalculationDialogService as CopyConfigurationToExistingCalculationDialogService,
    mockCopyConfigurationToNewCalculationDialogService as CopyConfigurationToNewCalculationDialogService
  );

  return { service, mocks };
};

describe('CopyConfigurationToNewOrExistingCalculationDialogWorkflowService', () => {
  describe('choosing to copy to existing or new calculation', () => {
    it('should open CopyConfigurationOptionsDialogComponent', () => {
      const { service, mocks } = createMockService();

      service.start();

      expect(mocks.mockCopyConfigurationOptionsDialogService.open).toHaveBeenCalled();
    });

    describe('when selected to copy', () => {
      describe('and configuration has no updated overrides', () => {
        it('should not open CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
          const { service, mocks } = createMockService({
            mockCopyConfigurationOptionsDialogService: {
              open: jest
                .fn()
                .mockReturnValue(
                  of(
                    CopyConfigurationOptionsDialogResult.create(
                      AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation
                    )
                  )
                ),
            },
          });

          service.start();
          expect(mocks.mockCopyConfigurationWithUpdatedOverridesDialogService.open).not.toHaveBeenCalled();
        });
      });
    });

    describe('when canceled dialog', () => {
      it('should not open CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockCopyConfigurationOptionsDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(CopyConfigurationOptionsDialogResult.create(AssignOrCopyConfigurationActionsEnum.cancel))
              ),
          },
        });

        service.start();
        expect(mocks.mockCopyConfigurationWithUpdatedOverridesDialogService.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('providing configuration data', () => {
    describe('when selected copy to existing calculation', () => {
      it('should open CopyConfigurationToExistingCalculationDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockCopyConfigurationOptionsDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  CopyConfigurationOptionsDialogResult.create(
                    AssignOrCopyConfigurationActionsEnum.copyToExistingCalculation
                  )
                )
              ),
          },
        });

        service.start();

        expect(mocks.mockCopyConfigurationToNewCalculationDialogService.open).not.toHaveBeenCalled();
        expect(mocks.mockCopyConfigurationToExistingCalculationDialogService.open).toHaveBeenCalled();
      });
    });

    describe('when selected copy to new calculation', () => {
      it('should open CopyConfigurationToNewCalculationDialogComponent', () => {
        const { service, mocks } = createMockService({
          mockCopyConfigurationOptionsDialogService: {
            open: jest
              .fn()
              .mockReturnValue(
                of(
                  CopyConfigurationOptionsDialogResult.create(AssignOrCopyConfigurationActionsEnum.copyToNewCalculation)
                )
              ),
          },
        });

        service.start();

        expect(mocks.mockCopyConfigurationToExistingCalculationDialogService.open).not.toHaveBeenCalled();
        expect(mocks.mockCopyConfigurationToNewCalculationDialogService.open).toHaveBeenCalled();
      });
    });
  });
});
