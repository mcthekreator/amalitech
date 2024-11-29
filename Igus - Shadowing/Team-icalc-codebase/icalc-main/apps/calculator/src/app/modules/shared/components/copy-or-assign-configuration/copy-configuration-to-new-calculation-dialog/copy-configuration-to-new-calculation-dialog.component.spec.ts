import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CopyConfigurationToNewCalculationDialogComponent } from './copy-configuration-to-new-calculation-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { CopyConfigurationToExistingCalculationRequestDto } from '@igus/icalc-domain';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const processStateFacadeService = {
  isLocked: (): boolean => false,
  copyingConfigurationToExistingCalculationSubmitted: (
    _params: CopyConfigurationToExistingCalculationRequestDto
  ): void => {},
};

const appStateFacadeService = {
  getUserName: (): void => {},
};

describe('CopyConfigurationToNewCalculationDialogComponent', () => {
  let component: CopyConfigurationToNewCalculationDialogComponent;
  let fixture: ComponentFixture<CopyConfigurationToNewCalculationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      declarations: [CopyConfigurationToNewCalculationDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: ProcessStateFacadeService,
          useValue: processStateFacadeService,
        },
        {
          provide: AppStateFacadeService,
          useValue: appStateFacadeService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyConfigurationToNewCalculationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
