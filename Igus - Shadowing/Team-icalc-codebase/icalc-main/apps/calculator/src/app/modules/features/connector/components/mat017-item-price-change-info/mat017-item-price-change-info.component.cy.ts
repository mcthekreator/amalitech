import { TestBed } from '@angular/core/testing';
import { Mat017ItemPriceChangeInfoComponent } from './mat017-item-price-change-info.component';

describe(Mat017ItemPriceChangeInfoComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(Mat017ItemPriceChangeInfoComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(Mat017ItemPriceChangeInfoComponent, {
      componentProperties: {
        isLocked: false,
      },
    });
  });
});
