import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CopyConfigurationToExistingCalculationDialogComponent } from './copy-configuration-to-existing-calculation-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { CopyConfigurationToExistingCalculationRequestDto } from '@igus/icalc-domain';
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

describe('CopyConfigurationToExistingCalculationDialogComponent', () => {
  let component: CopyConfigurationToExistingCalculationDialogComponent;
  let fixture: ComponentFixture<CopyConfigurationToExistingCalculationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      declarations: [CopyConfigurationToExistingCalculationDialogComponent],
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

    fixture = TestBed.createComponent(CopyConfigurationToExistingCalculationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
