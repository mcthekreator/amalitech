import { RevokeConfigurationApprovalComponent } from './revoke-configuration-approval.component';
import { TranslateModule } from '@ngx-translate/core';

describe(RevokeConfigurationApprovalComponent.name, () => {
  it('renders', () => {
    cy.mount(RevokeConfigurationApprovalComponent, { imports: [TranslateModule.forRoot()] });
  });
});
