import { TestBed } from '@angular/core/testing';
import { ChainflexComponent } from './chainflex.component';
import { ProcessStateFacadeService } from '../../../../core/state/process-state/process-state-facade.service';
import { AppStateFacadeService } from '../../../../core/state/app-state/app-state-facade.service';
import { ChainflexStateFacadeService } from '../../../../core/state/chainflex-state/chainflex-state-facade.service';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { PinAssignmentStateFacadeService } from '../../../../core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { SharedModule } from '../../../../shared/shared.module';

describe(ChainflexComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(ChainflexComponent, {
      add: {
        providers: [
          { provide: ChangeDetectorRef, useValue: {} },
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
      },
    });
  });

  it('renders', () => {
    cy.mount(ChainflexComponent, { imports: [RouterModule.forRoot([]), TranslateModule.forRoot(), SharedModule] });
  });
});
