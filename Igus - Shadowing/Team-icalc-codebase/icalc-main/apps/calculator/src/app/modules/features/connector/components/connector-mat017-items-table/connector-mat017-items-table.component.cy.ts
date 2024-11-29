import { ConnectorMat017ItemsTableComponent } from './connector-mat017-items-table.component';
import { AppModule } from '../../../../../app.module';

describe(ConnectorMat017ItemsTableComponent.name, () => {
  it('renders', () => {
    cy.mount(ConnectorMat017ItemsTableComponent, {
      componentProperties: {
        isLocked: false,
      },
      imports: [AppModule],
    });
  });
});
