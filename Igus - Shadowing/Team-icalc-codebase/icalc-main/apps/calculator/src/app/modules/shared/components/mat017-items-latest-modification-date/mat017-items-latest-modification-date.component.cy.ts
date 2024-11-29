import { Mat017ItemsLatestModificationDateComponent } from './mat017-items-latest-modification-date.component';
import { TranslateModule } from '@ngx-translate/core';

describe(Mat017ItemsLatestModificationDateComponent.name, () => {
  it('renders', () => {
    cy.mount(Mat017ItemsLatestModificationDateComponent, { imports: [TranslateModule.forRoot()] });
  });
});
