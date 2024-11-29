import { AfterAll, Before, BeforeAll, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { apiEndpoints, buildApiPath, externalUrls, selectors } from '../../../support/utils';
import { testUser } from '../../../support/auth.po';
import {
  icalcTestConfiguration,
  icalcTestConfigurationWithRemovedChainflex,
  icalcTestConfigurationWithUpdatedChainflexPrice,
} from '@igus/icalc-domain';
import type { SingleCableCalculationEntity } from '@igus/icalc-entities';
import type { SortField } from './chainflex-data-mock';
import { chainflexMockDataScenario } from './chainflex-data-mock';

const saveSingleCableCalculationRequest = 'saveSingleCableCalculation';

BeforeAll(() => {
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

When(/^the user clicks to sort by (part number)$/, (_: SortField) => {
  cy.getByCy('part-number-header').click();
});

Then(/^iCalc should display the (part number) sort indicator$/, (_: SortField) => {
  cy.getByCy('part-number-sort').should('be.visible');
});

Then(
  /^iCalc should sort the chainflex table (descending|ascending) by (part number)$/,
  (asc: 'ascending' | 'descending', _: SortField) => {
    const firstTableCellToCompare = 'firstTCToCompare';
    const secondTableCellToCompare = 'secondTCToCompare';

    cy.getByCy('chainflex-search-result-table')
      .get(selectors.tableRow)
      .eq(0)
      .find('td')
      .eq(1)
      .as(firstTableCellToCompare);
    cy.getByCy('chainflex-search-result-table')
      .get(selectors.tableRow)
      .eq(5)
      .find('td')
      .eq(1)
      .as(secondTableCellToCompare);
    cy.get(`@${firstTableCellToCompare}`).then((firstCell) => {
      cy.get(`@${secondTableCellToCompare}`).then((secondCell) => {
        const firstCellText = firstCell.text();
        const secondCellText = secondCell.text();
        const compareResult = firstCellText.localeCompare(secondCellText);
        const expectedResult = asc === 'ascending' ? -1 : 1;

        expect(compareResult).to.oneOf([0, expectedResult]);
      });
    });
  }
);

When('the user searches for a chainflex by part number', () => {
  const searchString = chainflexMockDataScenario.searchString;

  cy.getByCy('search-string-input').type(searchString);
});

Then('iCalc should display the searched Chainflex as first result in the table', () => {
  const searchString = chainflexMockDataScenario.searchString;

  cy.getByCy('chainflex-search-result-table')
    .get(selectors.tableRow)
    .eq(0)
    .find('td')
    .eq(1)
    .should('have.text', searchString);
});

When('the user selects a different chainflex', () => {
  cy.getByCy('chainflex-search-result-table')
    .get(selectors.tableRow)
    .eq(2)
    .find('td')
    .eq(1)
    .then((newlySelectedChainflexTd) => {
      chainflexMockDataScenario.newChainflexPartNumber = newlySelectedChainflexTd.text();
      newlySelectedChainflexTd.trigger('click');
    });
});

When('selects new chainflex length', () => {
  const newChainflexLength = chainflexMockDataScenario.newChainflexLength;
  const chainFlexLengthInput = 'chainflexLengthInput';

  cy.getByCy('choose-chainflex-length').as(chainFlexLengthInput);
  cy.get(`@${chainFlexLengthInput}`).clear();
  cy.get(`@${chainFlexLengthInput}`).type(`${newChainflexLength}`);
  cy.get(`@${chainFlexLengthInput}`).should('have.value', newChainflexLength);

  cy.intercept('POST', `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}*`).as(
    saveSingleCableCalculationRequest
  );
  cy.getByCy('save-chainflex-length').click();
});

Then('iCalc should save the newly selected chainflex and chainflex length', () => {
  const { newChainflexLength, newChainflexPartNumber } = chainflexMockDataScenario;

  cy.wait('@saveSingleCableCalculation')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('singleCableCalculation');
      const singleCableCalculation = body.singleCableCalculation as SingleCableCalculationEntity;

      expect(singleCableCalculation.chainflexLength).to.eq(+newChainflexLength);
      expect(singleCableCalculation.configuration.partNumber).not.to.eq(icalcTestConfiguration.partNumber);
      expect(singleCableCalculation.configuration.state.chainFlexState.chainflexCable.partNumber).to.eq(
        newChainflexPartNumber
      );
    });
});

Then('iCalc should show a notification box for changed chainflex prices', () => {
  cy.getByCy('chainflex-price-changed')
    .should('be.visible')
    .should('contain.text', icalcTestConfigurationWithUpdatedChainflexPrice.partNumber)
    .should(
      'contain.text',
      icalcTestConfigurationWithUpdatedChainflexPrice.state.chainFlexState.chainflexCable.price.germanListPrice.toLocaleString?.(
        'de-DE',
        { minimumFractionDigits: 2 }
      )
    );
});

Then('iCalc should show a notification box for removed chainflex prices', () => {
  cy.getByCy('chainflex-price-removed')
    .should('be.visible')
    .should('contain.text', icalcTestConfigurationWithRemovedChainflex.partNumber);
});

When('clicks to confirm his selection in the removal warning dialog', () => {
  cy.getByCy('removal-warning-dialog-confirm-button').click();
});

Then('iCalc should display the newly selected chainflex part number', () => {
  const newChainflexPartNumber = chainflexMockDataScenario.newChainflexPartNumber;

  cy.getByCy('selected-chainflex-cable-part-number').should('contain.text', newChainflexPartNumber);
});

Then('should not show the price removal notification', () => {
  cy.getByCy('chainflex-price-removed').should('not.exist');
});
