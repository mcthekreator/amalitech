import { TestBed } from '@angular/core/testing';
import { CopyConfigurationToNewCalculationDialogComponent } from './copy-configuration-to-new-calculation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormAsyncValidatorsService } from '../../../form-async-validators';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { CopyConfigurationToNewCalculationDto } from '@igus/icalc-domain';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';

describe(CopyConfigurationToNewCalculationDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        {
          provide: AppStateFacadeService,
          useValue: {
            getUserName: () => {},
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            isLocked: () => {},
            copyingConfigurationToNewCalculationInMetaDataSubmitted: (
              _payload: CopyConfigurationToNewCalculationDto
            ) => {},
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
    cy.mount(CopyConfigurationToNewCalculationDialogComponent);
  });
});
