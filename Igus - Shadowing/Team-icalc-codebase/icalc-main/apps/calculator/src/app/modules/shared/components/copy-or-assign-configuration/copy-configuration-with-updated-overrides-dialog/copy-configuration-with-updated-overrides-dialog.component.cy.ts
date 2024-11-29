import { TestBed } from '@angular/core/testing';
import { CopyConfigurationWithUpdatedOverridesDialogComponent } from './copy-configuration-with-updated-overrides-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ConfigurationApiService } from '@icalc/frontend/app/modules/core/data-access/configuration-api.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe(CopyConfigurationWithUpdatedOverridesDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ConfigurationApiService, usevalue: {} },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            isLocked: (): boolean => false,
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(CopyConfigurationWithUpdatedOverridesDialogComponent);
  });
});
