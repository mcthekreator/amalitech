import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import type { IcalcConnector } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state.model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { LeftConnectorComponent } from './left-connector.component';
import { RouterModule } from '@angular/router';

describe('LeftConnectorComponent', () => {
  let component: LeftConnectorComponent;
  let fixture: ComponentFixture<LeftConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [LeftConnectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
          provide: MatDialog,
          useValue: {
            dialog: of(null),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
