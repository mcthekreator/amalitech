import { ConnectorSearchFilterComponent } from './connector-search-filter.component';
import { AppStateFacadeService } from '../../../../core/state/app-state/app-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import type { ConnectorSide, IcalcListInformation, Mat017ItemListFilter } from '@igus/icalc-domain';
import { TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

describe(ConnectorSearchFilterComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {},
        },
        {
          provide: ConnectorStateFacadeService,
          useValue: {
            getMat017ItemsOfConnectorWithWidenData: (_payload: {
              listInformation: Partial<IcalcListInformation>;
              filterInformation?: Mat017ItemListFilter;
              which: ConnectorSide;
            }) => {},
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(ConnectorSearchFilterComponent, {
      componentProperties: {
        isLocked: false,
      },
    });
  });
});
