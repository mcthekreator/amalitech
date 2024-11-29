import { TestBed } from '@angular/core/testing';
import { CopyConfigurationToExistingCalculationDialogComponent } from './copy-configuration-to-existing-calculation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormAsyncValidatorsService } from '../../../form-async-validators';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';

describe(CopyConfigurationToExistingCalculationDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: AppStateFacadeService,
          useValue: {},
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            isLocked: (): boolean => false,
          },
        },
        {
          provide: FormAsyncValidatorsService,
          useValue: {
            checkUniqueMatNumber: (): Observable<unknown> => of(null),
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(CopyConfigurationToExistingCalculationDialogComponent);
  });
});
