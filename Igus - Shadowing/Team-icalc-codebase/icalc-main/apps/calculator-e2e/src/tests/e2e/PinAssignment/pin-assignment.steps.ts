import { externalUrls, selectors } from '../../../support/utils';
import { testUser } from '../../../support/auth.po';
import { AfterAll, Before, BeforeAll, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { icalcTestConfiguration } from '@igus/icalc-domain';

BeforeAll(() => {
  cy.dbSeed('delete-testdata');
  cy.dbSeed('user');
});

Before(() => {
  // avoid displaying piwik gdpr window
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

When('selects action setOnContact for core or shield', () => {
  cy.getByCy('core-form-select').first().click();
  cy.get(selectors.matMenuItem).eq(1).should('exist').containsTranslated('setOnContact').click();
  cy.getByCy('core-form-pin-input').type('Zz');
});

When('navigating to result page', () => {
  cy.getByCy('save-and-validate-configuration').click();
});

Then('iCalc should trigger validation correctly', () => {
  cy.getByCy('approve-and-go-to-result').should('be.visible');
});

When('the user selects MAT017 pin assignment option from actions', () => {
  cy.getByCy('core-form-select').first().click();
  cy.get(selectors.matMenuItem).eq(2).should('exist').click();
});

When('clicks on pick-mat017-item-button', () => {
  cy.getByCy('pick-mat017-item-button').should('exist').click();
});

Then('iCalc should show mat017-item-picker table', () => {
  cy.getByCy('mat017-item-picker-row').should(
    'have.length',
    icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData.length
  );
});

When('selects mat017 item from mat017-item-picker table', () => {
  cy.getByCy('mat017-item-picker-row').eq(0).should('exist').click();
  cy.getByCy('confirm-mat017-item-selection').should('be.enabled').click();
  cy.getByCy('save-and-validate-configuration').click();
});

Then('iCalc should show selected mat017 item as value for action in cable structure', () => {
  cy.getByCy('pin-assignment-left-display').eq(0).should('contain.text', 'MAT017');
  cy.getByCy('pin-assignment-left-display')
    .eq(0)
    .should(
      'contain.text',
      icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber
    );
});

When('the user removes non-existing mat017 item from BOM and navigate to pinAssignment page', () => {
  cy.getByCy('remove-from-MAT017-item-list').eq(1).should('exist');
  cy.getByCy('remove-from-MAT017-item-list').eq(1).click();
  cy.getByCy('save-connector-mat017-items').click();
  cy.getByCy('save-connector-mat017-items').click();
  cy.getByCy('save-library').click();
});

Then('iCalc should show no value for selected MAT017 pin assignment option', () => {
  cy.getByCy('pick-mat017-item-button').should('exist').click();
  cy.getByCy('mat017-item-picker-row').should(
    'have.length',
    icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData.length - 1
  );
  cy.getByCy('cancel-mat017-item-selection').click();

  cy.getByCy('save-and-validate-configuration').click();
  cy.getByCy('pin-assignment-left-display').eq(0).should('contain.text', 'MAT017');
  cy.getByCy('pin-assignment-left-display').eq(0).should('contain.text', '?');
});
