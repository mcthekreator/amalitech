import {
  icalcIncompleteTestCalculationWithManyAssignments,
  icalcLockedTestCalculation,
  icalcTestCalculation,
  icalcTestCalculationForLocking,
  icalcTestCalculationWithLibraryImage,
  icalcTestCalculationWithLibraryImageAndMat017PinAssignment,
  icalcTestCalculationWithMat017PinAssignment,
  icalcTestCalculationWithRemovedChainflexWithManyAssignments,
  icalcTestCalculationWithRemovedMat017Item,
  icalcTestCalculationWithRemovedMat017ItemWithManyAssignments,
  icalcTestCalculationWithUpdatedChainflexPrice,
  icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments,
  icalcTestCalculationWithUpdatedMat017ItemPrice,
  icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments,
  icalcTestConfiguration,
  icalcTestConfigurationWithRemovedChainflexWithManyAssignments,
  icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments,
  icalcTestConfigurationWithUpdatedChainflexPrice,
  icalcTestConfigurationWithUpdatedChainflexPriceWithManyAssignments,
  icalcTestConfigurationWithUpdatedMat017ItemPriceWithManyAssignments,
  icalcTestConnectorState,
  icalcTestSingleCableCalculation,
} from '@igus/icalc-domain';
import { testUser } from '../../../support/auth.po';
import { apiEndpoints, buildApiPath, externalUrls, selectors, Steps } from '../../../support/utils';

