import type { ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { PinAssignmentStateFacadeService } from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';

import { ChainflexComponent } from './chainflex.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

describe('ChainflexComponent', () => {
  let component: ChainflexComponent;
  let fixture: ComponentFixture<ChainflexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ChainflexComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            nextStep$: of(null),
            previousStep$: of(null),
            setCurrentStep: (): void => {},
            setMainCssClass: (): void => {},
          },
        },
        {
          provide: ChainflexStateFacadeService,
          useValue: {
            chainflexCable$: of(null),
            listInformation$: of(null),
            setDefaultListInformation: (): void => {},
            searchingChainflexStarted: (): void => {},
            searchChainflex: (): void => {},
            updateChainflexStateAndSaveConfiguration: (): void => {},
            chainflexesAndPricesAvailable$: of(true),
            enteringChainflexPageStarted: (): void => {},
          },
        },
        {
          provide: PinAssignmentStateFacadeService,
          useValue: { setPinAssignment: (): void => {} },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            removeOverrides: (): void => {},
            selectedConfigurationItem$: (): Observable<object> => of({}),
            selectedConfigurationData$: of(null),
            chainflexCableLength$: of(null),
            isLocked$: of(false),
          },
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
    fixture = TestBed.createComponent(ChainflexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only allow maximum chainflex length of 10000.00', () => {
    component.chainflexLength.setValue('10000');
    expect(component.chainflexLength.valid).toBeTruthy();

    component.chainflexLength.setValue('10000.00');
    expect(component.chainflexLength.valid).toBeTruthy();

    component.chainflexLength.setValue('10000.0');
    expect(component.chainflexLength.valid).toBeTruthy();

    component.chainflexLength.setValue('10000.01');
    expect(component.chainflexLength.valid).toBeFalsy();

    component.chainflexLength.setValue('10000.001');
    expect(component.chainflexLength.valid).toBeFalsy();

    component.chainflexLength.setValue('9999.99');
    expect(component.chainflexLength.valid).toBeTruthy();
  });
});
