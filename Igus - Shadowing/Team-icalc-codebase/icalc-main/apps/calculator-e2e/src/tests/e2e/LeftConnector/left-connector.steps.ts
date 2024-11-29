import { icalcTestConfigurationWithManuallyCreatedItem, manuallyCreatedMat017ItemMatNumber } from '@igus/icalc-domain';
import { AfterAll, Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { apiEndpoints, buildApiPath, externalUrls } from '../../../support/utils';
import { testUser } from '../../../support/auth.po';

Before(() => {
  cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, {
    statusCode: 500,
  }).as('piwikTemplates');

  cy.session('loginByApi', () => {
    cy.loginByApi(testUser.email, testUser.password);
  });
});

AfterAll(() => {
  cy.dbSeed('delete-testdata');
});

When('the user filters for only manually added items', () => {
  cy.getByCy('mat017item-filter-button').click();
  cy.getByCy('filter-manually-created').click();
  cy.getByCy('mat017item-search-field').type(manuallyCreatedMat017ItemMatNumber);
  cy.getByCy('apply-filter-button').click();
});

Then('iCalc should show the applied filter for all connectors including unmatched', () => {
  cy.getByCy('show-zero-matches-filter-active').should('be.visible');
});

Then(/^(iCalc )?should display only manually created items$/, () => {
  cy.getByCy('show-only-manually-created-filter-active').should('be.visible');
  cy.getByCy('results-table-mat-number-cell')
    .eq(0)
    .should(
      'contain',
      icalcTestConfigurationWithManuallyCreatedItem.state.connectorState.leftConnector.mat017ItemListWithWidenData[0]
        .matNumber
    );
});

const deleteManuallyCreatedRequest = 'deleteManuallyCreated';

When('the user clicks to delete mat017Item and confirms deletion', () => {
  cy.getByCy('result-table-delete-item-button').eq(0).click();
  cy.intercept('DELETE', `${buildApiPath(apiEndpoints.mat017Item)}/${manuallyCreatedMat017ItemMatNumber}`).as(
    deleteManuallyCreatedRequest
  );
  cy.getByCy('warning-confirm-button').click();
});

Then('iCalc should delete the manually created mat017 item', () => {
  cy.wait(`@${deleteManuallyCreatedRequest}`);
  cy.getByCy('results-table-mat-number-cell').should('have.length', 0);
});
