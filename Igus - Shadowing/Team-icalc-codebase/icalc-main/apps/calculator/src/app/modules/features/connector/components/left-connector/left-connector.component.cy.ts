import { TestBed } from '@angular/core/testing';
import { LeftConnectorComponent } from './left-connector.component';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { ConnectorItemPriceMismatchModalService } from '@icalc/frontend/app/modules/shared/components/connector-items-price-mismatch-dialog/connector-item-price-mismatch-modal';
import type { IcalcConnector } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state.model';

describe(LeftConnectorComponent.name, () => {
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
            leftCheckedMat017Items$: of(null),
            leftConnector$: of(null),
            getMat017ItemsOfConnectorWithWidenData: (): void => {},
            getListInformationSnapshot: (): void => {},
            updateCurrentCalculation: (): void => {},
            getFavorites: () => [],
            leftConnectorSnapshot: (): IcalcConnector => {
              return {
                addedMat017Items: {},
                mat017ItemListWithWidenData: [],
              } as IcalcConnector;
            },
            enteringLeftConnectorPageStarted: (): void => {},
            leavingLeftConnectorPageStarted: (): void => {},
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
    cy.mount(LeftConnectorComponent);
  });
});
