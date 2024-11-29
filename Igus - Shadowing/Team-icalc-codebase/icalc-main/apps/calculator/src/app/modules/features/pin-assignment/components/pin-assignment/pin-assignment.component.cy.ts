import { TestBed } from '@angular/core/testing';
import { PinAssignmentComponent } from './pin-assignment.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { IcalcConnector } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state.model';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { Observable, of } from 'rxjs';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { MatDialog } from '@angular/material/dialog';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { PinAssignmentStateFacadeService } from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import type {
  EnteringPinAssignmentPagePayload,
  NavigatingBackFromPinAssignmentPagePayload,
} from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state.model';

describe(PinAssignmentComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            setCurrentStep: (): void => {},
            setMainCssClass: (): void => {},
            currentStep$: of(null),
          },
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
        {
          provide: LibraryStateFacadeService,
          useValue: {
            imageList$: of([]),
          },
        },
        {
          provide: PinAssignmentStateFacadeService,
          useValue: {
            enteringPinAssignmentPageStarted: () => {},
            enteringPinAssignmentPageEntered: (_payload: EnteringPinAssignmentPagePayload) => {},
            navigatingBackFromPinAssignmentPageStarted: (_payload: NavigatingBackFromPinAssignmentPagePayload) => {},
          },
        },
        {
          provide: MatDialog,
          useValue: {
            dialog: of(null),
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(PinAssignmentComponent);
  });
});
