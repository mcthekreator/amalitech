import { TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ProcessStateFacadeService } from '../../../../core/state/process-state/process-state-facade.service';

describe(AdminComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(AdminComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(AdminComponent, { providers: [{ provide: ProcessStateFacadeService, useValue: {} }] });
  });
});
