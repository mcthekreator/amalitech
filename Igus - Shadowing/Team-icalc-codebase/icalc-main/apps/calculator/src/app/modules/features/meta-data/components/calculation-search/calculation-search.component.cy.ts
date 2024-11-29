import { TestBed } from '@angular/core/testing';
import { CalculationSearchComponent } from './calculation-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { SearchStateFacadeService } from '@icalc/frontend/app/modules/core/state/search-state/search-state-facade.service';

describe(CalculationSearchComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ProcessStateFacadeService,
          useValue: {
            selectedIndexChange$: of(null),
            updateCurrentCalculation: (): void => {},
            currentSelectedCalculationIdSnapshot: (): void => {},
            currentSelectedConfigurationIdSnapshot: (): void => {},
            updateRelatedItems: (): void => {},
            setCalculationAndSingleCableCalculation: (): void => {},
            resetCurrentCalculationAndConfiguration: (): void => {},
            searchCalculation: (): void => {},
            executeCalculationFilter: (): void => {},
            calculationListInformation$: (): Observable<object> => of({}),
            calculationItems$: (): Observable<object> => of({}),
            calculationTotalCount$: (): Observable<object> => of({}),
            calculationSearchError$: (): Observable<object> => of({}),
            noCalculationItemsFound$: (): Observable<object> => of({}),
            isLoadingCalculationItems$: (): Observable<object> => of({}),
            selectedCalculationItem$: (): Observable<object> => of({}),
          },
        },
        {
          provide: SearchStateFacadeService,
          useValue: {
            calculationListInformation$: of({}),
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(CalculationSearchComponent, {
      componentProperties: {
        selectedCalculationId: null,
      },
    });
  });
});
