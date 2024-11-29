import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import type { PipeTransform } from '@angular/core';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { PinAssignmentStateFacadeService } from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ResultsComponent } from './results.component';
import { GetConfigPropFromSccPipe } from '@icalc/frontend/app/modules/shared/pipes/get-config-prop-from-scc.pipe';
import type { IcalcStep } from '@icalc/frontend/state/app-state/app-state.model';
import type { ProcessResult } from '@igus/icalc-domain';
import {
  createCalculationPresentation,
  createConfigurationPresentation,
  createProcessResult,
  createSingleCableCalculationPresentation,
  FileDownloadButtonsActionEnum,
  fileDownloadOptions,
  WorkStepCategory,
  WorkStepSet,
} from '@igus/icalc-domain';

import { FilterWorkStepsByCategory } from '@icalc/frontend/modules/features/results/pipes/filter-work-steps-by-type.pipe';
import {
  ConvertDecimalToDeStringPipe,
  ConvertPricePipe,
  ConvertToThreeDigitsPipe,
} from '@icalc/frontend/modules/shared/pipes/convert-decimal-to-de-string.pipe';

import { FormatLengthWithFallBackPipe } from '@icalc/frontend/app/modules/shared/pipes/format-length-with-fallback';
import { WorkStepHasOverridePipe } from '../../pipes/work-step-has-override.pipe';
import { createMockProcessState } from '@icalc/frontend/app/modules/core/utils';
import { ShouldHighlightWorkStepNamePipe } from '../../pipes/should-highlight-work-step-name.pipe';
import { TranslateService } from '@igus/kopla-app';
import { Mat017ItemsUpdateComponent } from '../mat017Item-update/mat017-items-update.component';
import { RouterModule } from '@angular/router';
import { TranslateGermanPipe } from '@icalc/frontend/app/modules/shared/pipes/translate-to-german.pipe';

const { spyOn } = jest;

