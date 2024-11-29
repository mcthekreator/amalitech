import { TestBed } from '@angular/core/testing';
import { AssignConfigurationDialogComponent } from './assign-configuration-dialog.component';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { SingleCableCalculationBaseData } from '@igus/icalc-domain';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe(AssignConfigurationDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            assignConfigurationToExistingCalculation: (_payload: {
              reProcess?: boolean;
              configurationId?: string;
              singleCableCalculationBaseData?: SingleCableCalculationBaseData;
            }) => {},
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(AssignConfigurationDialogComponent);
  });
});
