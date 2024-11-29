import { TestBed } from '@angular/core/testing';
import { WorkStepInformationComponent } from './work-step-information.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

describe(WorkStepInformationComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {},
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {},
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(WorkStepInformationComponent);
  });
});
