import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalculationSearchComponent } from './calculation-search.component';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';
import { SearchStateFacadeService } from '@icalc/frontend/app/modules/core/state/search-state/search-state-facade.service';
import { RouterModule } from '@angular/router';

describe('CalculationSearchComponent', () => {
  let component: CalculationSearchComponent;
  let fixture: ComponentFixture<CalculationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [CalculationSearchComponent],
      schemas: [NO_ERRORS_SCHEMA],
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

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationSearchComponent);
    component = fixture.componentInstance;
    component.selectedIndexChange$ = of(1);
    component.calculationSearchForm.form.setControl('searchCalculation', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
