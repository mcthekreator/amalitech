import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AppStateFacadeService } from '../../../../core/state/app-state/app-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';

describe(LoginComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(LoginComponent, {
      add: {
        imports: [],
        providers: [{ provide: AppStateFacadeService, useValue: {} }],
      },
    });
  });

  it('renders', () => {
    cy.mount(LoginComponent, {
      imports: [TranslateModule.forRoot()],
    });
  });
});
