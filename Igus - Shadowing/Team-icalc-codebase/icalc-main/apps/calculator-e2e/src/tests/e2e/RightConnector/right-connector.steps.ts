import { AfterAll, Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { apiEndpoints, buildApiPath, externalUrls } from '../../../support/utils';
import { testUser } from '../../../support/auth.po';
import type { Mat017ItemWithWidenData } from '@igus/icalc-domain';
import { icalcTestMat017ItemWithWidenData } from '@igus/icalc-domain';

const saveSingleCableCalculationRequest = 'saveSingleCableCalculationRequest';

Before(() => {
  cy.dbSeed('delete-testdata');
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

When(/^the user selects a mat017 item with updated price as right connector item$/, () => {
  cy.getByCy('mat017item-search-field').type(icalcTestMat017ItemWithWidenData.matNumber);
  cy.getByCy('mat017item-filter-button').click();
  cy.getByCy('filter-zero-matches').click();
  cy.getByCy('apply-filter-button').click();
  cy.getByCy('add-mat017-item').eq(0).click();
});

When(/^accepts to copy the price from left connector$/, () => {
  cy.getByCy('add-mat017-item-and-update-other-side').should('be.visible');
  cy.intercept('POST', `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}*`).as(
    saveSingleCableCalculationRequest
  );
  cy.getByCy('add-mat017-item-and-update-other-side').click();
  cy.getByCy('price-mismatch-header').should('not.exist');
});

When(/^proceeds to next step$/, () => {
  cy.getByCy('save-connector-mat017-items').click();
});

Then(/^iCalc should save the mat017 item with updated price for right connector$/, () => {
  cy.wait(`@${saveSingleCableCalculationRequest}`)
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('singleCableCalculation');
      expect(body.singleCableCalculation).to.have.property('configuration');
      const connectorState = body.singleCableCalculation.configuration.state.connectorState;
      const leftConnectorItem = connectorState.leftConnector.mat017ItemListWithWidenData[0] as Mat017ItemWithWidenData;
      const rightConnectorItem = connectorState.rightConnector
        .mat017ItemListWithWidenData[0] as Mat017ItemWithWidenData;

      expect(leftConnectorItem.overrides.amountDividedByPriceUnit).to.equal(
        rightConnectorItem.overrides.amountDividedByPriceUnit
      );
    });
});
