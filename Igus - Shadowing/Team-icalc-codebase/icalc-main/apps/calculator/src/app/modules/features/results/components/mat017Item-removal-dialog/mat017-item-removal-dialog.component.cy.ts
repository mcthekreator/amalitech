import { TestBed } from '@angular/core/testing';
import { Mat017ItemRemovalDialogComponent } from './mat017-item-removal-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { of } from 'rxjs';

describe(Mat017ItemRemovalDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ProcessStateFacadeService,
          useValue: {
            mat017ItemListWithNoPrices$: of([]),
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(Mat017ItemRemovalDialogComponent);
  });
});
