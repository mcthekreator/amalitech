import { TestBed } from '@angular/core/testing';
import { CdkPortalComponent } from './cdk-portal.component';

describe(CdkPortalComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(CdkPortalComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(CdkPortalComponent, {
      componentProperties: {
        selectorId: '',
      },
    });
  });
});
