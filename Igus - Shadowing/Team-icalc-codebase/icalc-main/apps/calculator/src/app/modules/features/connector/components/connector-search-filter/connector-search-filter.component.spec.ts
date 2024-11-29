import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RouterModule } from '@angular/router';
import { ConnectorSearchFilterComponent } from '@icalc/frontend/modules/features/connector/components/connector-search-filter/connector-search-filter.component';
import type { Mat017ItemListFilter } from '@igus/icalc-domain';
import { TranslateGermanPipe } from '@icalc/frontend/app/modules/shared/pipes/translate-to-german.pipe';

describe('ConnectorSearchFilterComponent', () => {
  let component: ConnectorSearchFilterComponent;
  let fixture: ComponentFixture<ConnectorSearchFilterComponent>;
  let connectorStateFacadeService: ConnectorStateFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ConnectorSearchFilterComponent, TranslateGermanPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ConnectorStateFacadeService,
          useValue: {
            getMat017ItemsOfConnectorWithWidenData: (): void => {},
            getListInformationSnapshot: (): void => {},
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            isLocked$: of(false),
            selectedConfigurationData$: of(null),
          },
        },
        {
          provide: ChainflexStateFacadeService,
          useValue: { chainflexCable$: of(null) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorSearchFilterComponent);
    component = fixture.componentInstance;
    connectorStateFacadeService = TestBed.inject(ConnectorStateFacadeService);
    fixture.detectChanges();
    component.filterForm.options = { updateInitialValue: () => {}, resetModel: () => {} };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onValueChanges', () => {
    let patchValueSpy: jest.SpyInstance;

    beforeEach(() => {
      patchValueSpy = jest.spyOn(component.filterForm.form, 'patchValue');
    });

    it('should not adjust filters when both filters are enabled and showZeroMatches gets disabled', () => {
      const previous: Mat017ItemListFilter = { showZeroMatches: true, showOnlyManuallyCreated: true };
      const current: Mat017ItemListFilter = { showZeroMatches: false, showOnlyManuallyCreated: true };

      component.onValueChanges([previous, current]);

      expect(patchValueSpy).not.toHaveBeenCalled();
    });

    it('should enable showZeroMatches filter when both filters are disabled and showOnlyManuallyCreated gets enabled', () => {
      const previous: Mat017ItemListFilter = { showZeroMatches: false, showOnlyManuallyCreated: false };
      const current: Mat017ItemListFilter = { showZeroMatches: false, showOnlyManuallyCreated: true };

      component.onValueChanges([previous, current]);

      expect(patchValueSpy).toHaveBeenNthCalledWith(1, { showZeroMatches: true });
    });
  });

  describe('onRemoveFilter', () => {
    let getMat017ItemsOfConnectorWithWidenDataSpy: jest.SpyInstance;

    beforeEach(() => {
      getMat017ItemsOfConnectorWithWidenDataSpy = jest.spyOn(
        connectorStateFacadeService,
        'getMat017ItemsOfConnectorWithWidenData'
      );
    });

    it('should remove showOnlyManuallyCreated filter option from filterSource and filterForm and reload mat017 items of given page', () => {
      const filterToRemove: keyof Mat017ItemListFilter = 'showOnlyManuallyCreated';
      const filterState: Mat017ItemListFilter = (component.filterForm.model = {
        showZeroMatches: true,
        showOnlyManuallyCreated: true,
      });

      const expected: Partial<Mat017ItemListFilter> = { showZeroMatches: true };
      const which = (component.which = 'leftConnector');
      const filterInformation = (component.filterSource = filterState);

      component.onRemoveFilter(filterToRemove);

      expect(component.filterForm.model).toEqual(expected);
      expect(component.filterSource).toEqual(expected);
      expect(getMat017ItemsOfConnectorWithWidenDataSpy).toHaveBeenNthCalledWith(1, {
        which,
        filterInformation,
        listInformation: { skip: 0 },
      });
    });

    it('should remove showZeroMatches filter and reload mat017 items with remaining filters', () => {
      const filterToRemove: keyof Mat017ItemListFilter = 'showZeroMatches';
      const filterState: Mat017ItemListFilter = (component.filterForm.model = {
        showZeroMatches: true,
        showOnlyManuallyCreated: true,
      });

      const expected: Partial<Mat017ItemListFilter> = { showOnlyManuallyCreated: true };
      const which = (component.which = 'rightConnector');
      const filterInformation = (component.filterSource = filterState);

      component.onRemoveFilter(filterToRemove);

      expect(component.filterForm.model).toEqual(expected);
      expect(component.filterSource).toEqual(expected);
      expect(getMat017ItemsOfConnectorWithWidenDataSpy).toHaveBeenNthCalledWith(1, {
        which,
        filterInformation,
        listInformation: { skip: 0 },
      });
    });
  });

  describe('onApplyFilter', () => {
    let getMat017ItemsOfConnectorWithWidenDataSpy: jest.SpyInstance;

    beforeEach(() => {
      getMat017ItemsOfConnectorWithWidenDataSpy = jest.spyOn(
        connectorStateFacadeService,
        'getMat017ItemsOfConnectorWithWidenData'
      );
    });

    it('should reload mat017 items of given page with showOnlyManuallyCreated and showZeroMatches set to true', () => {
      const filterToApply: Mat017ItemListFilter = { showZeroMatches: true, showOnlyManuallyCreated: true };
      const which = (component.which = 'rightConnector');

      component.filterForm.model = filterToApply;

      component.onApplyFilter();

      expect(getMat017ItemsOfConnectorWithWidenDataSpy).toHaveBeenNthCalledWith(1, {
        which,
        filterInformation: filterToApply,
        listInformation: { skip: 0 },
      });
    });

    it('should reload mat017 items of given page with showOnlyManuallyCreated set to false and showZeroMatches set to true', () => {
      const filterToApply: Mat017ItemListFilter = { showZeroMatches: true, showOnlyManuallyCreated: false };
      const which = (component.which = 'rightConnector');

      component.filterForm.model = filterToApply;

      component.onApplyFilter();

      expect(getMat017ItemsOfConnectorWithWidenDataSpy).toHaveBeenNthCalledWith(1, {
        which,
        filterInformation: filterToApply,
        listInformation: { skip: 0 },
      });
    });
  });
});