@Pipe({ name: 'isArray' })
class IsArrayPipeMock implements PipeTransform {
  public transform(value: unknown): boolean {
    return Array.isArray(value);
  }
}

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  const newSccId = 'testSccId';
  const newConfigId = 'testConfigId';
  const newCalcId = 'testCalcId';

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
      description: testConfig.description,
      sccId: testScc.id,
      matNumber: testConfig.matNumber,
      isValid: true,
      validationErrors: [],
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

  const appStateFacadeService = {
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
  };

  const processStateFacadeService = {
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
  };

  const matDialogMock = {
    open: () => {
      jest.fn();
      return {
        afterClosed: () => of({ reset: undefined }),
      };
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [
        ResultsComponent,
        IsArrayPipeMock,
        ConvertPricePipe,
        ConvertToThreeDigitsPipe,
        FormatLengthWithFallBackPipe,
        ConvertDecimalToDeStringPipe,
        WorkStepHasOverridePipe,
        ShouldHighlightWorkStepNamePipe,
        Mat017ItemsUpdateComponent,
        TranslateGermanPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: MatDialog,
          useValue: matDialogMock,
        },
        {
          provide: AppStateFacadeService,
          useValue: appStateFacadeService,
        },
        {
          provide: FilterWorkStepsByCategory,
        },
        {
          provide: TranslateService,
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
          useValue: processStateFacadeService,
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
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit behaviour', () => {
    it('should dispatch EnteringResultsPage.Entered event', () => {
      const spy = spyOn(processStateFacadeService, 'enteringResultsPageEntered');

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should assign isProcessing$', () => {
      const spy = spyOn(processStateFacadeService, 'isProcessing$');

      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
      expect(component.isProcessing$).toBeInstanceOf(Observable<boolean>);
    });

    it('should set previousStep$ on ngOnInit', () => {
      const prevStep = appStateFacadeService.previousStep$;

      component.ngOnInit();
      expect(component.previousStep$).toBeInstanceOf(Observable<IcalcStep>);
      expect(component.previousStep$).toEqual(prevStep);
    });
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const spy = spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call xls version of exportExcelFile with prod plan config onExportProductionPlanExcel', () => {
    const spy = spyOn(processStateFacadeService, 'exportExcelFile');

    component.exportProductionPlanExcel(FileDownloadButtonsActionEnum.fullXLS);
    expect(spy).toHaveBeenCalledWith({
      productionPlan: true,
      selectedDownloadOption: fileDownloadOptions[FileDownloadButtonsActionEnum.fullXLS],
    });
  });
  it('should call xlsx version of exportExcelFile with prod plan config onExportProductionPlanExcel', () => {
    const spy = spyOn(processStateFacadeService, 'exportExcelFile');

    component.exportProductionPlanExcel(FileDownloadButtonsActionEnum.fullXLSX);
    expect(spy).toHaveBeenCalledWith({
      productionPlan: true,
      selectedDownloadOption: fileDownloadOptions[FileDownloadButtonsActionEnum.fullXLSX],
    });
  });

  it('should call exportExcelFile with calculation onExportCalculationExcel', () => {
    const spy = spyOn(processStateFacadeService, 'exportExcelFile');

    component.onExportCalculationExcel();
    expect(spy).toHaveBeenCalledWith({
      calculation: true,
      selectedDownloadOption: fileDownloadOptions[FileDownloadButtonsActionEnum.fullXLSX],
    });
  });

  it('should set editSectionName to null on onCancelSCCDataEdit', () => {
    component.editSectionName = 'technical';

    component.onCancelSCCDataEdit();
    expect(component.editSectionName).toBeNull();
  });

  describe('onCancelWorkStepsEdit behaviour', () => {
    it('should reset editSectionName to null on onCancelWorkStepsEdit call', () => {
      const spy = spyOn(processStateFacadeService, 'selectingSingleCableCalculationResultsStarted');

      component.onCancelWorkStepsEdit();
      expect(component.editSectionName).toBeNull();
      expect(spy).toHaveBeenCalled();
    });

    it('should reset currentlyEditedWorkStepsSccId to null on onCancelWorkStepsEdit call', () => {
      const spy = spyOn(processStateFacadeService, 'selectingSingleCableCalculationResultsStarted');

      component.onCancelWorkStepsEdit();
      expect(component.currentlyEditedWorkStepsSccId).toBeNull();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onEditWorkSteps behaviour', () => {
    it('should set editSectionName correctly on onEditWorkSteps call', () => {
      component.onEditWorkSteps(newSccId, WorkStepCategory.commercial);
      expect(component.editSectionName).toBe(WorkStepCategory.commercial);
    });

    it('should set currentlyEditedWorkStepsSccId correctly on onEditWorkSteps call', () => {
      component.onEditWorkSteps(newSccId, WorkStepCategory.commercial);
      expect(component.currentlyEditedWorkStepsSccId).toBe(newSccId);
    });
  });

  describe('onChangeWorkStepSet behaviour', () => {
    describe('user accepts reset', () => {
      it('should call changingWorkStepsSetsStarted if no technical work step overrides', () => {
        const spy = spyOn(processStateFacadeService, 'changingWorkStepsSetsStarted');

        component.technicalWorkStepOverrides = {};
        component.onChangeWorkStepSet('testSccId', WorkStepSet.standard);

        expect(spy).toHaveBeenCalled();
      });

      it('should call changingWorkStepsSetsStarted and resetWorkStepOverridesInFormById if user confirms reset', () => {
        component.technicalWorkStepOverrides = { assembly: 10 };

        const changingWorkStepsSetsStartedSpy = spyOn(processStateFacadeService, 'changingWorkStepsSetsStarted');
        const resetWorkStepOverridesInFormByIdSpy = spyOn<any, string>(component, 'resetWorkStepOverridesInFormById');

        spyOn(matDialogMock, 'open').mockReturnValue({
          afterClosed: () => of({ reset: true }),
        } as MatDialogRef<any, any>);

        component.onChangeWorkStepSet('testSccId', WorkStepSet.driveCliq);

        expect(changingWorkStepsSetsStartedSpy).toHaveBeenCalled();
        expect(resetWorkStepOverridesInFormByIdSpy).toHaveBeenCalledWith('testSccId', ['assembly']);
      });
    });

    describe('user cancels reset', () => {
      it('should not call changingWorkStepsSetsStarted or resetWorkStepOverridesInFormById if user cancels reset', () => {
        component.technicalWorkStepOverrides = { assembly: 10 };
        const changingWorkStepsSetsStartedSpy = spyOn(processStateFacadeService, 'changingWorkStepsSetsStarted');
        const resetWorkStepOverridesInFormByIdSpy = spyOn<any, string>(component, 'resetWorkStepOverridesInFormById');
        const workStepSetSelectFormPatchValueSpy = spyOn(component.workStepSetSelectForm, 'patchValue');

        spyOn(matDialogMock, 'open').mockReturnValue({
          afterClosed: () => of({ reset: false }),
        } as MatDialogRef<any, any>);

        component.onChangeWorkStepSet('testSccId', WorkStepSet.driveCliq);

        expect(changingWorkStepsSetsStartedSpy).not.toHaveBeenCalled();
        expect(resetWorkStepOverridesInFormByIdSpy).not.toHaveBeenCalled();
        expect(workStepSetSelectFormPatchValueSpy).toHaveBeenCalledWith(
          { workStepSet: WorkStepSet.standard },
          { emitEvent: false }
        );
      });
    });
  });
});
