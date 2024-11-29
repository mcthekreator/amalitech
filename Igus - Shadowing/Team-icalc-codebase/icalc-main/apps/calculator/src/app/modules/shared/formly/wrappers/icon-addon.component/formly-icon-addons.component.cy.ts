import { TestBed } from '@angular/core/testing';
import { FormlyIconAddonsComponent } from './formly-icon-addons.component';

describe(FormlyIconAddonsComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(FormlyIconAddonsComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(FormlyIconAddonsComponent);
  });
});
