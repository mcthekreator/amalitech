import {
  icalcTestCalculation,
  icalcLockedTestCalculation,
  icalcTestCalculationWithUpdatedChainflexPrice,
  icalcTestCalculationWithRemovedChainflex,
  icalcTestConfiguration,
  icalcTestConfigurationWithUpdatedChainflexPrice,
  icalcTestConfigurationWithRemovedChainflex,
} from '@igus/icalc-domain';
import { testUser } from '../../../support/auth.po';
import { Steps, externalUrls, selectors } from '../../../support/utils';

describe('chainflex', () => {
  before(() => {
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration');
    cy.dbSeed('calculation-and-configuration --locked');
    cy.dbSeed('calculation-and-configuration --updatedChainflexPrice');
    cy.dbSeed('calculation-and-configuration --removedChainflex');
  });

  beforeEach(() => {
    // avoid displaying piwik gdpr window
    cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, {
      statusCode: 500,
    }).as('piwikTemplates');

    cy.session('loginByApi', () => {
      cy.loginByApi(testUser.email, testUser.password);
    });
  });

  after(() => {
    cy.dbSeed('delete-testdata');
  });

  it('should load preselected data and show it correctly (chainflex cable, and cf length)', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.chainflex);
    cy.getByCy('selected-chainflex-cable-part-number').should('have.text', icalcTestConfiguration.partNumber);
    cy.getByCy('choose-chainflex-length').should('have.value', 1);
  });

  it('should be able to sort chainflex results by part number', () => {
    const firstTableCell = 'firstTableCell';
    const secondTableCell = 'secondTableCell';

    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.chainflex);
    cy.getByCy('part-number-header').click();

    cy.getByCy('part-number-sort').should('be.visible');

    cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(0).find('td').eq(1).as(firstTableCell);
    cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(1).find('td').eq(1).as(secondTableCell);
    cy.get(`@${firstTableCell}`).then((firstCell) => {
      cy.get(`@${secondTableCell}`).then((secondCell) => {
        expect(firstCell.text() > secondCell.text()).equal(true);
      });
    });
  });

  it('should be able to filter chainflex results by part number', () => {
    const searchString = icalcTestConfiguration.partNumber;

    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.chainflex);
    cy.getByCy('search-string-input').type(searchString);

    cy.getByCy('chainflex-search-result-table')
      .get(selectors.tableRow)
      .eq(0)
      .find('td')
      .eq(1)
      .should('have.text', searchString);
    cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(1).should('not.exist');
  });

  it('should be able to choose new chainflex and change the length (for active calculation)', () => {
    const newChainflexLength = 1.5;
    const chainFlexLenghtInput = 'chainflexLengthInput';

    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.chainflex);

    cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(2).click();
    cy.getByCy('choose-chainflex-length').as(chainFlexLenghtInput);
    cy.get(`@${chainFlexLenghtInput}`).clear();
    cy.get(`@${chainFlexLenghtInput}`).type(`${newChainflexLength}`);
    cy.get(`@${chainFlexLenghtInput}`).should('have.value', newChainflexLength);
  });

  it('should not be able to choose new chainflex or change length (for locked calculation)', () => {
    cy.clickThroughToStep(icalcLockedTestCalculation.calculationNumber, Steps.chainflex);

    cy.on('fail', (error) => {
      expect(error.message).to.include('is being covered by another element');
    });
    cy.getByCy('choose-chainflex-length').should('be.disabled');
    cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(2).click();
  });

  it('should show a notification if the chainflex price of selected chainflex has changed', () => {
    cy.clickThroughToStep(icalcTestCalculationWithUpdatedChainflexPrice.calculationNumber, Steps.chainflex);
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

  it('should show a notification if the chainflex price of selected chainflex was removed', () => {
    cy.clickThroughToStep(icalcTestCalculationWithRemovedChainflex.calculationNumber, Steps.chainflex);
    cy.getByCy('chainflex-price-removed')
      .should('be.visible')
      .should('contain.text', icalcTestConfigurationWithRemovedChainflex.partNumber);
  });

  describe('show a warning dialog when the chainflex price is removed and the user selects other chainflex', () => {
    beforeEach(() => {
      cy.clickThroughToStep(icalcTestCalculationWithRemovedChainflex.calculationNumber, Steps.chainflex);
    });

    it('should not change the chainflex by clicking the dialogs cancel button and close the dialog', () => {
      cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(2).click();
      cy.getByCy('removal-warning-dialog').should('be.visible');
      cy.getByCy('removal-warning-dialog-cancel-button').click();
      cy.getByCy('selected-chainflex-cable-part-number').should(
        'have.text',
        icalcTestConfigurationWithRemovedChainflex.partNumber
      );
      cy.getByCy('removal-warning-dialog').should('not.exist');
      cy.getByCy('chainflex-price-removed').should('be.visible');
    });

    it('should select the new chainflex by clicking on confirm button', () => {
      cy.getByCy('chainflex-search-result-table').get(selectors.tableRow).eq(4).find('td').eq(1).as('tableCell');

      cy.get('@tableCell').click();
      cy.getByCy('removal-warning-dialog').should('be.visible');
      cy.getByCy('removal-warning-dialog-confirm-button').click();

      cy.get('@tableCell')
        .invoke('text')
        .then((tableCellText) => {
          cy.getByCy('selected-chainflex-cable-part-number').should('contain.text', tableCellText);
        });

      cy.getByCy('removal-warning-dialog').should('not.exist');
      cy.getByCy('chainflex-price-removed').should('not.exist');
    });
  });
});
