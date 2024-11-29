import {
  icalcLockedTestCalculation,
  icalcTestCalculation,
  icalcTestCalculationWithUpdatedMat017ItemPrice,
  icalcTestMat017ItemWithWidenData,
} from '@igus/icalc-domain';
import { testUser } from '../../../support/auth.po';
import { Steps, apiEndpoints, buildApiPath, externalUrls } from '../../../support/utils';

describe('right connector', () => {
  before(() => {
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration');
    cy.dbSeed('calculation-and-configuration --locked');
    cy.dbSeed('calculation-and-configuration --updatedMat017ItemPrice');
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

  it('should show enabled select connector sets button for active calculations', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.rightConnector);

    cy.getByCy('rightConnector-select-sets-button').should('be.visible');
    cy.getByCy('rightConnector-select-sets-button').should('be.enabled');
  });

  it('should show disabled select connector sets button for locked calculations', () => {
    cy.clickThroughToStep(icalcLockedTestCalculation.calculationNumber, Steps.rightConnector);

    cy.getByCy('rightConnector-select-sets-button').should('be.visible');
    cy.getByCy('rightConnector-select-sets-button').should('be.disabled');
  });

  describe('item with outdated price in configuration', () => {
    context('Given a configuration with a MAT017 item with an outdated price on the left side.', () => {
      context('When selecting that item on the right side, ', () => {
        it('then it should show an information dialog about the price difference.', () => {
          cy.clickThroughToStep(icalcTestCalculationWithUpdatedMat017ItemPrice.calculationNumber, Steps.rightConnector);

          cy.getByCy('mat017item-search-field').type(icalcTestMat017ItemWithWidenData.matNumber);
          cy.getByCy('mat017item-filter-button').click();
          cy.getByCy('filter-zero-matches').click();
          cy.getByCy('apply-filter-button').click();
          cy.getByCy('add-mat017-item').eq(0).click();
          cy.getByCy('price-mismatch-header').should('be.visible');
          cy.getByCy('cancel-solve-dialog').should('be.visible');
          cy.getByCy('cancel-solve-dialog').click();
          cy.getByCy('price-mismatch-header').should('not.exist');
        });
      });

      context(
        'When selecting that item on the right side, solving price differences and going back to left connector, ',
        () => {
          it('then it should show correct data for both connector sides.', () => {
            cy.clickThroughToStep(
              icalcTestCalculationWithUpdatedMat017ItemPrice.calculationNumber,
              Steps.rightConnector
            );

            cy.getByCy('mat017item-search-field').type(icalcTestMat017ItemWithWidenData.matNumber);
            cy.getByCy('mat017item-filter-button').click();
            cy.getByCy('filter-zero-matches').click();
            cy.getByCy('apply-filter-button').click();
            cy.getByCy('add-mat017-item').eq(0).click();
            cy.getByCy('add-mat017-item-and-update-other-side').should('be.visible');
            cy.getByCy('add-mat017-item-and-update-other-side').click();
            cy.getByCy('price-mismatch-header').should('not.exist');
            cy.getByCy('step-back-to-left-connector-button').click();
            cy.getByCy('mat017-update-info').should('not.exist');
            cy.getByCy('save-connector-mat017-items').click();
            cy.getByCy('mat017-update-info').should('not.exist');
          });
        }
      );
    });
  });

  describe('Latest update date of mat017Items in iCalc', () => {
    context('Given the user is on the right-connector page, When page has loaded', () => {
      it('should show the last date mat017Item got updated', () => {
        const apiUrl = buildApiPath(apiEndpoints.getMat017ItemsLatestModificationDate);
        const mockedDateISO = '2024-06-14T12:00:00';
        const mockedDateFormatted = '14/06/2024 12:00';
        const mockedResponse = { latestModificationDate: mockedDateISO };

        cy.intercept('GET', apiUrl, (req) => {
          req.reply({
            body: mockedResponse,
          });
        }).as('getlastMat017ItemsUpdateTimeStamp');
        cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.leftConnector);

        cy.wait('@getlastMat017ItemsUpdateTimeStamp').then((interception) => {
          expect(interception.response.body).to.have.property('latestModificationDate');
          expect(interception).to.have.property('response');
          cy.getByCy('mat017-item-latest-modification-date').should('be.visible').contains(mockedDateFormatted);
        });
      });
    });
  });
});
