import { TestBed } from '@angular/core/testing';
import type { ActionContext } from '@ngxs/store';
import { Actions, NgxsModule, Store, ofActionDispatched } from '@ngxs/store';
import { ProcessState } from './process.state';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationApiService } from '../../data-access/configuration-api.service';
import { CalculationApiService } from '../../data-access/calculation-api.service';
import type {
  CalculationPresentation,
  ConfigurationPresentation,
  ProcessManyResult,
  SingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createSingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import { AppState } from '../app-state/app.state';
import { Api } from '../actions/api';
import { AssignConfigurationDialog } from '../actions/assign-configuration-dialog';
import type { ProcessStateModel } from './process-state.model';
import { ProcessApiService } from '../../data-access/process-api.service';
import { CopyConfigurationToExistingCalculationDialog } from '../actions/copy-configuration-to-existing-calculation-dialog';
import { provideHttpClient, withInterceptorsFromDi, HttpErrorResponse } from '@angular/common/http';

describe('ProcessState', () => {
  let configurationApiService: Partial<ConfigurationApiService>;
  let calculationApiService: Partial<CalculationApiService>;
  let processApiService: Partial<ProcessApiService>;
  let actions$: Observable<ActionContext>;
  let store: Store;

  const matNumber = 'mat-test';
  const newMatNumber = 'mat-test';

  const duplicationSubmittedReq = {
    configurationId: 'uuid-1',
    newMatNumber,
    createdBy: 'test',
    calculationId: 'uuid-2',
    batchSize: 1,
    chainflexLength: 1,
  };

  const testSingleCableCalculation: SingleCableCalculationPresentation = {
    ...createSingleCableCalculationPresentation(),
    assignmentDate: new Date('2023-07-16'),
  };
  const testConfiguration: ConfigurationPresentation = createConfigurationPresentation();
  const testCalculation: CalculationPresentation = createCalculationPresentation();

  beforeEach(async () => {
    configurationApiService = {
      findByNumber: jest.fn(),
    };

    calculationApiService = {
      copyConfigurationToExistingCalculation: jest.fn(),
      assignConfigurationToExistingCalculation: jest.fn(),
      haveMat017ItemsOverridesChanged: jest.fn().mockReturnValue(of(null)),
    };

    processApiService = {
      process: jest.fn().mockReturnValue(of(null)),
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProcessState, AppState]), TranslateModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: ConfigurationApiService, useValue: configurationApiService },
        { provide: CalculationApiService, useValue: calculationApiService },
        { provide: ProcessApiService, useValue: processApiService },
      ],
    });

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
  });

  describe('CopyingConfigurationToExistingCalculation', () => {
    describe('CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted', () => {
      it('should call findByNumber on Submitted action', () => {
        (configurationApiService.findByNumber as jest.Mock).mockReturnValue(of({ matNumber }));

        store.dispatch(
          new CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted(
            duplicationSubmittedReq
          )
        );
        expect(configurationApiService.findByNumber).toHaveBeenCalledWith(newMatNumber);
      });

      it('should not dispatch validation actions on HttpError', () => {
        (configurationApiService.findByNumber as jest.Mock).mockReturnValue(of(new HttpErrorResponse({})));
        (calculationApiService.copyConfigurationToExistingCalculation as jest.Mock).mockReturnThis();

        store.dispatch(
          new CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted(
            duplicationSubmittedReq
          )
        );

        expect(configurationApiService.findByNumber).toHaveBeenCalledWith(newMatNumber);
        expect(calculationApiService.copyConfigurationToExistingCalculation).not.toHaveBeenCalled();
      });

      it('should dispatch ValidationFailed action when findByNumber returns a non-null value', (done) => {
        const mockResponse = { matNumber };

        (configurationApiService.findByNumber as jest.Mock).mockReturnValue(of(mockResponse));

        actions$
          .pipe(ofActionDispatched(Api.CopyingConfigurationToExistingCalculation.ValidationFailed))
          .subscribe(() => {
            done();
          });

        store.dispatch(
          new CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted(
            duplicationSubmittedReq
          )
        );
      });
      it('should dispatch Validated action when findByNumber returns undefined', (done) => {
        (configurationApiService.findByNumber as jest.Mock).mockReturnValue(of(undefined));
        (calculationApiService.copyConfigurationToExistingCalculation as jest.Mock).mockReturnValue(of(null));

        actions$
          .pipe(ofActionDispatched(Api.CopyingConfigurationToExistingCalculation.Validated))
          .subscribe((action) => {
            expect(action.payload).toEqual(duplicationSubmittedReq);
            done();
          });

        store.dispatch(
          new CopyConfigurationToExistingCalculationDialog.CopyingConfigurationToExistingCalculation.Submitted(
            duplicationSubmittedReq
          )
        );
      });
    });

    describe('Api.DuplicatingConfigurationInsideExistingCalculation.Succeeded', () => {
      it('should update state with new configuration and singleCableCalculation on Succeeded action', () => {
        const appStateKey = 'AppState';
        const defaultSingleCableCalculation: SingleCableCalculationPresentation = {
          batchSize: 1,
          chainflexLength: 1,
          id: 'testSCC1',
          calculationFactor: 1,
          configuration: testConfiguration,
          calculation: testCalculation,
          assignedBy: null,
          commercialWorkStepOverrides: {},
          assignmentDate: new Date(),
          configurationId: testConfiguration.id,
          calculationId: testCalculation.id,
          calculationNumber: testCalculation.calculationNumber,
        };

        defaultSingleCableCalculation.calculation.singleCableCalculations = [
          ...defaultSingleCableCalculation.calculation.singleCableCalculations,
          defaultSingleCableCalculation,
        ];
        defaultSingleCableCalculation.configuration.singleCableCalculations = [
          ...defaultSingleCableCalculation.configuration.singleCableCalculations,
          defaultSingleCableCalculation,
        ];

        const oldState = store.selectSnapshot(ProcessState);
        const appState = store.snapshot();

        store.reset({
          ...appState,
          [appStateKey]: {
            currentStep: {
              label: 'results',
              route: '/app/results',
              isVisible: true,
              isDisabled: false,
            },
          },
        });

        store.dispatch(new Api.CopyingConfigurationToExistingCalculation.Succeeded(defaultSingleCableCalculation));

        const newState = store.selectSnapshot(ProcessState);

        expect(newState.selectedSingleCableCalculationId).toBe(defaultSingleCableCalculation.id);
        expect(newState.entities.calculations.ids.length).toBeGreaterThan(oldState.entities.calculations.ids.length);
        expect(newState.entities.singleCableCalculations.ids[0]).toEqual(defaultSingleCableCalculation.id);
        expect(newState.entities.calculations.items[testCalculation.id]).toEqual({
          ...defaultSingleCableCalculation.calculation,
          singleCableCalculations: [
            {
              id: defaultSingleCableCalculation.id,
            },
          ],
        });
      });
    });
  });

  describe('LinkingExistingConfigurationToExistingCalculation', () => {
    const appStateKey = 'AppState';
    const processStateKey = 'ProcessState';

    const submittedPayload = {
      configurationId: 'uuid-1',
      singleCableCalculationBaseData: {
        batchSize: 1,
        chainflexLength: 2,
      },
    };

    const userFirstName = 'test';
    const userLastName = 'user';
    const newSingleCableCalculation = {
      ...testSingleCableCalculation,
      assignmentDate: new Date('2023-07-17'),
      id: 'testSCC2',
      commercialWorkStepOverrides: {
        einkaufDispo: 5,
        projektierung: 5,
      },
      calculationId: testCalculation.id,
      configurationId: testConfiguration.id,
      matNumber: testConfiguration.matNumber,
      calculationNumber: testCalculation.calculationNumber,
    };

    const assignConfigurationToExistingCalculationSuccessResponse = {
      ...newSingleCableCalculation,
      calculation: {
        ...testCalculation,
        singleCableCalculations: [
          {
            ...testSingleCableCalculation,
            id: 'uuid-config',
            matNumber: 'linked-config-mat',
            calculationId: testCalculation.id,
            configurationId: 'linked-config-id',
            calculationNumber: testCalculation.calculationNumber,
          },
          { ...newSingleCableCalculation },
        ],
      },
      configuration: {
        ...testConfiguration,
        singleCableCalculations: [
          {
            ...testSingleCableCalculation,
            calculationId: testCalculation.id,
            configurationId: testConfiguration.id,
            calculationNumber: 'exampleCalculationNumber2',
            matNumber: testConfiguration.matNumber,
          },
          { ...newSingleCableCalculation },
        ],
      },
    };

    beforeEach(() => {
      const stateSnapshot = store.snapshot();

      store.reset({
        ...stateSnapshot,
        [processStateKey]: {
          ...stateSnapshot.ProcessState,
          selectedSingleCableCalculationId: newSingleCableCalculation.id,
          entities: {
            singleCableCalculations: {
              items: {
                [testSingleCableCalculation.id]: {
                  ...testSingleCableCalculation,
                  calculationId: testCalculation.id,
                },
                [assignConfigurationToExistingCalculationSuccessResponse.id]: {
                  ...assignConfigurationToExistingCalculationSuccessResponse,
                },
              },
            },
            configurations: {
              items: {},
            },
            calculations: {
              items: {},
            },
          },
        },
        [appStateKey]: {
          currentStep: {},
          userData: {
            firstName: userFirstName,
            lastName: userLastName,
          },
        },
      });
    });

    describe('AssignConfigurationDialog.AssigningConfigurationToExistingCalculation.Submitted', () => {
      it('should call assignConfigurationToExistingCalculation method on Submitted action and dont dispatch further actions if request failed', () => {
        const failResponse = null;

        (calculationApiService.assignConfigurationToExistingCalculation as jest.Mock).mockReturnValue(of(failResponse));
        const oldStateSnapshot = store.snapshot();

        store.dispatch(
          new AssignConfigurationDialog.AssigningConfigurationToExistingCalculation.Submitted(submittedPayload)
        );

        expect(calculationApiService.assignConfigurationToExistingCalculation).toHaveBeenCalledWith({
          ...submittedPayload,
          calculationId: testCalculation.id,
        });

        // if no further actions were dispatched, nothing has changed in the state
        const newStateSnapshot = store.snapshot();

        expect(oldStateSnapshot).toEqual(newStateSnapshot);
      });

      it('should call assignConfigurationToExistingCalculation method on Submitted action and dispatch Succeeded action if request was successful', (done) => {
        (calculationApiService.assignConfigurationToExistingCalculation as jest.Mock).mockReturnValue(
          of({
            ...assignConfigurationToExistingCalculationSuccessResponse,
          })
        );

        actions$
          .pipe(ofActionDispatched(Api.AssigningConfigurationToExistingCalculation.Succeeded))
          .subscribe((action) => {
            expect(action.payload).toEqual(assignConfigurationToExistingCalculationSuccessResponse);
            done();
          });

        store.dispatch(
          new AssignConfigurationDialog.AssigningConfigurationToExistingCalculation.Submitted(submittedPayload)
        );

        expect(calculationApiService.assignConfigurationToExistingCalculation).toHaveBeenCalledWith({
          ...submittedPayload,
          calculationId: testCalculation.id,
        });
      });
    });

    describe('Api.LinkingExistingConfigurationToExistingCalculation.Succeeded', () => {
      it('should update state when Succeeded action was dispatched', () => {
        store.dispatch(
          new Api.AssigningConfigurationToExistingCalculation.Succeeded(
            assignConfigurationToExistingCalculationSuccessResponse
          )
        );

        const processState: ProcessStateModel = store.selectSnapshot(ProcessState);
        const {
          id: newSccId,
          configuration: { id: newConfigurationId },
        } = assignConfigurationToExistingCalculationSuccessResponse;

        expect(processState.entities.singleCableCalculations.items[newSccId].id).toEqual(newSccId);

        expect(processState.entities.configurations.items[newConfigurationId].state.workStepOverrides).toEqual({
          consignment: 2,
          crimp: 4,
          sendTestReport: 1,
        });
        expect(processState.entities.singleCableCalculations.items[newSccId].commercialWorkStepOverrides).toEqual({
          ...newSingleCableCalculation.commercialWorkStepOverrides,
        });
      });

      it('should append a new SingleCableCalculation to singleCableCalculations array for calculations and configurations entities in state upon Succeeded action', () => {
        store.dispatch(
          new Api.AssigningConfigurationToExistingCalculation.Succeeded(
            assignConfigurationToExistingCalculationSuccessResponse
          )
        );

        const processState: ProcessStateModel = store.selectSnapshot(ProcessState);
        const {
          id: newSccId,
          configurationId,
          calculationId,
        } = assignConfigurationToExistingCalculationSuccessResponse;

        expect(processState.entities.configurations.items[configurationId].singleCableCalculations[1].id).toEqual(
          newSingleCableCalculation.id
        );
        expect(processState.entities.singleCableCalculations.items[newSccId].id).toEqual(newSingleCableCalculation.id);
        expect(processState.entities.calculations.items[calculationId].singleCableCalculations[1].id).toEqual(
          newSingleCableCalculation.id
        );
      });

      it('should reprocess calculation when Succeeded dispatched from results page', () => {
        const stateSnapshot = store.snapshot();
        const result: ProcessManyResult = null;

        const processPayload = {
          calculationId: testCalculation.id,
          singleCableCalculationIds: ['uuid-config', newSingleCableCalculation.id],
        };

        // prepare state to imitate being on results page
        store.reset({
          ...stateSnapshot,
          [appStateKey]: {
            currentStep: {
              label: 'results',
              route: '/app/results',
              isVisible: true,
              isDisabled: false,
            },
          },
        });

        (processApiService.process as jest.Mock).mockReturnValue(of(result));

        store.dispatch(
          new Api.AssigningConfigurationToExistingCalculation.Succeeded(
            assignConfigurationToExistingCalculationSuccessResponse
          )
        );

        expect(processApiService.process).toHaveBeenCalledWith({
          ...processPayload,
        });
      });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
