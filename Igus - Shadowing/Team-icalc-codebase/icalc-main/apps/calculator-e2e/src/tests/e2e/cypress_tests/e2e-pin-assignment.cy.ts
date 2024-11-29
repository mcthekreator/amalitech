import {
  icalcTestCalculation,
  icalcTestCalculationWithMat017PinAssignment,
  icalcTestConfiguration,
} from '@igus/icalc-domain';
import { testUser } from '../../../support/auth.po';
import { apiEndpoints, buildApiPath, externalUrls, selectors, Steps } from '../../../support/utils';

describe('pin-assignment', () => {
  before(() => {
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration');
    cy.dbSeed('calculation-and-configuration --mat017PinAssignment');
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

  it('should show correct number of lines is shown depending of the chainflex structure', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);

    cy.getByCy('core-left').should(
      'have.length',
      icalcTestConfiguration.state.chainFlexState.chainflexCable.numberOfCores
    );

    cy.getByCy('core-right').should(
      'have.length',
      icalcTestConfiguration.state.chainFlexState.chainflexCable.numberOfCores
    );
  });

  it('should be able to edit bridges', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);

    cy.getByCy('edit-bridges').containsTranslated('editBridges').click();

    // bridge 1
    cy.getByCy('connector-dot').first().click();
    cy.getByCy('connector-dot').eq(10).click();
    // bridge 2
    cy.getByCy('connector-dot').eq(22).click();
    cy.getByCy('connector-dot').eq(62).click();
    // bridge 3
    cy.getByCy('connector-dot').eq(5).click();
    cy.getByCy('connector-dot').eq(125).click();

    cy.getByCy('edit-bridges').containsTranslated('saveBridges').click();
    cy.getByCy('bridge-up').eq(10).should('be.visible');
    cy.getByCy('bridge-up').eq(62).should('be.visible');
    cy.getByCy('bridge-up').eq(125).should('be.visible');
  });

  it('should be able connect all shields on housing', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);

    cy.getByCy('left-pin-automation-action-selection').click();
    cy.get(selectors.matOption).eq(0).should('exist');
    cy.get(selectors.matOption).eq(1).should('exist').containsTranslated('connectAllShieldsOnHousing').click();
    cy.getByCy('shield-form-select').containsTranslated('placeOnJacket');
  });

  it('should be able set all cores on contact', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);

    cy.getByCy('left-pin-automation-action-selection').click();
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('setAllCoresOnContact').click();

    cy.getByCy('core-form-select')
      .filterByTranslatedString('setOnContact')
      .should('have.length', icalcTestConfiguration.state.chainFlexState.chainflexCable.numberOfCores);
  });

  it('should trigger validation correctly', () => {
    cy.intercept('POST', `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`).as(
      'saveSingleCableCalculationRequest'
    );

    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);

    cy.getByCy('core-form-select').first().click();
    cy.get(selectors.matMenuItem).eq(0).should('exist');
    cy.get(selectors.matMenuItem).eq(1).should('exist').containsTranslated('setOnContact').click();
    cy.get(selectors.matMenuItem).eq(2).should('exist');
    cy.get(selectors.matMenuItem).eq(3).should('exist');
    cy.get(selectors.matMenuItem).eq(5).should('exist');
    cy.get(selectors.matMenuItem).eq(4).should('exist');
    cy.getByCy('core-form-pin-input').type('Zz');

    cy.getByCy('save-and-validate-configuration').click();

    cy.getByCy('approve-and-go-to-result').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');
    cy.location('pathname').should('contain', 'app/results');

    cy.getByCy('inform-user-about-work-steps').should('be.visible').containsTranslated('overrideInformationHeadline', {
      matNumber: icalcTestConfiguration.matNumber,
    });

    cy.getByCy('inform-user-about-work-steps-close').click();
    cy.getByCy('inform-user-about-work-steps').should('not.exist');

    // go back to pin assignment and forth to results again: validation dialog should not show again
    cy.getByCy('back-to-pin-assignment').click();
    cy.location('pathname').should('contain', 'app/pin-assignment');
    cy.getByCy('approve-and-go-to-result').should('not.exist');
    cy.getByCy('save-and-validate-configuration').click();
    cy.wait('@saveSingleCableCalculationRequest');
    cy.location('pathname').should('contain', 'app/results');
    cy.getByCy('inform-user-about-work-steps').should('not.exist');
  });

  it('should be able to reset left & right sub-values and action selections', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);

    const numberOfCores = Number(icalcTestConfiguration.state.chainFlexState.chainflexCable.numberOfCores);

    // set actions and sub values on left side
    cy.getByCy('left-pin-automation-action-selection').click();
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('setAllCoresOnContact').click();
    cy.getByCy('left-pin-automation-sub-values-selection').click();
    cy.get(selectors.matOption).eq(0).should('exist').click();

    // reset left sub values
    cy.getByCy('left-reset-sub-values-button').click();
    cy.getByCy('reset-pin-automation-values-button').click();

    cy.getByCy('core-form-select').filterByTranslatedString('setOnContact').should('have.length', numberOfCores); // check if left actions are still set

    // set actions and sub values on right side
    cy.getByCy('right-pin-automation-action-selection').click();
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('setAllCoresOnContact').click();
    cy.getByCy('right-pin-automation-sub-values-selection').click();
    cy.get(selectors.matOption).eq(0).should('exist').click();

    // reset right sub values
    cy.getByCy('right-reset-sub-values-button').click();
    cy.getByCy('reset-pin-automation-values-button').click();

    cy.getByCy('core-form-select')
      .filterByTranslatedString('setOnContact')
      .should('have.length', numberOfCores * 2); // check if left & right actions are still set

    // reset left actions
    cy.getByCy('left-reset-actions-button').click();
    cy.getByCy('reset-pin-automation-actions-button').click();

    // reset right actions
    cy.getByCy('right-reset-actions-button').click();
    cy.getByCy('reset-pin-automation-actions-button').click();

    cy.getByCy('core-form-select').filterByTranslatedString('setOnContact').should('have.length', 0); // check if left & right actions have been removed
  });

  describe('MAT017 Item selection', () => {
    before(() => {
      cy.dbSeed('calculation-and-configuration');
    });

    it('should show MAT017 picker button and save correct selection when MAT017 pin assignment option is selected', () => {
      cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.pinAssignment);
      cy.getByCy('core-form-select').eq(0).should('exist').click();
      cy.get(selectors.matMenuItem).eq(2).should('exist').click();
      cy.getByCy('pick-mat017-item-button').should('exist').click();
      cy.getByCy('mat017-item-picker-row').should(
        'have.length',
        icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData.length
      );
      cy.getByCy('mat017-item-picker-row').eq(0).should('exist').click();
      cy.getByCy('confirm-mat017-item-selection').should('be.enabled').click();
      cy.getByCy('save-and-validate-configuration').click();
      cy.getByCy('pin-assignment-left-display').eq(0).should('contain.text', 'MAT017');
      cy.getByCy('pin-assignment-left-display')
        .eq(0)
        .should(
          'contain.text',
          icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber
        );
    });

    it('should remove MAT017 item as MAT017 pin assignment option when connector item is removed', () => {
      cy.clickThroughToStep(icalcTestCalculationWithMat017PinAssignment.calculationNumber, Steps.leftConnector);
      cy.getByCy('remove-from-MAT017-item-list').eq(1).should('exist');
      cy.getByCy('remove-from-MAT017-item-list').eq(1).click();
      cy.getByCy('save-connector-mat017-items').click();
      cy.getByCy('save-connector-mat017-items').click();
      cy.getByCy('save-library').click();
      cy.getByCy('pick-mat017-item-button').should('be.visible');
      cy.getByCy('pick-mat017-item-button').click();
      cy.getByCy('mat017-item-picker-row').should(
        'have.length',
        icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData.length - 1
      );
      // close mat017-item-selection dropdown
      cy.getByCy('cancel-mat017-item-selection').click();

      cy.getByCy('save-and-validate-configuration').click();
      cy.getByCy('pin-assignment-left-display').eq(0).should('contain.text', 'MAT017');
      cy.getByCy('pin-assignment-left-display').eq(0).should('contain.text', '?');
    });
  });
});
