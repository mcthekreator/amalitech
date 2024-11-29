import { TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { FilterWorkStepsByCategory } from '../../pipes/filter-work-steps-by-type.pipe';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { GetConfigPropFromSccPipe } from '@icalc/frontend/app/modules/shared/pipes/get-config-prop-from-scc.pipe';
import { PinAssignmentStateFacadeService } from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import type { ProcessResult } from '@igus/icalc-domain';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createProcessResult,
  createSingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import { createMockProcessState } from '@icalc/frontend/app/modules/core/utils';
import { CopyOrAssignConfigurationDialogWorkflowService } from '@icalc/frontend/app/modules/shared/components';

const newSccId = 'testSccId';
const newConfigId = 'testConfigId';
const newCalcId = 'testCalcId';
const description = 'sample Description';

const testConfig = createConfigurationPresentation({
  id: newConfigId,
  singleCableCalculations: [
    {
      id: newSccId,
    },
  ],
});

const testCalc = createCalculationPresentation({
  id: newCalcId,
  singleCableCalculations: [
    {
      id: newSccId,
    },
  ],
});

const testScc = createSingleCableCalculationPresentation({
  id: newSccId,
  configurationId: newConfigId,
  configuration: testConfig,
  calculationId: newCalcId,
  calculation: testCalc,
});

const processResult = createProcessResult({
  configurationReference: {
    configurationId: testConfig.id,
    sccId: testScc.id,
    matNumber: testConfig.matNumber,
    isValid: true,
    validationErrors: [],
    description,
  },
});

const processState = createMockProcessState(
  {
    selectedSingleCableCalculationId: newSccId,
    processResults: [
      {
        ...(processResult as ProcessResult),
      },
    ],
  },
  [testScc]
);

describe(ResultsComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => {},
          },
        },
        {
          provide: AppStateFacadeService,
          useValue: {
            previousStep$: of({
              label: '',
              route: '',
              isDisabled: false,
              isVisible: false,
            }),
            setMainCssClass: (): void => {},
            setCurrentStep: (): void => {},
            getUserName: (): void => {},
            getCalculationFactor: (): void => {},
            getMetaData: (): void => {},
            getProcessResult: (): void => {},
            getLabeling: (): void => {},
            getCustomerType: (): void => {},
            getWorkSteps: (): void => {},
            getLabelingLeft: (): void => {},
            getLabelingRight: (): void => {},
            getMetaDataChanged: (): void => {},
            getChangedMetaDataProperties: (): void => {},
          },
        },
        {
          provide: FilterWorkStepsByCategory,
        },
        {
          provide: ChainflexStateFacadeService,
          useValue: {
            getChainflexPartNumber: (): void => {},
            getChainflexLength: (): void => {},
            getChainflexPrice: (): void => {},
            getChainflexCable: (): void => {},
          },
        },
        {
          provide: ConnectorStateFacadeService,
          useValue: {
            getItemListSnapshot: (): [] => {
              return [];
            },
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            allResultsValid$: (): Observable<object> => of({}),
            calculationState$: (): Observable<object> => of({}),
            calculationTotalPrice$: (): Observable<object> => of({}),
            chainflexesAndPricesAvailable$: (): Observable<boolean> => of(true),
            chainflexPricesHaveChanged$: (): Observable<boolean> => of(false),
            changingWorkStepsSetsStarted: () => of(null),
            checkChainflexAndPriceExistence: (): Observable<object> => of({}),
            checkForNewChainflexPricesResult$: (): Observable<object> => of({}),
            showListOfInvalidOrRemovedMat017ItemInfo$: of(false),
            hasCheckedNewChainflexPricesAndMat017ItemsOverridesChangesSuccessfully$: () => of([]),
            hasInvalidOrRemovedItems$: (): Observable<boolean> => of(false),
            enteringResultsPageEntered: (): Observable<object> => of({}),
            exportExcelFile: (): Observable<object> => of({}),
            isProcessing$: (): Observable<boolean> => of(true),
            processServerError$: (): Observable<object> => of({}),
            processCalculation: (): Observable<object> => of({}),
            processState$: (): Observable<object> =>
              of({
                ...processState,
              }),
            selectedSingleCableCalculation$: of({ ...testScc }),
            relatedSingleCableCalculationsOfCalculation$: of([testScc]),
            selectedProcessResult$: of({ ...processResult }),
            informUserAboutWorkSteps$: (): Observable<object> => of({}),
            removeUserInformedAboutRemovedOverrides$: (): Observable<object> => of({}),
            isLocked$: of(false),
            processStateSnapshot: (): void => {},
            selectedConfigurationItemSnapshot: (): Observable<object> => of({}),
            relatedSingleCableCalculations$: (): Observable<object> => of({}),
            chainflexListWithNoPrices$: of([]),
            chainflexListWithNewPrices$: of([]),
            shouldInformAboutMissingChainflexPrices$: of(false),
            enteringResultsPageStarted: (): void => {},
            leavingResultsPageStarted: (): void => {},
            selectingSingleCableCalculationResultsStarted: (): void => {},
          },
        },
        {
          provide: GetConfigPropFromSccPipe,
          useValue: {
            transform: (): void => {},
          },
        },
        {
          provide: PinAssignmentStateFacadeService,
          useValue: { getBase64ImageSnapshot: (): void => {}, getPinAssignmentCalculationSnapshot: (): void => {} },
        },
        { provide: MatSnackBar, useValue: { open: (): void => {} } },
        {
          provide: LibraryStateFacadeService,
          useValue: { getSketchSnapshot: (): void => {}, updateCurrentCalculation: (): void => {} },
        },
        {
          provide: MatDialogRef,
          useValue: {
            dialogRef: of(null),
          },
        },
        {
          provide: CopyOrAssignConfigurationDialogWorkflowService,
          useValue: {},
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(ResultsComponent);
  });
});
