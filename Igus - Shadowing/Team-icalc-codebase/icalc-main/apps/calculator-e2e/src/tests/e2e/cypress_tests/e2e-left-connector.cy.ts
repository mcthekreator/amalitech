import {
  manuallyCreatedMat017ItemMatNumber,
  Mat017ItemStatus,
  createGetMat017Response,
  createMat017Item,
  icalcLockedTestCalculation,
  icalcTestCalculation,
  icalcTestCalculationWithManuallyCreatedItem,
  icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites,
  icalcTestConfigurationWithManuallyCreatedItem,
  icalcTestConfigurationWithUpdatedMat017ItemPriceInFavorites,
} from '@igus/icalc-domain';
import { testUser } from '../../../support/auth.po';
import { Steps, apiEndpoints, buildApiPath, externalUrls, selectors } from '../../../support/utils';

describe('left connector', () => {
  before(() => {
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration');
    cy.dbSeed('calculation-and-configuration --locked');
    cy.dbSeed('calculation-and-configuration --updatedMat017ItemPriceInFavorites');
    cy.dbSeed('calculation-and-configuration --manuallyCreatedMat017Item');
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
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.leftConnector);

    cy.getByCy('connector-select-sets-button').should('be.visible');
    cy.getByCy('connector-select-sets-button').should('be.enabled');
  });

  it('should show disabled select connector sets button for locked calculations', () => {
    cy.clickThroughToStep(icalcLockedTestCalculation.calculationNumber, Steps.leftConnector);

    cy.getByCy('connector-select-sets-button').should('be.visible');
    cy.getByCy('connector-select-sets-button').should('be.disabled');
  });

  describe('Apply filter for showing only manually created items', () => {
    context('Given an opened left Connector page\n' + 'When filtering for only manually added items', () => {
      it('Then the filter for all connectors including unmatched should be checked and only manually created items should be displayed', () => {
        // Given
        cy.clickThroughToStep(icalcTestCalculationWithManuallyCreatedItem.calculationNumber, Steps.leftConnector);
        // When
        cy.getByCy('mat017item-filter-button').click();
        cy.getByCy('filter-manually-created').click();
        cy.getByCy('mat017item-search-field').type(manuallyCreatedMat017ItemMatNumber);
        // Then
        cy.getByCy('apply-filter-button').click();
        cy.getByCy('results-table-mat-number-cell')
          .eq(0)
          .should(
            'contain',
            icalcTestConfigurationWithManuallyCreatedItem.state.connectorState.leftConnector
              .mat017ItemListWithWidenData[0].matNumber
          );
        cy.getByCy('show-zero-matches-filter-active').should('be.visible');
        cy.getByCy('show-only-manually-created-filter-active').should('be.visible');
      });
    });
  });

  describe('delete manually created mat017 item for locked calculation', () => {
    context(
      'Given a newly created mat017 item in result table for a locked calculation.\n' +
        'When on leftConnector page and trying to click the delete icon',
      () => {
        it('it should be visible but disabled and not clickable', () => {
          cy.intercept(
            'GET',
            `${buildApiPath(apiEndpoints.mat017Item)}?orderDirection=desc&search=&skip=0&take=100&orderBy=score&showZeroMatches=false&showOnlyManuallyCreated=false&partNumber=*&items=*`,
            createGetMat017Response({
              data: [
                createMat017Item({
                  matNumber: manuallyCreatedMat017ItemMatNumber,
                  manuallyCreated: true,
                  itemDescription1: null,
                  mat017ItemGroup: null,
                  amountDividedByPriceUnit: null,
                  itemStatus: Mat017ItemStatus.active,
                }),
              ],
            })
          ).as('getMat017ItemRequest');

          cy.clickThroughToStep(icalcLockedTestCalculation.calculationNumber, Steps.leftConnector);

          cy.getByCy('results-table-mat-number-cell').eq(0).should('contain', manuallyCreatedMat017ItemMatNumber);

          cy.getByCy('result-table-delete-item-button').should('be.visible');
          cy.getByCy('result-table-delete-item-button').should('be.disabled');
        });
      }
    );
  });

  describe('manually created mat017 item deletion', () => {
    context('Given a newly created mat017 item in result table.\n' + 'When clicking on delete icon', () => {
      it('then it should open and close a delete warning dialog and should open a delete warning dialog and delete mat017 item', () => {
        cy.clickThroughToStep(icalcTestCalculationWithManuallyCreatedItem.calculationNumber, Steps.leftConnector);

        cy.getByCy('mat017item-filter-button').click();
        cy.getByCy('filter-manually-created').click();
        cy.getByCy('mat017item-search-field').type(manuallyCreatedMat017ItemMatNumber);
        cy.getByCy('apply-filter-button').click();
        cy.getByCy('results-table-mat-number-cell')
          .eq(0)
          .should(
            'contain',
            icalcTestConfigurationWithManuallyCreatedItem.state.connectorState.leftConnector
              .mat017ItemListWithWidenData[0].matNumber
          );

        cy.getByCy('result-table-delete-item-button').should('be.visible');
        cy.getByCy('result-table-delete-item-button').eq(0).click();
        cy.getByCy('warning-cancel-button').click();
        cy.getByCy('result-table-delete-item-button').eq(0).click();
        cy.getByCy('warning-header').should('be.visible');
        cy.getByCy('warning-message').should('be.visible');
        cy.getByCy('warning-confirm-button').click();
      });
    });
  });

  describe('connector set templates dialog', () => {
    context('Given any configuration.\n' + 'When clicking on connector set templates button, ', () => {
      it('then it should open and close connector set templates dialog.', () => {
        cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.leftConnector);

        cy.getByCy('connector-select-sets-button').click();
        cy.getByCy('connector-sets-dialog').should('exist');
        cy.getByCy('connector-sets-dialog').should('be.visible');
        cy.getByCy('close-connector-sets-dialog-button').click();
        cy.getByCy('connector-sets-dialog').should('not.exist');
      });
    });

    context(
      'Given any configuration and a connector set including invalid and "removed" items.\n' +
        'When clicking on connector set templates button and opening the according connector set template, ',
      () => {
        it('then it should display mat017 item in connector set template correctly depending on item status (valid, invalid and "removed").', () => {
          cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.leftConnector);

          const favoritesResponse = {
            status: { statusCode: 200 },
            body: [
              {
                id: 'exampleConnectorSetId',
                name: 'example connector set template',
                favoritesToMat017Items: [
                  {
                    id: 'mat017ExampleId',
                    favoritesId: 'exampleConnectorSetId',
                    matNumber: 'exampleMatNumber',
                    amount: 1,
                    mat017Item: createMat017Item(),
                  },
                  {
                    id: 'mat017ExampleIdInvalid',
                    favoritesId: 'exampleConnectorSetId',
                    matNumber: 'exampleMatNumberInvalid',
                    amount: 1,
                    mat017Item: createMat017Item({
                      itemDescription1: null,
                      itemStatus: Mat017ItemStatus.inactive,
                    }),
                  },
                  {
                    id: 'mat017ExampleIdRemoved',
                    favoritesId: 'exampleConnectorSetId',
                    matNumber: 'exampleMatNumberRemoved',
                    amount: 1,
                    mat017Item: createMat017Item({
                      itemStatus: Mat017ItemStatus.removed,
                    }),
                  },
                ],
              },
            ],
          };

          cy.intercept('GET', `${buildApiPath(apiEndpoints.favorites)}`, favoritesResponse).as('favoritesRequest');

          cy.getByCy('connector-select-sets-button').click();
          cy.getByCy('favorites-expansion-panel').click();

          cy.getByCy('individual-connector-item-checkbox').should('have.length', 3);

          cy.getByCy('individual-connector-item-checkbox').eq(0).as('validItemCheckBox');
          cy.get('@validItemCheckBox').should('exist');

          cy.getByCy('individual-connector-item-checkbox').eq(1).as('invalidItemCheckBox');
          cy.get('@invalidItemCheckBox').should('exist');
          cy.get('@invalidItemCheckBox').should('have.class', 'mat-mdc-checkbox-disabled');

          cy.getByCy('individual-connector-item-checkbox').eq(2).as('removedItemCheckBox');
          cy.get('@removedItemCheckBox').should('exist');
          cy.get('@removedItemCheckBox').should('have.class', 'mat-mdc-checkbox-disabled');

          cy.getByCy('connector-set-itemDescription1-cell').should('have.length', 3);
          cy.getByCy('connector-set-itemDescription1-cell').eq(0).as('validItemDescription1');
          cy.get('@validItemDescription1').should(
            'have.text',
            ` ${favoritesResponse.body[0].favoritesToMat017Items[0].mat017Item.itemDescription1} `
          );

          cy.getByCy('connector-set-itemDescription1-cell').eq(1).as('invalidItemDescription1');
          cy.get('@invalidItemDescription1').shouldContainTranslated('notAvailable');

          cy.getByCy('connector-set-itemDescription1-cell').eq(2).as('removedItemDescription1');
          cy.get('@removedItemDescription1').should('be.empty');
        });
      }
    );
  });

  describe('invalid items in results table', () => {
    context(
      'Given any configuration and an existing invalid item in the database.\n' +
        'When reaching the left connector page, ',
      () => {
        it('then it should show invalid items correctly in results table.', () => {
          cy.intercept(
            'GET',
            `${buildApiPath(
              apiEndpoints.mat017Item
            )}?orderDirection=desc&search=&skip=0&take=100&orderBy=score&showZeroMatches=false&showOnlyManuallyCreated=false&partNumber=*&items=*`,
            createGetMat017Response({
              data: [
                createMat017Item({
                  itemDescription1: null,
                  mat017ItemGroup: null,
                  amountDividedByPriceUnit: null,
                  itemStatus: Mat017ItemStatus.inactive,
                }),
              ],
            })
          ).as('getMat017ItemRequest');

          cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.leftConnector);

          const addMat017ItemButtonOfInvalidItem = 'addMat017ItemButtonOfInvalidItem';

          cy.getByCy('add-mat017-item').eq(0).as(addMat017ItemButtonOfInvalidItem);
          cy.get(`@${addMat017ItemButtonOfInvalidItem}`).should('exist');
          cy.get(`@${addMat017ItemButtonOfInvalidItem}`).should('be.disabled');

          cy.getByCy('results-table-itemDescription1-cell').eq(0).as('invalidItemDescription1');
          cy.get('@invalidItemDescription1').shouldContainTranslated('notAvailable');

          cy.getByCy('results-table-mat017ItemGroup-cell').eq(0).as('invalidGroup');
          cy.get('@invalidGroup').shouldContainTranslated('notAvailable');

          cy.getByCy('results-table-amountDividedByPriceUnit-cell').eq(0).as('invalidPrice');
          cy.get('@invalidPrice').shouldContainTranslated('notAvailable');
        });
      }
    );
  });

  describe('item with outdated price (included in connector set) in configuration', () => {
    context(
      'Given a configuration with a MAT017 item with an outdated price (included in connector set) on the right side.',
      () => {
        context('When selecting that item on the left side, ', () => {
          it('then it should show an information dialog about the price difference.', () => {
            cy.clickThroughToStep(
              icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites.calculationNumber,
              Steps.leftConnector
            );

            cy.getByCy('mat017item-search-field').type(
              icalcTestConfigurationWithUpdatedMat017ItemPriceInFavorites.state.connectorState.rightConnector
                .mat017ItemListWithWidenData[0].matNumber
            );
            cy.getByCy('mat017item-filter-button').click();
            cy.getByCy('filter-zero-matches').click();
            cy.getByCy('apply-filter-button').click();
            cy.getByCy('sort-by-mat-number').click();
            cy.getByCy('add-mat017-item').eq(0).click();
            cy.getByCy('price-mismatch-header').should('be.visible');
            cy.getByCy('cancel-solve-dialog').should('be.visible');
            cy.getByCy('cancel-solve-dialog').click();
          });
        });

        context('When selecting the connector set that includes that item on the left side, ', () => {
          it('then it should show an information dialog about the price difference.', () => {
            cy.clickThroughToStep(
              icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites.calculationNumber,
              Steps.leftConnector
            );

            cy.getByCy('connector-select-sets-button').click();
            cy.get('mat-accordion')
              .first()
              .within(() => {
                cy.getByCy('connector-set-item-checkbox').find(selectors.checkboxInput).check();
              });
            cy.getByCy('add-selected-connector-sets-dialog-button').click();

            cy.getByCy('price-mismatch-header').should('be.visible');
          });
        });
      }
    );
  });

  describe('Latest update date of mat017Items in iCalc', () => {
    context('Given the user is on the left-connector page, When page has loaded', () => {
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
