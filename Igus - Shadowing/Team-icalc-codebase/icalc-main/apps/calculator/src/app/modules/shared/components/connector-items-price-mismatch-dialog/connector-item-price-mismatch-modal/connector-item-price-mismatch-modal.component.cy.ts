import { TestBed } from '@angular/core/testing';
import { ConnectorItemPriceMismatchModalComponent } from './connector-item-price-mismatch-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe(ConnectorItemPriceMismatchModalComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
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
    cy.mount(ConnectorItemPriceMismatchModalComponent);
  });
});
