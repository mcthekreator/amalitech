import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MetaDataFormComponent } from './meta-data-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FormatLengthWithFallBackPipe } from '@icalc/frontend/app/modules/shared/pipes/format-length-with-fallback';
import { GetConfigPropFromSccPipe } from '@icalc/frontend/app/modules/shared/pipes/get-config-prop-from-scc.pipe';
import { RouterModule } from '@angular/router';

describe('MetaDataFormComponent', () => {
  let component: MetaDataFormComponent;
  let fixture: ComponentFixture<MetaDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [MetaDataFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: AppStateFacadeService,
          useValue: {
            getUserName: (): void => {},
          },
        },
        {
          provide: GetConfigPropFromSccPipe,
          useValue: {
            transform: (): void => {},
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            currentSelectedConfigurationIdSnapshot: (): void => {},
            updateRelatedItems: (): void => {},
            updateSelectedSingleCableCalculation: (): void => {},
            setCalculationAndSingleCableCalculation: (): void => {},
            resetCurrentCalculationAndConfiguration: (): void => {},
            fetchAndSetRelatedSingleCableCalculationItemsForSelectedCalculationItem: (): void => {},
            removeOverrides: (): void => {},
            configurationItems$: (): Observable<object> => of({}),
            relatedCalculationItems$: (): Observable<object> => of({}),
            relatedSingleCableCalculations$: (): Observable<object> => of({}),
            selectedConfigurationItem$: (): Observable<object> => of({}),
            selectedCalculationItem$: (): Observable<object> => of({}),
            selectedSingleCableCalculation$: (): Observable<object> => of({}),
            copyingConfigurationToExistingCalculationResult$: (): Observable<object> => of({}),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            dialog: of(null),
          },
        },
        {
          provide: FormatLengthWithFallBackPipe,
          useValue: {
            transform: (): void => {},
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
