import { TestBed } from '@angular/core/testing';
import { CopyConfigurationOptionsDialogComponent } from './copy-configuration-options-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

describe(CopyConfigurationOptionsDialogComponent.name, () => {
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
          provide: ProcessStateFacadeService,
          useValue: {
            isLocked: () => false,
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(CopyConfigurationOptionsDialogComponent);
  });
});