describe('results', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('user');
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

  describe('Given a configuration with chainflex and mat017Items with updated prices', () => {
    before(() => {
      cy.dbSeed('calculation-and-configuration');
      cy.dbSeed('calculation-and-configuration --updatedMat017ItemPrice --manyAssignments');
      cy.dbSeed('calculation-and-configuration --updatedMat017ItemPrice');
      cy.dbSeed('calculation-and-configuration --removedMat017Item --manyAssignments');
      cy.dbSeed('calculation-and-configuration --removedMat017Item');
    });

    context('When results page is open and mat017 item prices were updated', () => {
      it('should show an info box about updated mat017Items prices for multiple configuration', () => {
        cy.clickThroughToStep(
          icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments.calculationNumber,
          Steps.results
        );
        cy.getByCy('mat017-item-price-has-changed-info').should('be.visible');
        cy.getByCy('mat017-item-removed-info').should('not.exist');
        cy.getByCy('assignment-list-item').eq(1).click();
        cy.getByCy('mat017-item-price-has-changed-info').should('be.visible');
      });

      it('should show an info box about updated mat017Items prices for one configuration', () => {
        cy.clickThroughToStep(icalcTestCalculationWithUpdatedMat017ItemPrice.calculationNumber, Steps.results);
        cy.getByCy('mat017-item-price-has-changed-info').should('be.visible');
        cy.getByCy('mat017-item-removed-info').should('not.exist');

        cy.getByCy('show-mat017-item-price-changes').scrollIntoView();
        cy.getByCy('show-mat017-item-price-changes').should('be.visible');
        cy.getByCy('assignment-list-item').eq(1).should('not.exist');
      });

      it('should open a dialog on click that contains information about mat017Items with updated prices', () => {
        cy.clickThroughToStep(
          icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments.calculationNumber,
          Steps.results
        );
        cy.getByCy('show-mat017-item-price-changes').click();
        cy.getByCy('old-mat017-item-price').should(
          'contain.text',
          icalcTestConfigurationWithUpdatedMat017ItemPriceWithManyAssignments.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit.toLocaleString?.(
            'de-DE',
            { minimumFractionDigits: 2 }
          )
        );
        cy.getByCy('cancel-mat017-item-price-update-button').click();
        cy.getByCy('mat017-item-price-has-changed-info').should('be.visible');
        cy.getByCy('amountDividedByPriceUnit').should(
          'contain.text',
          icalcTestConfigurationWithUpdatedMat017ItemPriceWithManyAssignments.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit.toLocaleString?.(
            'de-DE',
            { minimumFractionDigits: 2 }
          )
        );
        cy.getByCy('show-mat017-item-price-changes').click();
        cy.getByCy('confirm-price-update-button').click();

        cy.getByCy('amountDividedByPriceUnit').should(
          'contain.text',
          icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit.toLocaleString?.(
            'de-DE',
            { minimumFractionDigits: 2 }
          )
        );
        cy.getByCy('mat017-item-price-has-changed-info').should('not.exist');
      });
    });

    context('When results page is open and mat017 item prices are invalid or were removed', () => {
      it('Then a info box for removed or invalid mat017 item in one configuration should be shown', () => {
        cy.clickThroughToStep(icalcTestCalculationWithRemovedMat017Item.calculationNumber, Steps.results);

        cy.getByCy('cancel-mat017-item-removal-button').click({ force: true });
        cy.getByCy('mat017-item-price-has-changed-info').should('not.exist');
        cy.getByCy('mat017-item-removed-info').should('be.visible');
        cy.getByCy('show-mat017-item-removals').should('be.visible');
        cy.getByCy('assignment-list-item').eq(1).should('not.exist');
      });

      it('should show info boxes for removed or invalid mat017 item for multiple configuration', () => {
        cy.clickThroughToStep(
          icalcTestCalculationWithRemovedMat017ItemWithManyAssignments.calculationNumber,
          Steps.results
        );

        cy.getByCy('cancel-mat017-item-removal-button').click({ force: true });
        cy.getByCy('mat017-item-price-has-changed-info').should('not.exist');
        cy.getByCy('mat017-item-removed-info').should('be.visible');
        cy.getByCy('assignment-list-item').eq(1).click();
        cy.getByCy('mat017-item-removed-info').should('be.visible');
        cy.getByCy('show-mat017-item-removals').should('be.visible');
      });

      it('Then a dialog should open, which contains information about removed or invalid mat017 items and remove the mat017 items', () => {
        cy.clickThroughToStep(
          icalcTestCalculationWithRemovedMat017ItemWithManyAssignments.calculationNumber,
          Steps.results
        );

        cy.getByCy('mat-number-of-removed-mat017-item').should(
          'contain.text',
          icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments.state.connectorState.leftConnector
            .mat017ItemListWithWidenData[0].matNumber
        );
        cy.getByCy('removed-mat017-item-info').should('be.visible');
        cy.getByCy('old-mat017-item-price').should(
          'contain.text',
          icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit.toLocaleString?.(
            'de-DE',
            { minimumFractionDigits: 2 }
          )
        );
        cy.getByCy('new-mat017-item-price').should(
          'contain.text',
          icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit.toLocaleString?.(
            'de-DE',
            { minimumFractionDigits: 2 }
          )
        );
        cy.getByCy('used-mat017-item-in-pin-assignment').should('contain.text', 'No');
        cy.getByCy('used-mat017-item-in-library').should('contain.text', 'No');

        cy.getByCy('cancel-mat017-item-removal-button').click({ force: true });
        cy.getByCy('amountDividedByPriceUnit').should(
          'contain.text',
          icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit.toLocaleString?.(
            'de-DE',
            { minimumFractionDigits: 2 }
          )
        );
        cy.getByCy('mat017-item-price-has-changed-info').should('not.exist');
        cy.getByCy('show-mat017-item-removals').click();
        cy.getByCy('confirm-mat017-item-removal-button').should('be.disabled');

        const checkboxesForMat017ItemRemoval = 'checkboxesForMat017ItemRemoval';

        cy.viewport(1500, 900);
        cy.getByCy('select-mat017-item-for-removal-checkbox').as(checkboxesForMat017ItemRemoval);
        cy.get(`@${checkboxesForMat017ItemRemoval}`).eq(0).click();
        cy.get(`@${checkboxesForMat017ItemRemoval}`).eq(1).click();
        cy.getByCy('confirm-mat017-item-removal-button').should('be.enabled');
        cy.getByCy('confirm-mat017-item-removal-button').click();
        cy.getByCy('mat017-item-removed-info').should('exist');
        cy.getByCy('complete-configuration-box').should('exist');
      });
    });
  });

  describe('display prices and info boxes', () => {
    before(() => {
      cy.dbSeed('calculation-and-configuration');
      cy.dbSeed('calculation-and-configuration --removedChainflex --manyAssignments');
      cy.dbSeed('calculation-and-configuration --updatedChainflexPrice --manyAssignments');
      cy.dbSeed('calculation-and-configuration --incomplete --manyAssignments');
    });

    it('should show configuration description field', () => {
      cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.results);
      const newDescription = `${icalcTestConfiguration.description}-new-description`;

      cy.getByCy('scc-result-box').scrollIntoView();
      cy.getByCy('configuration-description').should('be.visible');
      cy.getByCy('edit-assignment-button').click();
      cy.getByCy('assign-selected-config-description-input')
        .invoke('val')
        .should('contain', icalcTestConfiguration.description);
      cy.getByCy('assign-selected-config-description-input').clear();
      cy.getByCy('assign-selected-config-description-input').type(newDescription);
      cy.getByCy('save-edited-assignment-button').click();
      cy.getByCy('configuration-description').should('contain.text', newDescription);
    });

    it('should display chainflex, cable length and batch size, connectors, workSteps and total price correctly', () => {
      cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.results);

      cy.getByCy('meta-data-result-box').should('be.visible');
      cy.getByCy('configuration-result-box').should('be.visible');
      cy.getByCy('chainflex-part-number').should('contain.text', icalcTestConfiguration.partNumber);

      cy.getByCy('scc-result-box').should('be.visible');
      cy.getByCy('scc-length').should('contain.text', icalcTestSingleCableCalculation.chainflexLength);
      cy.getByCy('scc-batch-size').should('contain.text', icalcTestSingleCableCalculation.batchSize);

      cy.getByCy('left-connector-result-box').scrollIntoView();
      cy.getByCy('left-connector-result-box').should('be.visible');
      cy.getByCy('left-connector-mat-number').should(
        'contain.text',
        icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber
      );

      cy.getByCy('right-connector-result-box').scrollIntoView();
      cy.getByCy('right-connector-result-box').should('be.visible');
      cy.getByCy('right-connector-mat-number').should('not.exist');

      cy.getByCy('commercial-steps-result-box').scrollIntoView();
      cy.getByCy('commercial-steps-result-box').should('be.visible');

      cy.getByCy('technical-steps-set-select').should('contain.text', 'Standard');
      cy.getByCy('technical-steps-result-box').scrollIntoView();
      cy.getByCy('technical-steps-result-box').should('be.visible');

      cy.getByCy('configuration-price').scrollIntoView();
      cy.getByCy('configuration-price').should('be.visible');
      cy.getByCy('configuration-price').should('contain.text', '23,18');
    });

    it('should display an info box if price of a chainflex in any configuration has changed and update price when confirmed in the overview', () => {
      cy.clickThroughToStep(
        icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments.calculationNumber,
        Steps.results
      );
      cy.getByCy('chainflex-price-has-changed-info').should('be.visible');
      cy.getByCy('chainflex-removed-price-info').should('not.exist');
      cy.getByCy('assignment-list-item').eq(1).click();
      cy.getByCy('chainflex-price-has-changed-info').should('be.visible');
      cy.getByCy('show-chainflex-price-changes').scrollIntoView();
      cy.getByCy('show-chainflex-price-changes').should('be.visible').click();
      cy.getByCy('old-chainflex-price').should(
        'contain.text',
        icalcTestConfigurationWithUpdatedChainflexPriceWithManyAssignments.state.chainFlexState.chainflexCable.price.germanListPrice.toLocaleString?.(
          'de-DE',
          { minimumFractionDigits: 2 }
        )
      );
      cy.getByCy('cancel-price-update-button').should('be.visible').click();
      cy.getByCy('chainflex-price-has-changed-info').should('be.visible');
      cy.getByCy('show-chainflex-price-changes').should('be.visible').click();
      cy.getByCy('confirm-price-update-button').click();
      cy.getByCy('chainflex-price-has-changed-info').should('not.exist');
    });

    it('should display an info box if price of a chainflex in any configuration was removed', () => {
      cy.clickThroughToStep(
        icalcTestCalculationWithRemovedChainflexWithManyAssignments.calculationNumber,
        Steps.results
      );
      cy.getByCy('chainflex-part-number-of-removed-price').should(
        'contain.text',
        icalcTestConfigurationWithRemovedChainflexWithManyAssignments.partNumber
      );
      cy.getByCy('cancel-price-removal-button').click();
      cy.getByCy('chainflex-price-has-changed-info').should('not.exist');
      cy.getByCy('chainflex-removed-price-info').should('be.visible');
      cy.getByCy('assignment-list-item').eq(1).click();
      cy.getByCy('chainflex-removed-price-info').should('be.visible');
      cy.getByCy('show-chainflex-price-removals').click();
      cy.getByCy('confirm-price-removal-button').should('be.disabled');
      cy.getByCy('select-for-price-removal-checkbox').click();
      cy.getByCy('confirm-price-removal-button').click();
      cy.getByCy('chainflex-price-has-changed-info').should('not.exist');
    });

    it('should display an info about incomplete and not approved single cable configurations in the calculation', () => {
      cy.clickThroughToStep(icalcIncompleteTestCalculationWithManyAssignments.calculationNumber, Steps.results);
      cy.getByCy('incomplete-info').should('be.visible').click();
      cy.getByCy('complete-configuration-button').should('be.visible');
      cy.getByCy('configuration-result-box').should('not.exist');
      cy.getByCy('scc-result-box').should('not.exist');
      cy.getByCy('left-connector-result-box').should('not.exist');
      cy.getByCy('right-connector-result-box').should('not.exist');
      cy.getByCy('commercial-steps-result-box').should('not.exist');
      cy.getByCy('technical-steps-result-box').should('not.exist');
      cy.getByCy('disabled-download-excel').should('be.visible');
      cy.getByCy('open-download-excel-dialog').should('not.exist');
    });
  });

  describe('locking and locked calculation', () => {
    before(() => {
      cy.dbSeed('calculation-and-configuration --forLocking');
      cy.dbSeed('calculation-and-configuration --locked');
    });

    it('should lock the calculation when both excel sheets are downloaded', () => {
      const getProcessPage = 'getProcessPage';
      const getCalculationExcel = 'getCalculationExcel';
      const getProductionPlan = 'getProductionPlan';

      cy.intercept('POST', `${buildApiPath(apiEndpoints.process)}*`).as(getProcessPage);
      cy.intercept('POST', `${buildApiPath(apiEndpoints.process)}/createExcelCalculationFile`).as(getCalculationExcel);
      cy.intercept('POST', `${buildApiPath(apiEndpoints.process)}/createExcelProductionPlanFile`).as(getProductionPlan);
      cy.clickThroughToStep(icalcTestCalculationForLocking.calculationNumber, Steps.results);
      cy.wait(`@${getProcessPage}`);

      cy.getByCy('open-download-excel-dialog').click();
      cy.getByCy('export-production-plan-excel').click({ force: true });
      cy.get(selectors.matOption).eq(0).click({ force: true });
      cy.wait(`@${getProductionPlan}`);
      cy.getByCy('export-calculation-excel').click();
      cy.wait(`@${getCalculationExcel}`);
      cy.get('body').click(1, 1);
      cy.getByCy('open-remove-assignment-dialog').should('be.disabled');
      cy.getByCy('open-assign-config-dialog').should('be.disabled');
      cy.getByCy('open-start-new-config-button').should('be.disabled');
    });

    it('should not allow manual overrides for workStep quantites, sets of technical workSteps, calculation factor, risk factors and individual calculation factor when calculation is locked', () => {
      cy.clickThroughToStep(icalcLockedTestCalculation.calculationNumber, Steps.results);
      cy.getByCy('edit-commercial-work-steps-button').should('be.disabled');
      cy.getByCy('edit-technical-work-steps-button').should('be.disabled');
      cy.getByCy('technical-steps-set-select').then((element) => expect(element[0].ariaDisabled).is.equal('true'));
      cy.getByCy('edit-calculation-button').should('be.disabled');
      cy.getByCy('edit-assignment-button').should('be.disabled');
    });
  });

  describe('calculation factors', () => {
    beforeEach(() => {
      cy.dbSeed('calculation-and-configuration --updatedChainflexPrice');
    });

    it('should display correct prices and factors after change and reset of calculation factor and risk factors', () => {
      cy.clickThroughToStep(icalcTestCalculationWithUpdatedChainflexPrice.calculationNumber, Steps.results);
      const newCalculationFactor = 10;
      const newMat017ItemRiskFactor = 3;
      const newMat017ItemAndWorkStepRiskFactor = 4;
      const editCalculationAndRiskFactors = (): void => {
        cy.getByCy('edit-calculation-button').click();
        cy.getByCy('calculation-factor-input').clear();
        cy.getByCy('calculation-factor-input').type(newCalculationFactor.toString());
        cy.getByCy('mat017Item-risk-factor-input').clear();
        cy.getByCy('mat017Item-risk-factor-input').type(newMat017ItemRiskFactor.toString());
        cy.getByCy('mat017Item-and-work-step-risk-factor-input').clear();
        cy.getByCy('mat017Item-and-work-step-risk-factor-input').type(newMat017ItemAndWorkStepRiskFactor.toString());
      };

      editCalculationAndRiskFactors();
      cy.getByCy('cancel-edited-calculation-button').click();
      cy.getByCy('calculation-factor-display').should(
        'contain.text',
        icalcTestCalculationWithUpdatedChainflexPrice.calculationFactor
      );
      cy.getByCy('mat017Item-risk-factor-display').should(
        'contain.text',
        icalcTestCalculationWithUpdatedChainflexPrice.mat017ItemRiskFactor
      );
      cy.getByCy('mat017Item-and-work-steps-risk-factor-display').should(
        'contain.text',
        icalcTestCalculationWithUpdatedChainflexPrice.mat017ItemAndWorkStepRiskFactor
      );

      editCalculationAndRiskFactors();
      cy.getByCy('save-edited-calculation-button').click();

      cy.getByCy('calculation-factor-display').should('contain.text', newCalculationFactor);
      cy.getByCy('mat017Item-risk-factor-display').should('contain.text', newMat017ItemRiskFactor);
      cy.getByCy('mat017Item-and-work-steps-risk-factor-display').should(
        'contain.text',
        newMat017ItemAndWorkStepRiskFactor
      );
      // Test for correct calculation
      cy.getByCy('chainflex-selling-price').should(
        'contain.text',
        (
          icalcTestConfigurationWithUpdatedChainflexPrice.state.chainFlexState.chainflexCable.price.germanListPrice *
          newCalculationFactor
        ).toFixed(0)
      ); //Rabatt = 1
      cy.getByCy('mat-item-selling-price').should(
        'contain.text',
        (
          icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit *
          newMat017ItemRiskFactor *
          newMat017ItemAndWorkStepRiskFactor *
          newCalculationFactor
        ).toFixed(0)
      );
    });

    it('should display correct prices after change of individual calculation factor for assignment', () => {
      cy.clickThroughToStep(icalcTestCalculationWithUpdatedChainflexPrice.calculationNumber, Steps.results);
      const newAssignmentCalculationFactor = 10;

      const editAssignmentCalculationFactor = (): void => {
        cy.getByCy('edit-assignment-button').click();
        cy.getByCy('assignment-calculation-factor-input').focus();
        cy.getByCy('assignment-calculation-factor-input').type(newAssignmentCalculationFactor.toString());
      };

      editAssignmentCalculationFactor();
      cy.getByCy('cancel-edited-assignment-button').click();
      cy.getByCy('assignment-calculation-factor').should('not.exist');

      editAssignmentCalculationFactor();
      cy.getByCy('save-edited-assignment-button').click();
      cy.getByCy('assignment-calculation-factor').should('contain.text', newAssignmentCalculationFactor.toString());

      cy.getByCy('chainflex-selling-price').should(
        'contain.text',
        (
          icalcTestConfigurationWithUpdatedChainflexPrice.state.chainFlexState.chainflexCable.price.germanListPrice *
          newAssignmentCalculationFactor
        ).toFixed(0)
      );

      cy.getByCy('mat-item-selling-price').should(
        'contain.text',
        (
          icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].overrides.amountDividedByPriceUnit *
          icalcTestCalculationWithUpdatedChainflexPrice.mat017ItemRiskFactor *
          icalcTestCalculationWithUpdatedChainflexPrice.mat017ItemAndWorkStepRiskFactor *
          newAssignmentCalculationFactor
        ).toFixed(0)
      );
    });
  });

  describe('adding of assignments', () => {
    before(() => {
      cy.dbSeed('calculation-and-configuration');
    });
    it('should open the meta data page when clicking on "add new calculation" button', () => {
      cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.results);
      cy.getByCy('reset-current-calc-and-config-button').click();
      cy.getByCy('assign-calculation-number').should('contain.value', icalcTestCalculation.calculationNumber);
      cy.url().should('contain', 'meta-data');
    });

    it('should display the added assignment in the list when a new assignment is added to the calculation', () => {
      cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.results);
      cy.getByCy('assign-config-button').click();
      cy.get(selectors.icalcAssignConfigurationSearchDialog)
        .findByExactString(icalcTestConfiguration.matNumber)
        .click();
      cy.getByCy('open-assign-existing-config-or-copy-dialog').click();
      cy.getByCy('open-link-existing-config-dialog').click();
      cy.getByCy('batch-size-link-existing-config-to-existing-calc').type('1');
      cy.getByCy('chainflex-length-link-existing-config-to-existing-calc').type('1');
      cy.getByCy('link-existing-config-with-existing-calc').click();
      cy.getByCy('assignment-list-item').should('have.length', 2);
    });
  });

  describe('navigation from result page to last complete step', () => {
    context(
      'Given a configuration with the same mat017 item selected for leftConnector, rightConnector, library image on left side' +
        'and pin assignment selection for mat017 option on left side.\n' +
        'When landing on results page',
      () => {
        before(() => {
          cy.dbSeed('calculation-and-configuration --imageInLibrary -mat017PA');
        });
        it(
          'should show complete configuration on results page\n' +
            'and open pin assignment page when navigating to pin assignment page.',
          () => {
            cy.clickThroughToStep(
              icalcTestCalculationWithLibraryImageAndMat017PinAssignment.calculationNumber,
              Steps.results
            );
            cy.getByCy('incomplete-info').should('not.exist');
            cy.getByCy('assignment-data-cf-len-batch-size').should('be.visible');
            cy.getByCy('configuration-list-item-price').should('be.visible');
            cy.get(selectors.step).eq(5).click();
            cy.getByCy('pin-assignment-title').should('be.visible');
          }
        );
      }
    );

    context(
      'Selected a calculation that have one complete and one incomplete configuration and chosen the complete configuration on meta data page to navigate to results page.\n' +
        'Additional Information: The incomplete configuration state can be created by navigating to according connector page, after the configuration was complete, and adding or removing mat017 items from this configurations connector sides.',
      () => {
        context(
          'Given an incomplete configuration with no mat017 items selected for leftConnector \n' +
            'and one mat017 item image displayed in library on the left side.\n' +
            'When landing on results page',
          () => {
            before(() => {
              cy.dbSeed(
                'calculation-and-configuration --imageInLibrary --manyAssignments --removedMat017ItemOnLeftConnector'
              );
            });
            it(
              'should show incomplete configuration as incomplete\n' +
                'and redirect to leftConnector when navigating to pin assignment page',
              () => {
                cy.clickThroughToStep(icalcTestCalculationWithLibraryImage.calculationNumber, Steps.results);
                cy.getByCy('incomplete-info').should('be.visible').should('have.length', 1);
                cy.getByCy('configuration-list-item-price').should('have.length', 1);
                cy.getByCy('assignment-list-item').eq(1).click();
                cy.getByCy('complete-configuration-button').should('be.visible');
                cy.get(selectors.step).eq(5).click();
                cy.getByCy('show-remove-mat017-item-button').should('not.exist');
                cy.getByCy('save-connector-mat017-items').should('be.disabled');
                cy.get(selectors.step).eq(2).invoke('attr', 'class').should('contain', 'active');
              }
            );
          }
        );
        context(
          'Given an incomplete configuration with only one mat017 item selected for leftConnector\n' +
            'and a different mat017 item image displayed in library on the left side.\n' +
            'When landing on results page',
          () => {
            before(() => {
              cy.dbSeed('calculation-and-configuration --imageInLibrary --manyAssignments --addNotSelectedMat017Item');
            });

            it(
              'should show incomplete configuration as incomplete\n' +
                'and redirect to library when navigating to pin assignment page.',
              () => {
                cy.clickThroughToStep(icalcTestCalculationWithLibraryImage.calculationNumber, Steps.results);
                cy.getByCy('incomplete-info').should('be.visible').should('have.length', 1);
                cy.getByCy('configuration-list-item-price').should('have.length', 1);
                cy.getByCy('assignment-list-item').eq(1).click();
                cy.getByCy('complete-configuration-button').should('be.visible');
                cy.get(selectors.step).eq(5).click();
                cy.get(selectors.step).eq(4).invoke('attr', 'class').should('contain', 'active');
                cy.getByCy('library-image').invoke('attr', 'class').should('contain', 'border-red');
                cy.getByCy('save-library').should('be.disabled');
              }
            );
          }
        );
        context(
          'Given an incomplete configuration with only one mat017 item selected for leftConnector\n' +
            'and a different mat017 item in pin assignments selection for mat017 option on the left side.\n' +
            'When landing on results page',
          () => {
            before(() => {
              cy.dbSeed(
                'calculation-and-configuration --mat017PinAssignment --manyAssignments --addNotSelectedMat017Item'
              );
            });
            it(
              'should show incomplete configuration as incomplete\n' +
                'and open pin assignment page when navigating to pin assignment page.',
              () => {
                cy.clickThroughToStep(icalcTestCalculationWithMat017PinAssignment.calculationNumber, Steps.results);
                cy.getByCy('incomplete-info').should('be.visible').should('have.length', 1);
                cy.getByCy('configuration-list-item-price').should('have.length', 1);
                cy.getByCy('assignment-list-item').eq(1).click();
                cy.getByCy('complete-configuration-button').should('be.visible');
                cy.get(selectors.step).eq(5).click();
                cy.get(selectors.step).eq(5).invoke('attr', 'class').should('contain', 'active');
                cy.getByCy('pin-assignment-title').should('be.visible');
              }
            );
          }
        );
        context(
          'Given an incomplete configuration with only one mat017 item selected for leftConnector\n' +
            'and the same mat017 item image displayed in library on the right side\n' +
            'and no mat017 item selected for rightConnector.\n' +
            'When landing on results page',
          () => {
            before(() => {
              cy.dbSeed('calculation-and-configuration --imageInLibrary --manyAssignments --applyMat017ItemToRight');
            });
            it(
              'should show incomplete configuration as incomplete\n' +
                'and redirect to library when navigating to pin assignment page.',
              () => {
                cy.clickThroughToStep(icalcTestCalculationWithLibraryImage.calculationNumber, Steps.results);
                cy.getByCy('incomplete-info').should('be.visible').should('have.length', 1);
                cy.getByCy('configuration-list-item-price').should('have.length', 1);
                cy.getByCy('assignment-list-item').eq(1).click();
                cy.getByCy('complete-configuration-button').should('be.visible');
                cy.get(selectors.step).eq(5).click();
                cy.get(selectors.step).eq(4).invoke('attr', 'class').should('contain', 'active');
                cy.getByCy('library-image').invoke('attr', 'class').should('contain', 'border-red');
                cy.getByCy('save-library').should('be.disabled');
              }
            );
          }
        );
        context(
          'Given an incomplete configuration with only one mat017 item selected for the leftConnector\n' +
            'and the same mat017 item selected in pin assignments selection for mat017 option on the right side\n' +
            'and no mat017 item selected for rightConnector.\n' +
            'When landing on results page',
          () => {
            before(() => {
              cy.dbSeed(
                'calculation-and-configuration --mat017PinAssignment --manyAssignments --applyMat017ItemToRight'
              );
            });
            it(
              'should show incomplete configuration as incomplete\n' +
                'and open pin assignment page when navigating to pin assignment page.',
              () => {
                cy.clickThroughToStep(icalcTestCalculationWithMat017PinAssignment.calculationNumber, Steps.results);
                cy.getByCy('incomplete-info').should('be.visible').should('have.length', 1);
                cy.getByCy('configuration-list-item-price').should('have.length', 1);
                cy.getByCy('assignment-list-item').eq(1).click();
                cy.getByCy('complete-configuration-button').should('be.visible');
                cy.get(selectors.step).eq(5).click();
                cy.get(selectors.step).eq(5).invoke('attr', 'class').should('contain', 'active');
                cy.getByCy('pin-assignment-title').should('be.visible');
              }
            );
          }
        );
      }
    );
  });
});
