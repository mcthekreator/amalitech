import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';

import { MetaDataComponent } from './meta-data.component';
import { CalculationApiService } from '@icalc/frontend/app/modules/core/data-access/calculation-api.service';
import { RouterModule } from '@angular/router';

const calculationApiService = {
  haveMat017ItemsOverridesChanged: jest.fn(),
};

describe('MetaDataComponent', () => {
  let component: MetaDataComponent;
  let fixture: ComponentFixture<MetaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [MetaDataComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
          useValue: calculationApiService,
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaDataComponent);
    component = fixture.componentInstance;
    component.isLocked$ = of(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
