import {
  ICALC_DYNAMIC_CALC_NUMBER_PREFIX,
  icalcLockedTestCalculation,
  icalcLockedTestConfiguration,
  icalcLockedTestSingleCableCalculation,
  icalcTestCalculation,
  icalcTestConfiguration,
  icalcTestConfigurationForRemoval,
  icalcTestConfigurationWithManyAssignments,
  icalcTestConfigurationWithOneAssignment,
  icalcTestSingleCableCalculation,
} from '@igus/icalc-domain';
import { apiEndpoints, buildApiPath, externalUrls, selectors } from '../../../support/utils';
import { testUser } from '../../../support/auth.po';

describe('meta-data', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration');
    cy.dbSeed('calculation-and-configuration --manyAssignments');
    cy.dbSeed('calculation-and-configuration --forRemoval');
    cy.dbSeed('calculation-and-configuration --locked');
    cy.dbSeed('calculation-and-configuration --oneAssignment');
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

  it('should be able to create a new calculation and configuration', () => {
    const newCalculationNumber = `${icalcTestCalculation.calculationNumber}-new`;
    const newConfigurationNumber = `${icalcTestConfiguration.matNumber}-new`;
    const labeling = 'new label';
    const description = 'new configuration description';
    const batchSize = '1';
    const newCalculationFactor = '2';
    const newQuoteNumber = 'new Quote Number';
    const newCustomer = 'new Customer';

    cy.intercept('POST', `${buildApiPath(apiEndpoints.createCalculationAndConfiguration)}`).as(
      'createCalculationAndConfiguration'
    );
    cy.intercept('POST', `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`).as('saveSingleCableCalculation');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.chainflex)}?orderDirection=asc&search=&skip=0&take=100&orderBy=partNumber`
    ).as('getChainflexListRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('assign-calculation-number').focus();
    cy.getByCy('assign-calculation-number').should('be.visible').type(newCalculationNumber);
    cy.getByCy('assign-calculation-item-quote-number').focus();
    cy.getByCy('assign-calculation-item-quote-number').should('be.visible').type(newQuoteNumber);
    cy.getByCy('assign-selected-calculation-item-customer').should('be.visible').type(newCustomer);

    cy.getByCy('choose-selected-calc-customer-type').should('be.visible').click();
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('serialCustomer');
    cy.get(selectors.matOption).eq(1).should('exist').containsTranslated('betriebsMittler').click();
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('betriebsMittler');

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();
    cy.getByCy('assign-selected-calculation-item-calculation-factor').type('test string');
    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(newCalculationFactor);
    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('have.value', newCalculationFactor);
    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').type(newConfigurationNumber);

    cy.getByCy('assign-selected-config-description').should('be.visible').focus();
    cy.getByCy('assign-selected-config-description').type(description);
    cy.getByCy('assign-selected-config-description').should('have.value', description);

    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').focus();
    cy.getByCy('assign-selected-config-labeling-left').type(labeling);
    cy.getByCy('assign-selected-config-batch-size').should('be.visible').focus();
    cy.getByCy('assign-selected-config-batch-size').type(batchSize);

    cy.getByCy('assign-selected-config-item-config-number').should('have.value', newConfigurationNumber);
    // TODO: find a way in meta-data component to wait for the debounced values until next button gets enabled
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100); // wait equals the debounceTime on the metaDataForm
    cy.getByCy('start-calculation').should('not.be.disabled').click();

    cy.wait('@createCalculationAndConfiguration')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('configuration');
        expect(body).to.have.property('calculation');
        expect(body.calculation.calculationFactor).to.eq(parseInt(newCalculationFactor, 10));
        expect(body.calculation).to.have.property('singleCableCalculations');
      });

    cy.getByCy('back-to-meta-data').click();
    cy.wait('@saveSingleCableCalculation')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('singleCableCalculation');
      });
    cy.getByCy('calculation-items-input-select').contains(newCalculationNumber);
    cy.getByCy('assign-selected-calculation-item-quote-number').invoke('val').should('contain', newQuoteNumber);
    cy.getByCy('assign-selected-calculation-item-customer').invoke('val').should('contain', newCustomer);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('betriebsMittler');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', newCalculationFactor);
    cy.getByCy('select-config-number').contains(newConfigurationNumber);
    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSize);

    cy.getByCy('assign-selected-config-description').invoke('val').should('contain', description);
  });

  it('should be able to assign new configuration to existing calculation', () => {
    const batchSizeForNewAssignment = '2';
    const descriptionForNewAssignment = `${icalcTestConfiguration.description}-for-new-configuration`;
    const emptyConfigurationMatNumber = `${icalcTestConfiguration.matNumber}-irrelevant`;

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.createNewConfigurationForExistingCalculation)}`).as(
      'createNewConfigurationForExistingCalculation'
    );

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=${
        icalcTestConfiguration.matNumber
      }&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithFilterRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();

    cy.wait('@filterConfigurationItemsWithNoFilterRequest');

    cy.getByCy('configurationSearchFormInput').should('be.visible').focus();
    cy.getByCy('configurationSearchFormInput').type(icalcTestConfiguration.matNumber);
    cy.wait('@filterConfigurationItemsWithFilterRequest');

    cy.contains(icalcTestCalculation.calculationNumber).click();

    cy.getByCy('edit-calculation').click();
    cy.getByCy('clear-to-add-new-config').click();

    cy.getByCy('assign-selected-config-item-config-number').type(emptyConfigurationMatNumber);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getByCy('assign-selected-config-batch-size').type(batchSizeForNewAssignment);
    cy.getByCy('assign-selected-config-description').clear();
    cy.getByCy('assign-selected-config-description').type(descriptionForNewAssignment);

    // TODO: find a way in meta-data component to wait for the debounced values until next button gets enabled
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100); // wait equals the debounceTime on the metaDataForm
    cy.getByCy('start-calculation').click();

    cy.wait('@createNewConfigurationForExistingCalculation')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('configuration');
        expect(body.configuration).to.have.property('description');
        expect(body).to.have.property('calculation');
        const { calculation } = body;

        expect(calculation).to.have.property('singleCableCalculations');
      });

    cy.getByCy('back-to-meta-data').click();

    cy.getByCy('calculation-items-input-select').contains(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', icalcTestCalculation.quoteNumber);
    cy.getByCy('assign-selected-calculation-item-customer')
      .invoke('val')
      .should('contain', icalcTestCalculation.customer);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcTestCalculation.calculationFactor);
    cy.getByCy('select-config-number').contains(emptyConfigurationMatNumber);
    cy.getByCy('assign-selected-config-description').invoke('val').should('contain', descriptionForNewAssignment);
    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSizeForNewAssignment);
  });

  it('should be able to link existing configuration to existing calculation', () => {
    const batchSizeForNewAssignment = '2';
    const chainflexLengthForNewAssignment = '2';

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.chainflex)}?orderDirection=asc&search=&skip=0&take=100&orderBy=partNumber`
    ).as('getChainflexListRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');

    cy.contains(icalcTestConfiguration.matNumber).click();

    cy.getByCy('edit-calculation').click();
    cy.getByCy('open-assign-config-dialog').click();

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=${
        icalcTestConfiguration.matNumber
      }&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithFilterRequest');

    cy.getByCy('configurationSearchFormInput').should('be.visible').focus();
    cy.getByCy('configurationSearchFormInput').type(icalcTestConfiguration.matNumber);
    cy.wait('@filterConfigurationItemsWithFilterRequest');

    cy.get(selectors.icalcAssignConfigurationSearchDialog).findByExactString(icalcTestConfiguration.matNumber).click();

    cy.getByCy('open-assign-existing-config-or-copy-dialog').click();
    cy.getByCy('open-link-existing-config-dialog').click();

    cy.get(selectors.icalcAssignConfigurationDialog).should('exist');

    cy.getByCy('batch-size-link-existing-config-to-existing-calc').type(batchSizeForNewAssignment);
    cy.getByCy('chainflex-length-link-existing-config-to-existing-calc').type(chainflexLengthForNewAssignment);

    cy.getByCy('link-existing-config-with-existing-calc').click();

    cy.get(selectors.icalcAssignConfigurationDialog).should('not.exist');

    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSizeForNewAssignment);
    cy.getByCy('assign-selected-config-description')
      .invoke('val')
      .should('contain', icalcTestConfiguration.description);
    cy.getByCy('assign-selected-config-labeling-left')
      .invoke('val')
      .should('contain', icalcTestConfiguration.labelingLeft);
    cy.getByCy('assign-selected-config-labeling-right')
      .invoke('val')
      .should('contain', icalcTestConfiguration.labelingRight);

    cy.getByCy('start-calculation').click();

    cy.wait('@getChainflexListRequest');

    cy.getByCy('chosen-chainflex').should(
      'contain',
      icalcTestConfiguration.state.chainFlexState.chainflexCable.partNumber
    );
    cy.getByCy('choose-chainflex-length').invoke('val').should('equal', chainflexLengthForNewAssignment);

    cy.getByCy('back-to-meta-data').click();

    cy.getByCy('select-config-number').containsTranslated('chainflexLengthWithUnit', {
      chainflexLength: chainflexLengthForNewAssignment,
    });
  });

  it('should be able to duplicate calculation and assign selected configuration to the newly created calculation', () => {
    const calculationNumberForNewAssignment = `${icalcTestCalculation.calculationNumber}-copied`;
    const quoteNumberForNewAssignment = `${icalcTestCalculation.quoteNumber}-copied`;
    const customerForNewAssignment = `${icalcTestCalculation.customer}-copied`;
    const chainflexLengthForNewAssignment = '4';
    const matNumberForNewAssignment = `${icalcTestConfiguration.matNumber}-second-copy`;
    const batchSizeForNewAssignment = '4';

    cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}`).as(
      'copyConfigurationToExistingCalculationRequest'
    );

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`).as(
      'assignConfigurationItemsToCopiedCalculation'
    );

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');
    cy.contains(icalcTestCalculation.calculationNumber).click();
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-duplicate-configuration-dialog').click();
    cy.getByCy('copy-config-into-existing-calc').should('be.visible').click();
    cy.getByCy('config-number-copy-config').type(matNumberForNewAssignment);
    cy.getByCy('batch-size-copy-config').should('be.visible').type(batchSizeForNewAssignment);
    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').type(chainflexLengthForNewAssignment);
    cy.getByCy('config-number-copy-config').focus();
    let originalCalculationSCCMatNumbers: string[];

    cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').click();
    cy.wait('@copyConfigurationToExistingCalculationRequest')
      .its('response.body')
      .then((body) => {
        originalCalculationSCCMatNumbers = (body?.calculation?.singleCableCalculations || []).map(
          (scc) => scc.matNumber
        );
      });

    cy.getByCy('copy-calculation-action-button').click();
    cy.getByCy('new-calculation-number-form-input').focus();
    cy.getByCy('new-calculation-number-form-input').should('be.visible').type(calculationNumberForNewAssignment);
    cy.getByCy('new-calculation-quote-number-form-input').focus();
    cy.getByCy('new-calculation-quote-number-form-input').should('be.visible').type(quoteNumberForNewAssignment);
    cy.getByCy('new-calculation-customer-form-input').should('be.visible').type(customerForNewAssignment);
    cy.getByCy('select-scc-copy-calc').should('be.visible').click();
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('selectAll').click();
    cy.getByCy('select-scc-copy-calc').contains(icalcTestConfiguration.matNumber);
    cy.get(selectors.transparentBackdrop).click();
    cy.getByCy('assign-configuration-to-copied-calculation').should('be.visible').click();

    cy.wait('@assignConfigurationItemsToCopiedCalculation')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('calculationNumber');
        expect(body).to.have.property('calculationFactor');
        const { calculation, configuration } = body;
        const copiedCalculationSCCMatNumbers = (calculation.singleCableCalculations || []).map((scc) => scc.matNumber);

        expect(calculation).to.have.property('singleCableCalculations');
        expect(configuration).to.have.property('singleCableCalculations');
        expect(calculation).to.have.property('customerType');
        expect(calculation).to.have.property('quoteNumber');
        expect(calculation).to.have.property('customer');
        expect(originalCalculationSCCMatNumbers).to.deep.equal(copiedCalculationSCCMatNumbers);
      });

    cy.getByCy('calculation-items-input-select').contains(calculationNumberForNewAssignment);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', quoteNumberForNewAssignment);
    cy.getByCy('assign-selected-calculation-item-customer').invoke('val').should('contain', customerForNewAssignment);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcTestCalculation.calculationFactor);
    cy.getByCy('select-config-number').contains(icalcTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-batch-size')
      .invoke('val')
      .should('contain', icalcTestSingleCableCalculation.batchSize);
  });

  it('should be able to duplicate configuration within the existing calculation when mat017Items prices have price updates', () => {
    const batchSizeForNewAssignment = '3';
    const chainflexLengthForNewAssignment = '3';
    const matNumberForNewAssignment = `${icalcTestConfiguration.matNumber}-duplicated`;
    const oldAmountDividedByPriceUnit = 3.6;
    const newAmountDividedByPriceUnit = 4.45;
    const newDescriptionForDuplicate = `${icalcTestConfiguration.description}-with-updates-for-duplicate-configuration`;

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}`).as(
      'copyConfigurationToExistingCalculationRequest'
    );
    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`, (req) => {
      req.reply((res) => {
        const { configuration } = res.body || {};

        ['leftConnector', 'rightConnector'].forEach((connectorType) => {
          const items = configuration?.state.connectorState?.[connectorType]?.mat017ItemListWithWidenData || [];

          configuration.state.connectorState[connectorType].mat017ItemListWithWidenData = items.map((item) => ({
            ...item,
            amountDividedByPriceUnit: newAmountDividedByPriceUnit,
            overrides: { ...item.overrides, amountDividedByPriceUnit: oldAmountDividedByPriceUnit },
          }));
        });

        res.body.configuration = { ...configuration };
      });
    }).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');

    cy.contains(icalcTestCalculation.calculationNumber).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-duplicate-configuration-dialog').click();
    cy.getByCy('copy-config-into-existing-calc').should('be.visible').click();
    cy.getByCy('confirm-copy-with-old-prices-button').should('be.visible').click();
    cy.getByCy('config-number-copy-config').should('be.visible').type(matNumberForNewAssignment);
    cy.getByCy('description-copy-config').invoke('val').should('contain', icalcTestConfiguration.description);

    cy.getByCy('clear-conf-copy-description').click();
    cy.getByCy('description-copy-config').type(newDescriptionForDuplicate);
    cy.getByCy('description-copy-config').invoke('val').should('contain', newDescriptionForDuplicate);
    cy.getByCy('label-left-copy-config').invoke('val').should('contain', icalcTestConfiguration.labelingLeft);
    cy.getByCy('label-right-copy-config').invoke('val').should('contain', icalcTestConfiguration.labelingRight);
    cy.getByCy('batch-size-copy-config').should('be.visible').type(batchSizeForNewAssignment);
    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').should('be.visible').type(chainflexLengthForNewAssignment);

    cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').click();
    cy.wait('@copyConfigurationToExistingCalculationRequest')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('configuration');
        expect(body).to.have.property('calculation');
      });

    cy.getByCy('calculation-items-input-select').contains(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', icalcTestCalculation.quoteNumber);
    cy.getByCy('assign-selected-calculation-item-customer')
      .invoke('val')
      .should('contain', icalcTestCalculation.customer);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');

    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcTestCalculation.calculationFactor);
    cy.getByCy('select-config-number').contains(matNumberForNewAssignment);
    cy.getByCy('assign-selected-config-description').invoke('val').should('contain', newDescriptionForDuplicate);
    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSizeForNewAssignment);
  });

  it('should be able to duplicate configuration within the existing calculation when mat017Items prices have no price updates', () => {
    const batchSizeForNewAssignment = '3';
    const chainflexLengthForNewAssignment = '3';
    const matNumberForNewAssignment = `${icalcTestConfiguration.matNumber}-no-update-duplicated`;
    const amountDividedByPriceUnit = 3.6;

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}`).as(
      'copyConfigurationToExistingCalculationRequest'
    );
    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`, (req) => {
      req.reply((res) => {
        const { configuration } = res.body || {};

        ['leftConnector', 'rightConnector'].forEach((connectorType) => {
          const items = configuration?.state.connectorState?.[connectorType]?.mat017ItemListWithWidenData || [];

          configuration.state.connectorState[connectorType].mat017ItemListWithWidenData = items.map((item) => ({
            ...item,
            amountDividedByPriceUnit,
            overrides: { ...item.overrides, amountDividedByPriceUnit },
          }));
        });

        res.body.configuration = { ...configuration };
      });
    }).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');

    cy.contains(icalcTestCalculation.calculationNumber).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-duplicate-configuration-dialog').click();
    cy.getByCy('copy-config-into-existing-calc').should('be.visible').click();
    cy.getByCy('config-number-copy-config').should('be.visible').type(matNumberForNewAssignment);
    cy.getByCy('description-copy-config').invoke('val').should('contain', icalcTestConfiguration.description);
    cy.getByCy('label-left-copy-config').invoke('val').should('contain', icalcTestConfiguration.labelingLeft);
    cy.getByCy('label-right-copy-config').invoke('val').should('contain', icalcTestConfiguration.labelingRight);
    cy.getByCy('batch-size-copy-config').should('be.visible').type(batchSizeForNewAssignment);
    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').should('be.visible').type(chainflexLengthForNewAssignment);
    cy.getByCy('config-number-copy-config').focus();

    cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').click();
    cy.wait('@copyConfigurationToExistingCalculationRequest')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('configuration');
        expect(body).to.have.property('calculation');
      });

    cy.getByCy('calculation-items-input-select').contains(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', icalcTestCalculation.quoteNumber);
    cy.getByCy('assign-selected-calculation-item-customer')
      .invoke('val')
      .should('contain', icalcTestCalculation.customer);

    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');

    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcTestCalculation.calculationFactor);
    cy.getByCy('select-config-number').contains(matNumberForNewAssignment);
    cy.getByCy('assign-selected-config-description')
      .invoke('val')
      .should('contain', icalcTestConfiguration.description);

    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSizeForNewAssignment);
  });

  it('should not be able to duplicate configuration within the calculation but should be able to duplicate into a new calculation, for locked calculations', () => {
    const batchSizeForNewAssignment = '4';
    const chainflexLengthForNewAssignment = '4';
    const matNumberForNewAssignment = `${icalcTestConfiguration.matNumber}-copied-from-locked`;
    const calculationNumberForNewAssignment = `${icalcTestCalculation.calculationNumber}-copied-from-locked`;
    const calculationQuoteForNewAssignment = `${icalcTestCalculation.quoteNumber}-copied-from-locked`;
    const calculationFactorForNewAssignment = '4';

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}`).as(
      'copyConfigurationToExistingCalculationRequest'
    );

    cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToNewCalculation)}`).as(
      'copyConfigurationToNewCalculationRequest'
    );

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');
    cy.contains(icalcLockedTestCalculation.calculationNumber).click();
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-duplicate-configuration-dialog').click();
    cy.getByCy('copy-config-into-existing-calc').should('be.disabled');
    cy.getByCy('open-dialog-to-copy-config-into-new-calc').should('not.be.disabled').click();

    cy.getByCy('new-calculation-number-form-input').focus();
    cy.getByCy('new-calculation-number-form-input').should('be.visible').type(calculationNumberForNewAssignment);
    cy.getByCy('generate-calculation-quote-number').focus();
    cy.getByCy('generate-calculation-quote-number').should('be.visible').type(calculationQuoteForNewAssignment);

    cy.getByCy('generate-conf-customer-type-select').should('be.visible').click();
    cy.get(selectors.matOption).eq(1).should('exist').containsTranslated('betriebsMittler');
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('serialCustomer').click();
    cy.getByCy('generate-conf-calculation-factor').focus();
    cy.getByCy('generate-conf-calculation-factor').type(calculationFactorForNewAssignment);
    cy.getByCy('config-number-copy-config').should('be.visible').type(matNumberForNewAssignment);
    cy.getByCy('batch-size-copy-config').should('be.visible').type(batchSizeForNewAssignment);
    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').type(chainflexLengthForNewAssignment);

    cy.getByCy('add-new-config-to-new-calculation').should('be.visible').click();

    cy.wait('@copyConfigurationToNewCalculationRequest')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('calculation');
        expect(body).to.have.property('configuration');
        const { calculation, configuration } = body;

        expect(calculation).to.have.property('singleCableCalculations');
        expect(configuration).to.have.property('singleCableCalculations');
      });

    cy.getByCy('calculation-items-input-select').contains(calculationNumberForNewAssignment);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', calculationQuoteForNewAssignment);
    cy.getByCy('assign-selected-calculation-item-customer')
      .invoke('val')
      .should('contain', icalcLockedTestCalculation.customer);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', calculationFactorForNewAssignment);
    cy.getByCy('select-config-number').contains(matNumberForNewAssignment);
    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSizeForNewAssignment);
  });

  it('should be able to duplicate configuration to new calculation when mat017Items have price updates', () => {
    const batchSizeForNewAssignment = '4';
    const chainflexLengthForNewAssignment = '4';
    const calculationFactorForNewAssignment = '4';
    const matNumberForNewAssignment = `${icalcTestConfiguration.matNumber}-copied-with-price-update`;
    const calculationNumberForNewAssignment = `${icalcTestCalculation.calculationNumber}-new-assignment-with-price-update`;
    const oldAmountDividedByPriceUnit = 3.6;
    const newAmountDividedByPriceUnit = 4.45;

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToNewCalculation)}`).as(
      'copyConfigurationToNewCalculationRequest'
    );
    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`, (req) => {
      req.reply((res) => {
        const { configuration } = res.body || {};

        ['leftConnector', 'rightConnector'].forEach((connectorType) => {
          const items = configuration?.state.connectorState?.[connectorType]?.mat017ItemListWithWidenData || [];

          configuration.state.connectorState[connectorType].mat017ItemListWithWidenData = items.map((item) => ({
            ...item,
            amountDividedByPriceUnit: newAmountDividedByPriceUnit,
            overrides: { ...item.overrides, amountDividedByPriceUnit: oldAmountDividedByPriceUnit },
          }));
        });

        res.body.configuration = { ...configuration };
      });
    }).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');
    cy.contains(icalcTestCalculation.calculationNumber).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-duplicate-configuration-dialog').click();
    cy.getByCy('open-dialog-to-copy-config-into-new-calc').should('be.visible').click();
    cy.getByCy('confirm-copy-with-old-prices-button').click();
    cy.getByCy('new-calculation-number-form-input').should('be.visible').type(calculationNumberForNewAssignment);
    cy.getByCy('generate-conf-customer-type-select').should('be.visible').click();
    cy.get(selectors.matOption).eq(1).should('exist').containsTranslated('betriebsMittler');
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('serialCustomer').click();

    cy.getByCy('generate-conf-calculation-factor').focus();
    cy.getByCy('generate-conf-calculation-factor').type(calculationFactorForNewAssignment);
    cy.getByCy('config-number-copy-config').should('be.visible').type(matNumberForNewAssignment);
    cy.getByCy('batch-size-copy-config').focus();
    cy.getByCy('batch-size-copy-config').type(batchSizeForNewAssignment);
    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').type(chainflexLengthForNewAssignment);

    cy.getByCy('add-new-config-to-new-calculation').should('be.visible').click();

    cy.wait('@copyConfigurationToNewCalculationRequest')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('calculation');
        expect(body).to.have.property('configuration');
        const { calculation, configuration } = body;

        expect(calculation).to.have.property('singleCableCalculations');
        expect(configuration).to.have.property('singleCableCalculations');
      });
    cy.getByCy('calculation-items-input-select').contains(calculationNumberForNewAssignment);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', calculationFactorForNewAssignment);
    cy.getByCy('select-config-number').contains(matNumberForNewAssignment);
    cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', batchSizeForNewAssignment);
  });

  it('should be able to duplicate calculation and assign selected configuration to the newly created calculation, for locked calculations', () => {
    const calculationNumberForNewAssignment = `${icalcTestCalculation.calculationNumber}-assigned-from-locked-calculation`;
    const quoteNumberForNewAssignment = `${icalcTestCalculation.quoteNumber}-assigned-from-locked-calculation`;
    const customerForNewAssignment = `${icalcTestCalculation.customer}-assigned-from-locked-calculation`;

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`).as(
      'assignConfigurationItemsToCopiedCalculation'
    );

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');
    cy.contains(icalcLockedTestCalculation.calculationNumber).click();
    cy.getByCy('edit-calculation').click();

    cy.getByCy('copy-calculation-action-button').click();
    cy.getByCy('new-calculation-number-form-input').should('be.visible').type(calculationNumberForNewAssignment);
    cy.getByCy('new-calculation-quote-number-form-input').focus();
    cy.getByCy('new-calculation-quote-number-form-input').should('be.visible').type(quoteNumberForNewAssignment);
    cy.getByCy('clear-calc-copy-customer').should('be.visible').click();
    cy.getByCy('new-calculation-customer-form-input').should('be.visible').type(customerForNewAssignment);

    cy.getByCy('select-scc-copy-calc').should('be.visible').click();
    cy.get(selectors.matOption).eq(1).should('exist').contains(icalcLockedTestConfiguration.matNumber);
    cy.get(selectors.matOption).eq(0).should('exist').containsTranslated('selectAll').click();
    cy.getByCy('select-scc-copy-calc').contains(icalcLockedTestConfiguration.matNumber);
    cy.get(selectors.transparentBackdrop).click();
    cy.getByCy('assign-configuration-to-copied-calculation').should('be.visible').click();

    cy.wait('@assignConfigurationItemsToCopiedCalculation')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('calculationNumber');
        expect(body).to.have.property('calculationFactor');
        expect(body).to.have.property('calculation');
        const { calculation, configuration } = body;

        expect(calculation).to.have.property('singleCableCalculations');
        expect(configuration).to.have.property('singleCableCalculations');
        expect(calculation).to.have.property('customerType');
      });

    cy.getByCy('calculation-items-input-select').contains(calculationNumberForNewAssignment);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', quoteNumberForNewAssignment);
    cy.getByCy('assign-selected-calculation-item-customer').invoke('val').should('contain', customerForNewAssignment);

    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcLockedTestCalculation.calculationFactor);
    cy.getByCy('select-config-number').contains(icalcLockedTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-batch-size')
      .invoke('val')
      .should('contain', icalcLockedTestSingleCableCalculation.batchSize);
  });

  it('should be able to search and filter with calculation search and select a calculation', () => {
    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFilter)}?orderDirection=asc&search=${
        icalcTestCalculation.calculationNumber
      }&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(icalcTestCalculation.calculationNumber);
    cy.wait('@filterCalculationItemsWithFilterRequest')
      .its('response.body')
      .then((body) => {
        expect(body.data[0]).to.have.property('calculationNumber');
        expect(
          body.data.filter(
            (calculation) => !calculation.calculationNumber.includes(icalcTestCalculation.calculationNumber)
          ).length
        ).to.equal(0);
      });

    cy.getByCy('toggle-calculation-search-filter').click();
    cy.getByCy('customer-type-select-filter').should('be.visible');
    cy.getByCy('assign-calculation-factor-filter').should('be.visible');

    cy.getByCy('customer-type-select-filter').click();
    cy.get(selectors.matOption).eq(1).should('exist');
    cy.get(selectors.matOption).eq(0).click();
    cy.getByCy('customer-type-select-filter').containsTranslated('serialCustomer');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFilter)}*`).as(
      'filterCalculationItemsWithFilterRequest'
    );

    cy.getByCy('assign-calculation-factor-filter').type('10');
    cy.getByCy('assign-calculation-factor-operand-filter').click();
    cy.get(selectors.matOption).eq(0).should('exist');
    cy.get(selectors.matOption).eq(1).should('exist');
    cy.get(selectors.matOption).eq(2).should('exist').click();
    cy.getByCy('apply-calculation-search-filter').click();
    cy.wait('@filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-factor-filter-chip').containsTranslated('calculationFactor').contains(`> 10`);

    cy.getByCy('announcement-container').containsTranslated('noResults');

    cy.getByCy('toggle-calculation-search-filter').click();
    cy.getByCy('calculation-factor-filter-cancel').click();
    cy.getByCy('assign-calculation-factor-filter').type(icalcTestCalculation.calculationFactor.toString());
    cy.getByCy('assign-calculation-factor-operand-filter').click();
    cy.get(selectors.matOption).eq(0).click();

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?calculationFactor=1&customerType=serialCustomer&calculationFactorOperand==&orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');

    cy.getByCy('apply-calculation-search-filter').click();
    cy.wait('@filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-factor-filter-chip')
      .containsTranslated('calculationFactor')
      .contains(`= ${icalcTestCalculation.calculationFactor}`);

    cy.getByCy('customer-type-filter-chip').contains('serialCustomer');
    cy.getByCy('calculation-factor-filter-chip')
      .containsTranslated('calculationFactor')
      .contains(`= ${icalcTestCalculation.calculationFactor}`);
    cy.getByCy('calculation-search-result-table').contains(icalcTestCalculation.calculationNumber);

    cy.contains(icalcTestCalculation.calculationNumber).click();
    cy.getByCy('edit-calculation').click();
    cy.getByCy('calculation-items-input-select').should('exist');
    cy.getByCy('calculation-items-input-select').contains(icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcTestCalculation.calculationFactor);
    cy.getByCy('select-config-number').contains(icalcTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-batch-size')
      .invoke('val')
      .should('contain', icalcTestSingleCableCalculation.batchSize);
  });

  it('should be able to search and filter with configuration search and select a configuration', () => {
    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=${
        icalcTestConfiguration.matNumber
      }&skip=0&take=100&orderBy=matNumber`
    ).as('searchConfigurationItemsRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?labeling=left%20label&orderDirection=asc*`
    ).as('filterConfigurationItemsRequest');

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();

    cy.wait('@filterConfigurationItemsWithNoFilterRequest');

    cy.getByCy('configurationSearchFormInput').should('be.visible').focus();
    cy.getByCy('configurationSearchFormInput').type(icalcTestConfiguration.matNumber);
    cy.wait('@searchConfigurationItemsRequest')
      .its('response.body')
      .then((body) => {
        expect(body.data[0]).to.have.property('matNumber');
        expect(
          body.data.filter((configuration) => !configuration.matNumber.includes(icalcTestConfiguration.matNumber))
            .length
        ).to.equal(0);
        expect(body.data[0]).to.not.have.property('state');
        expect(body.data[0]).to.not.have.property('snapshots');
        expect(body.data[0]).to.not.have.property('singleCableCalculations');
        expect(body.data[0]).to.have.property('calculationNumbers');
      });

    cy.getByCy('toggle-config-search-filter').click();
    cy.getByCy('assign-labeling-filter').should('be.visible').type(icalcTestConfiguration.labelingLeft);
    cy.getByCy('apply-config-search-filter').click();

    cy.wait('@filterConfigurationItemsRequest')
      .its('response.body')
      .then((body) => {
        expect(body.data[0]).to.have.property('matNumber');
        expect(
          body.data.filter((configuration) => configuration.labelingLeft.includes(icalcTestConfiguration.labelingLeft))
            .length
        ).to.not.equal(0);
        expect(body.data[0]).to.have.property('calculationNumbers');
      });

    cy.getByCy('labeling-filter-chip').containsTranslated('labeling').contains(icalcTestConfiguration.labelingLeft);

    cy.contains(icalcTestConfiguration.matNumber).click();
    cy.getByCy('edit-calculation').click();
    cy.getByCy('assign-calculation-number').should('not.exist');
    cy.getByCy('calculation-items-input-select').contains(icalcTestCalculation.calculationNumber);
    cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .invoke('val')
      .should('contain', icalcTestCalculation.calculationFactor);

    cy.getByCy('assign-selected-config-item-config-number').should('not.exist');
    cy.getByCy('select-config-number').contains(icalcTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-batch-size')
      .invoke('val')
      .should('contain', icalcTestSingleCableCalculation.batchSize);
  });

  it('should be able to remove assignment of configuration and calculation (delete SCC), coming from calculation search', () => {
    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.removeLinkBetweenConfigurationAndCalculation)}`).as(
      'removeLinkBetweenConfigurationAndCalculation'
    );

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFilter)}?orderDirection=asc&search=${
        icalcTestConfigurationWithManyAssignments.matNumber
      }&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');

    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(icalcTestConfigurationWithManyAssignments.matNumber);
    cy.wait('@filterCalculationItemsWithFilterRequest');

    cy.contains(icalcTestConfigurationWithManyAssignments.matNumber).click();
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-remove-configuration-dialog').should('be.visible').click();

    cy.get(selectors.icalcRemoveLinkBetweenConfigurationAndCalculationDialog).should('exist');
    cy.getByCy('remove-configuration-info').should('be.visible');
    cy.getByCy('remove-configuration-confirm').should('not.be.disabled').click();

    cy.wait('@removeLinkBetweenConfigurationAndCalculation')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('configuration');
        expect(body).to.have.property('calculation');
      });

    cy.get(selectors.icalcRemoveLinkBetweenConfigurationAndCalculationDialog).should('not.exist');

    cy.getByCy('select-config-number').click();
    cy.get(selectors.matOption).eq(1).should('not.exist');
    cy.get(selectors.matOption).eq(0).should('exist');
  });

  it('should be able to remove assignment of configuration and calculation (delete SCC), coming from configuration search', () => {
    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithNoFilterRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.removeLinkBetweenConfigurationAndCalculation)}`).as(
      'removeLinkBetweenConfigurationAndCalculation'
    );

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=${
        icalcTestConfigurationForRemoval.matNumber
      }&skip=0&take=100&orderBy=matNumber`
    ).as('filterConfigurationItemsWithFilterRequest');

    cy.getByCy('configurationSearchFormInput').should('be.visible').focus();
    cy.getByCy('configurationSearchFormInput').type(icalcTestConfigurationForRemoval.matNumber);
    cy.wait('@filterConfigurationItemsWithFilterRequest');

    cy.contains(icalcTestConfigurationForRemoval.matNumber).click();
    cy.getByCy('edit-calculation').click();
    cy.getByCy('calculation-items-input-select').should('be.visible').click();
    cy.get(selectors.matOption).eq(0).click();
    cy.getByCy('assign-selected-config-item-config-number').should('not.exist');
    cy.getByCy('open-remove-configuration-dialog').should('be.visible').click();
    cy.get(selectors.icalcRemoveLinkBetweenConfigurationAndCalculationDialog).should('exist');
    cy.getByCy('remove-configuration-info').should('be.visible');
    cy.getByCy('remove-configuration-confirm').should('not.be.disabled').click();
    cy.wait('@removeLinkBetweenConfigurationAndCalculation')
      .its('response.body')
      .then((body) => {
        expect(body).to.have.property('configuration');
        expect(body).to.have.property('calculation');
      });
    cy.getByCy('calculation-items-input-select').should('be.visible').click();
    cy.get(selectors.matOption).eq(1).should('not.exist');
    cy.get(selectors.matOption).eq(0).should('exist');
  });

  it('should not be able to remove assignment of configuration and calculation, if there is only one configuration assigned to calculation', () => {
    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFilter)}?orderDirection=asc&search=${
        icalcTestConfigurationWithOneAssignment.matNumber
      }&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');
    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(icalcTestConfigurationWithOneAssignment.matNumber);
    cy.wait('@filterCalculationItemsWithFilterRequest');

    cy.contains(icalcTestConfigurationWithOneAssignment.matNumber).click();
    cy.getByCy('edit-calculation').click();

    cy.getByCy('open-remove-configuration-dialog').should('be.visible').click();

    cy.get(selectors.icalcRemoveLinkBetweenConfigurationAndCalculationDialog).should('exist');
    cy.getByCy('removal-not-permitted-info').should('be.visible');
    cy.getByCy('remove-configuration-info').should('not.exist');
    cy.getByCy('remove-configuration-confirm').should('be.disabled');
  });

  it('should not send a request to update a calculation if no property of the calculation is updated', () => {
    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=calculationNumber`
    ).as('filterCalculationItemsWithFilterRequest');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`).as('getSingleCableCalculationRequest');

    cy.intercept('PATCH', `${buildApiPath(apiEndpoints.calculation)}`).as('updateCalculationRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.chainflex)}?orderDirection=asc&search=&skip=0&take=100&orderBy=partNumber`
    ).as('getChainflexListRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();

    cy.wait('@filterCalculationItemsWithNoFilterRequest');

    cy.getByCy('calculation-search-form-input').should('be.visible').focus();
    cy.getByCy('calculation-search-form-input').type(ICALC_DYNAMIC_CALC_NUMBER_PREFIX);
    cy.wait('@filterCalculationItemsWithFilterRequest');

    cy.contains(icalcTestConfiguration.matNumber).click();

    cy.wait('@getSingleCableCalculationRequest');

    cy.getByCy('edit-calculation').click();

    cy.getByCy('start-calculation').click();

    cy.wait('@getChainflexListRequest');

    cy.get('@updateCalculationRequest.all').should('have.length', 0);
  });
});
