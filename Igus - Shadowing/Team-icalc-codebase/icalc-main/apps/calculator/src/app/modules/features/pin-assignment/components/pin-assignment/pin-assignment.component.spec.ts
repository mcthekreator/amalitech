import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { PinAssignmentStateFacadeService } from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';

import { PinAssignmentComponent } from './pin-assignment.component';
import { RouterModule } from '@angular/router';

describe('PinAssignmentComponent', () => {
  let component: PinAssignmentComponent;
  let fixture: ComponentFixture<PinAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [PinAssignmentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: { setCurrentStep: (): void => {}, setMainCssClass: (): void => {}, nextStep$: of({}) },
        },
        {
          provide: PinAssignmentStateFacadeService,
          useValue: {
            pinAssignment$: of({}),
            cableStructureInformation$: of({}),
            pinAssignmentStructure$: of({}),
            setBase64Image: (): void => {},
            setCableStructureInformation: (): void => {},
            setMainCssClass: (): void => {},
            setUpNewPinAssignment: (): void => {},
            setPinAssignment: (): void => {},
            getIsPinAssignmentValuesOverriddenSnapshot: (): void => {},
            getActionModelsSnapshot: (): void => {},
            configurationValidationResult$: (): Observable<object> => of({}),
            getBase64ImageSnapshot: (): void => {},
            enteringPinAssignmentPageStarted: (): void => {},
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            enteringPinAssignmentPageStarted: () => {},
            updateCurrentCalculation: (): void => {},
            patchAndSaveCalculation: (): void => {},
            isLocked$: of(false),
            selectedConfigurationData$: of(null),
            patchAndSaveConfiguration: (): void => {},
          },
        },
        {
          provide: ConnectorStateFacadeService,
          useValue: { leftItemList$: of(null), rightItemList$: of(null) },
        },
        {
          provide: ChainflexStateFacadeService,
          useValue: {
            getChainflexPartNumber: (): void => {},
            getChainflexCableStructure: (): void => {},
            getChainflexCableStructureInformation: (): void => {},
            getChainflexCable: (): void => {},
          },
        },
        {
          provide: LibraryStateFacadeService,
          useValue: { imageList$: of(null), updateCurrentCalculation: (): void => {} },
        },
        {
          provide: FormBuilder,
          useValue: { group: (): void => {} },
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
    fixture = TestBed.createComponent(PinAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
