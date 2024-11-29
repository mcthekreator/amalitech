import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import type { IcalcConnector } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state.model';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { RightConnectorComponent } from './right-connector.component';
import { MatDialog } from '@angular/material/dialog';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { RouterModule } from '@angular/router';

describe('RightConnectorComponent', () => {
  let component: RightConnectorComponent;
  let fixture: ComponentFixture<RightConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [RightConnectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            setCurrentStep: (): void => {},
            currentStep$: of(null),
            setMainCssClass: (): void => {},
          },
        },
        {
          provide: ConnectorStateFacadeService,
          useValue: {
            getConnectorSelector: (): Observable<IcalcConnector> => {
              return new Observable<IcalcConnector>();
            },
            rightCheckedMat017Items$: of(null),
            rightConnector$: of(null),
            getMat017ItemsOfConnectorWithWidenData: () => {},
            getListInformationSnapshot: () => {},
            updateCurrentCalculation: () => {},
            getFavorites: () => [],
            rightConnectorSnapshot: (): IcalcConnector => {
              return {
                addedMat017Items: {},
                mat017ItemListWithWidenData: [],
              } as IcalcConnector;
            },
            leavingRightConnectorPageStarted: () => {},
            enteringRightConnectorPageStarted: (): void => {},
            enteringLeftConnectorPageStarted: (): void => {},
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
          provide: MatDialog,
          useValue: {
            dialog: of(null),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
