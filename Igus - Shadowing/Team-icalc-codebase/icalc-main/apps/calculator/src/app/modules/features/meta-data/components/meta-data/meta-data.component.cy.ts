import { TestBed } from '@angular/core/testing';
import { MetaDataComponent } from './meta-data.component';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { CalculationApiService } from '@icalc/frontend/app/modules/core/data-access/calculation-api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CopyOrAssignConfigurationDialogWorkflowService } from '@icalc/frontend/app/modules/shared/components';

describe(MetaDataComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            setCurrentStep: (): void => {},
            setMainCssClass: (): void => {},
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            isSavingSingleCableCalculation$: (): void => {},
            selectedTabIndex$: (): Observable<object> => of({}),
            selectedCalculationItem$: (): Observable<object> => of({}),
            selectedConfigurationItem$: (): Observable<object> => of({}),
            selectedSingleCableCalculation$: (): Observable<object> => of({}),
            currentSelectedConfigurationIdSnapshot: (): void => {},
            hasCreatedConfigurationForExistingCalculationSuccessfully$: (): Observable<boolean> => of(true),
            hasCreatedNewCalculationAndConfigurationSuccessfully$: (): Observable<boolean> => of(true),
            enteringMetaDataPageStarted: (): void => {},
            enteringMetaDataPageEntered: (): void => {},
            isLocked$: of(false),
            metaDataViewModel$: of({}),
          },
        },
        {
          provide: CalculationApiService,
          useValue: {
            haveMat017ItemsOverridesChanged: () => {},
          },
        },
        {
          provide: MatDialog,
          useValue: {
            dialog: of(null),
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            dialogRef: of(null),
          },
        },
        {
          provide: CopyOrAssignConfigurationDialogWorkflowService,
          useValue: {
            start: () => {},
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(MetaDataComponent);
  });
});
