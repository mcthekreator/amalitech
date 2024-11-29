import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationSearchComponent } from './configuration-search.component';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';
import { SearchStateFacadeService } from '../../../core/state/search-state/search-state-facade.service';
import { RouterModule } from '@angular/router';

describe('ConfigurationSearchComponent', () => {
  let component: ConfigurationSearchComponent;
  let fixture: ComponentFixture<ConfigurationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ConfigurationSearchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ProcessStateFacadeService,
          useValue: {
            selectedIndexChange$: of(null),
            updateCurrentCalculation: (): void => {},
            currentSelectedConfigurationIdSnapshot: (): void => {},
            currentSelectedCalculationIdSnapshot: (): void => {},
            fetchAndSetRelatedSingleCableCalculationItems: (): void => {},
            updateRelatedItems: (): void => {},
            resetCurrentCalculationAndConfiguration: (): void => {},
            searchConfiguration: (): void => {},
            executeConfigurationFilter: (): void => {},
            configurationListInformation$: (): Observable<object> => of({}),
            configurationItems$: (): Observable<object> => of({}),
            configurationTotalCount$: (): Observable<object> => of({}),
            configurationSearchError$: (): Observable<object> => of({}),
            noConfigurationItemsFound$: (): Observable<object> => of({}),
            isLoadingConfigurationItems$: (): Observable<object> => of({}),
            selectedConfigurationItem$: (): Observable<object> => of({}),
          },
        },
        {
          provide: SearchStateFacadeService,
          useValue: {
            configurationListInformation$: of({}),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSearchComponent);
    component = fixture.componentInstance;
    component.selectedIndexChange$ = of(1);
    component.configurationSearchForm.form.setControl('searchConfiguration', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
