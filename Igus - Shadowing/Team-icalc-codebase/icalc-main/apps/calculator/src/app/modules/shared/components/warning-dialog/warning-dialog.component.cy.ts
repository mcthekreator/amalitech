import { WarningDialogComponent } from './warning-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogConfirmOrCancelEnum } from '../../types';

describe(WarningDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            cancel: DialogConfirmOrCancelEnum.cancelAction,
            confirm: DialogConfirmOrCancelEnum.confirmAction,
          },
        },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    });
  });

  it('renders', () => {
    cy.mount(WarningDialogComponent);
  });
});
