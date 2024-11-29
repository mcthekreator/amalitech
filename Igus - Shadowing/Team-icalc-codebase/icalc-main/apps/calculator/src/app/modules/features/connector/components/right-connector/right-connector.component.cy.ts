import { TestBed } from '@angular/core/testing';
import { RightConnectorComponent } from './right-connector.component';
import type { IcalcConnector } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state.model';
import { ConnectorItemPriceMismatchModalService } from '@icalc/frontend/app/modules/shared/components/connector-items-price-mismatch-dialog/connector-item-price-mismatch-modal';
import { Observable, of } from 'rxjs';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';

describe(RightConnectorComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            previousStep$: of(null),
            nextStep$: of(null),
            currentStep$: of(null),
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {},
        },
        {
          provide: ConnectorStateFacadeService,
          useValue: {
            getConnectorSelector: (): Observable<IcalcConnector> => {
              return new Observable<IcalcConnector>();
            },
            getMat017ItemsOfConnectorWithWidenData: (): void => {},
            getListInformationSnapshot: (): void => {},
            updateCurrentCalculation: (): void => {},
            getFavorites: () => [],
            enteringRightConnectorPageStarted: (): void => {},
            leavingRightConnectorPageStarted: (): void => {},
          },
        },
        {
          provide: ConnectorItemPriceMismatchModalService,
          useValue: {},
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(RightConnectorComponent);
  });
});
