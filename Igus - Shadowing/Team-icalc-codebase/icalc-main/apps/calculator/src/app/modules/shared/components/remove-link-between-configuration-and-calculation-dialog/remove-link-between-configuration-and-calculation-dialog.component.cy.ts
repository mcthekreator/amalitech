import { TestBed } from '@angular/core/testing';
import { RemoveLinkBetweenConfigurationAndCalculationDialogComponent } from './remove-link-between-configuration-and-calculation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcessStateFacadeService } from '../../../core/state/process-state/process-state-facade.service';
import { of } from 'rxjs';

describe(RemoveLinkBetweenConfigurationAndCalculationDialogComponent.name, () => {
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
            removeLinkBetweenConfigurationAndCalculationDialogOpened: () => {},
            canLinkBetweenConfigurationAndCalculationBeRemovedFailed$: of(null),
            canLinkBetweenConfigurationAndCalculationBeRemoved$: of(null),
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(RemoveLinkBetweenConfigurationAndCalculationDialogComponent);
  });
});
