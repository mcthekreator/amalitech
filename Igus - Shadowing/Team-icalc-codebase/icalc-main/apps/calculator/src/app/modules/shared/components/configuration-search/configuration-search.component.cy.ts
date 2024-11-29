import { TestBed } from '@angular/core/testing';
import { ConfigurationSearchComponent } from './configuration-search.component';
import { SearchStateFacadeService } from '../../../core/state/search-state/search-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';

describe(ConfigurationSearchComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(ConfigurationSearchComponent, {
      add: {
        providers: [{ provide: SearchStateFacadeService, useValue: {} }],
      },
    });
  });

  it('renders', () => {
    cy.mount(ConfigurationSearchComponent, {
      componentProperties: {
        filterConfigurations: false,
        selectedConfigurationId: null,
      },
      imports: [TranslateModule.forRoot()],
    });
  });
});
