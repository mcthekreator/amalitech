import { TestBed } from '@angular/core/testing';
import { FormlyActionButtonComponent } from './formly-action-button.type';

describe(FormlyActionButtonComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(FormlyActionButtonComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(FormlyActionButtonComponent);
  });
});
