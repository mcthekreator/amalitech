import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CopyConfigurationWithUpdatedOverridesDialogComponent } from './copy-configuration-with-updated-overrides-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ConfigurationApiService } from '@icalc/frontend/app/modules/core/data-access/configuration-api.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const processStateFacadeService = {
  isLocked: (): boolean => false,
};

describe('CopyConfigurationWithUpdatedOverridesDialogComponent', () => {
  let component: CopyConfigurationWithUpdatedOverridesDialogComponent;
  let fixture: ComponentFixture<CopyConfigurationWithUpdatedOverridesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      declarations: [CopyConfigurationWithUpdatedOverridesDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ConfigurationApiService, usevalue: {} },
        {
          provide: ProcessStateFacadeService,
          useValue: processStateFacadeService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyConfigurationWithUpdatedOverridesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
