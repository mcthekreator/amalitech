import { TestBed } from '@angular/core/testing';
import { Mat017ItemInvalidInfoComponent } from './mat017-item-invalid-info.component';

describe(Mat017ItemInvalidInfoComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(Mat017ItemInvalidInfoComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(Mat017ItemInvalidInfoComponent, {
      componentProperties: {
        isLocked: false,
      },
    });
  });
});
