import { TestBed } from '@angular/core/testing';
import { AssignConfigurationSearchDialogComponent } from './assign-configuration-search-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe(AssignConfigurationSearchDialogComponent.name, () => {
  const selectedConfiguration = '';

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
          useValue: {
            selectedConfiguration,
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(AssignConfigurationSearchDialogComponent);
  });
});
