import { TestBed } from '@angular/core/testing';
import { AssignExistingConfigurationOrCopyDialogComponent } from './assign-existing-configuration-or-copy-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe(AssignExistingConfigurationOrCopyDialogComponent.name, () => {
  const selectedConfigurationMatNumber = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            selectedConfigurationMatNumber,
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(AssignExistingConfigurationOrCopyDialogComponent);
  });
});
