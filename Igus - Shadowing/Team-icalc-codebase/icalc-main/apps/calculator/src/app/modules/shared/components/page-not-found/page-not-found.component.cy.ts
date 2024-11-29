import { PageNotFoundComponent } from './page-not-found.component';
import { TranslateModule } from '@ngx-translate/core';

describe(PageNotFoundComponent.name, () => {
  it('renders', () => {
    cy.mount(PageNotFoundComponent, { imports: [TranslateModule.forRoot()] });
  });
});
