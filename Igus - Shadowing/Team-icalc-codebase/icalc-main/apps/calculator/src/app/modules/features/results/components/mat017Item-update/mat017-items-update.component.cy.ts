import { TestBed } from '@angular/core/testing';
import { Mat017ItemsUpdateComponent } from './mat017-items-update.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { of } from 'rxjs';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { ConnectorItemPriceMismatchModalService } from '@icalc/frontend/app/modules/shared/components/connector-items-price-mismatch-dialog/connector-item-price-mismatch-modal';

describe(Mat017ItemsUpdateComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            previousStep$: of(null),
            nextStep$: of(null),
            currentStep$: of(null),
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {},
        },
        {
          provide: ConnectorItemPriceMismatchModalService,
          useValue: {},
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(Mat017ItemsUpdateComponent);
  });
});
