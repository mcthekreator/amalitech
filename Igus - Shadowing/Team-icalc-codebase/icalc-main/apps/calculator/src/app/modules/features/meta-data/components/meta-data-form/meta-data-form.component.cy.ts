import { TestBed } from '@angular/core/testing';
import { MetaDataFormComponent } from './meta-data-form.component';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { GetConfigPropFromSccPipe } from '@icalc/frontend/app/modules/shared/pipes/get-config-prop-from-scc.pipe';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormatLengthWithFallBackPipe } from '@icalc/frontend/app/modules/shared/pipes/format-length-with-fallback';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormAsyncValidatorsService } from '@icalc/frontend/app/modules/shared/form-async-validators';
import type { AbstractControl } from '@angular/forms';

describe(MetaDataFormComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
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
        {
          provide: FormAsyncValidatorsService,
          useValue: {
            checkUniqueCalculationNumber: () => {
              return {
                expression: (_: AbstractControl): Observable<boolean> => {
                  return of(false);
                },
              };
            },
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(MetaDataFormComponent, {
      componentProperties: {
        selectedCalculationId: '',
        selectedConfigurationId: '',
        createNewConfiguration: false,
      },
    });
  });
});
