import { After, AfterAll, Before, BeforeAll, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  apiEndpoints,
  buildApiPath,
  externalUrls,
  mapAndCreateCalculationAndConfigurations,
  selectors,
} from '../../../support/utils';
import { testUser } from '../../../support/auth.po';
import type {
  Calculation,
  Configuration,
  Mat017ItemWithWidenData,
  CreateCalculationAndConfigurationResponseDto,
} from '@igus/icalc-domain';
import { icalcTestCalculation, icalcTestConfiguration } from '@igus/icalc-domain';
import { mockDataByScenario } from './meta-data-mock';

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

After(() => {});

AfterAll(() => {
  cy.dbSeed('delete-testdata');
});

Given('the user is on Meta Data page', () => {
  cy.visit('/app/meta-data');
});

Given('the user navigates to calculation search', () => {
  cy.visit('/app/meta-data');

  cy.intercept(
    'GET',
    `${buildApiPath(
      apiEndpoints.calculationFilter
    )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`
  ).as('filterCalculationItemsWithNoFilterRequest');

  cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
  cy.wait('@filterCalculationItemsWithNoFilterRequest');
});

When('the user searches for basic calculation', () => {
  mapAndCreateCalculationAndConfigurations('basic');

  const mockData = mockDataByScenario.openExistingCalculation;

  cy.intercept(
    'GET',
    `${buildApiPath(apiEndpoints.calculationFilter)}?orderDirection=asc&search=${
      mockData.calculationNumber
    }&skip=0&take=100&orderBy=calculationNumber`
  ).as('filterCalculationItemsWithFilterRequest');
  cy.getByCy('calculation-search-form-input').focus();
  cy.getByCy('calculation-search-form-input').type(mockData.calculationNumber);
  cy.wait('@filterCalculationItemsWithFilterRequest')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('data');
      //      expect(body.data[0]).to.have.property('calculationNumber');
      expect(
        body.data.filter(
          (calculation: Calculation) => !calculation.calculationNumber.includes(mockData.calculationNumber)
        ).length
      ).to.equal(0);
    });

  // TODO: find a way in meta-data component to wait for the debounced values until next button gets enabled
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // wait equals the debounceTime on the metaDataForm
  cy.getByCy('toggle-calculation-search-filter').click();
  cy.getByCy('customer-type-select-filter').click();
  cy.get(selectors.matOption).eq(0).containsTranslated('serialCustomer').click();

  cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFilter)}*`).as('filterCalculationItemsWithFilterRequest');
  cy.getByCy('apply-calculation-search-filter').click();
  cy.wait('@filterCalculationItemsWithFilterRequest');

  cy.contains(icalcTestCalculation.calculationNumber).click();
});

Then('iCalc should display data of basic calculation', () => {
  const mockData = mockDataByScenario.openExistingCalculation;

  cy.getByCy('calculation-items-input-select').contains(mockData.calculationNumber);
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated(mockData.customerType);
  cy.getByCy('assign-selected-calculation-item-calculation-factor')
    .invoke('val')
    .should('contain', mockData.calculationFactor);
  cy.getByCy('select-config-number').contains(mockData.configurationNumber);
  cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', mockData.batchSize);
});

When('starts editing selected calculation', () => {
  cy.getByCy('edit-calculation').click();
});

When('the user starts the calculation', () => {
  cy.intercept('POST', `${buildApiPath(apiEndpoints.createCalculationAndConfiguration)}`).as(
    'createCalculationAndConfiguration'
  );

  cy.intercept('POST', `${buildApiPath(apiEndpoints.createNewConfigurationForExistingCalculation)}`).as(
    'createNewConfigurationForExistingCalculation'
  );

  cy.intercept(
    'GET',
    `${buildApiPath(apiEndpoints.chainflex)}?orderDirection=asc&search=&skip=0&take=100&orderBy=partNumber`
  ).as('getChainflexListRequest');

  // TODO: find a way in meta-data component to wait for the debounced values until next button gets enabled
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // wait equals the debounceTime on the metaDataForm
  cy.getByCy('start-calculation').click();
});

When('the user applies filters not matching any calculation', () => {
  // filter for serial customer
  // TODO: find a way in meta-data component to wait for the debounced values until next button gets enabled
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // wait equals the debounceTime on the metaDataForm
  cy.getByCy('toggle-calculation-search-filter').click();
  cy.getByCy('customer-type-select-filter').click();
  cy.get(selectors.matOption).eq(0).containsTranslated('serialCustomer').click();

  const newCalculationFactor = '999';

  cy.getByCy('assign-calculation-factor-filter').type(newCalculationFactor);
  cy.getByCy('assign-calculation-factor-operand-filter').click();
  cy.get(selectors.matOption).eq(2).should('exist').click();

  cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFilter)}*`).as('filterCalculationItemsWithFilterRequest');
  cy.getByCy('apply-calculation-search-filter').click();
  cy.wait('@filterCalculationItemsWithFilterRequest');
});

Then('iCalc should show an empty results list', () => {
  cy.getByCy('announcement-container').containsTranslated('noResults');
});

Given('the user is on configuration search page', () => {
  cy.visit('/app/meta-data');

  cy.intercept(
    'GET',
    `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`
  ).as('filterConfigurationItemsWithNoFilterRequest');

  cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
  cy.wait('@filterConfigurationItemsWithNoFilterRequest');
});

When('the user searches for basic configuration', () => {
  cy.getByCy('configurationSearchFormInput').focus();
  cy.getByCy('configurationSearchFormInput').type(icalcTestConfiguration.matNumber);

  cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFilter)}?labeling=left%20label&orderDirection=asc*`).as(
    'filterConfigurationItemsRequest'
  );

  cy.getByCy('toggle-config-search-filter').click();
  cy.getByCy('assign-labeling-filter').should('be.visible').type(icalcTestConfiguration.labelingLeft);
  cy.getByCy('apply-config-search-filter').click();

  cy.wait('@filterConfigurationItemsRequest')
    .its('response.body')
    .then((body) => {
      expect(body.data[0]).to.have.property('matNumber');
      expect(
        body.data.filter((configuration: Configuration) =>
          configuration.labelingLeft.includes(icalcTestConfiguration.labelingLeft)
        ).length
      ).to.not.equal(0);
      expect(body.data[0]).to.have.property('calculationNumbers');
    });

  cy.contains(icalcTestConfiguration.matNumber).click();
});

When('the user enters a new calculation and configuration number with according data', () => {
  const mockData = mockDataByScenario.createNewCalculationAndConfiguration;

  cy.getByCy('assign-calculation-number').focus();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
  cy.getByCy('assign-calculation-number').type(mockData.calculationNumber);

  cy.getByCy('assign-selected-config-item-config-number').type(mockData.configurationNumber);

  cy.getByCy('assign-calculation-item-quote-number').focus();
  cy.getByCy('assign-calculation-item-quote-number').should('be.visible').type(mockData.quoteNumber);
  cy.getByCy('assign-selected-calculation-item-customer').should('be.visible').type(mockData.customer);

  cy.getByCy('choose-selected-calc-customer-type').click();
  cy.get(selectors.matOption).eq(1).containsTranslated(mockData.customerType).click();
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated(mockData.customerType);

  cy.getByCy('assign-selected-calculation-item-calculation-factor').focus();
  cy.getByCy('assign-selected-calculation-item-calculation-factor').type(mockData.calculationFactor);

  cy.getByCy('assign-selected-config-description').type(mockData.description);

  cy.getByCy('assign-selected-config-labeling-left').focus();
  cy.getByCy('assign-selected-config-labeling-left').type(mockData.label);

  cy.getByCy('assign-selected-config-batch-size').type(mockData.batchSize);
});

Then('iCalc should create new calculation and configuration', () => {
  const mockData = mockDataByScenario.createNewCalculationAndConfiguration;

  cy.wait('@createCalculationAndConfiguration')
    .its('response.body')
    .then((body: CreateCalculationAndConfigurationResponseDto) => {
      expect(body).to.have.property('configuration');

      expect(body).to.have.property('calculation');
      const calculation = body.calculation;

      expect(calculation.calculationFactor).to.eq(parseInt(mockData.calculationFactor, 10));
      expect(calculation).to.have.property('customer');
      expect(calculation.customer).to.eq(mockData.customer);
      expect(calculation).to.have.property('quoteNumber');
      expect(calculation.quoteNumber).to.eq(mockData.quoteNumber);

      expect(calculation).to.have.property('singleCableCalculations');
      const singleCableCalculations = body.calculation.singleCableCalculations;

      expect(singleCableCalculations[0]).to.have.property('batchSize');
      expect(singleCableCalculations[0].batchSize).to.eq(+mockData.batchSize);
    });
});

When('the user navigates to configuration search', () => {
  cy.intercept(
    'GET',
    `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`
  ).as('filterConfigurationItemsWithNoFilterRequest');

  cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();

  cy.wait('@filterConfigurationItemsWithNoFilterRequest');
});

Then('iCalc should navigate to Chainflex page', () => {
  cy.location('pathname').should('contain', '/app/chainflex');
  cy.wait('@getChainflexListRequest');
});

When('the user navigates back to meta data page', () => {
  cy.getByCy('back-to-meta-data').click();
});

Then('iCalc should display data of Calculation selected that is basic', () => {
  const mockData = mockDataByScenario.displayDataOfSelectedCalculation;

  cy.getByCy('calculation-items-input-select').contains(mockData.calculationNumber);
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
  cy.getByCy('assign-selected-calculation-item-calculation-factor')
    .invoke('val')
    .should('contain', mockData.calculationFactor);
  cy.getByCy('select-config-number').contains(mockData.configurationNumber);
  cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', mockData.batchSize);
  //  cy.getByCy('assign-selected-config-description').invoke('val').should('contain', icalcTestConfiguration.description); // TODO remove if statement from this line once ICALC-698 is done
});

Then('iCalc should display the copied configuration with old prices on meta data page', () => {
  const mockData = mockDataByScenario.copyConfigurationWithOldPricesToNewCalculation;

  cy.getByCy('calculation-items-input-select').contains(mockData.calculationNumber);
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated('serialCustomer');
  cy.getByCy('assign-selected-calculation-item-calculation-factor')
    .invoke('val')
    .should('contain', mockData.calculationFactor);
  cy.getByCy('select-config-number').contains(mockData.configurationNumber);
  cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', mockData.batchSize);
  //  cy.getByCy('assign-selected-config-description').invoke('val').should('contain', icalcTestConfiguration.description); // TODO remove if statement from this line once ICALC-698 is done
});
/*
When(/^(the user )?clicks to add a new configuration to the selected calculation$/, () => {
  cy.getByCy('clear-to-add-new-config').click();
}); */

Then('new configuration should be added to calculation', () => {
  const mockData = mockDataByScenario.assignConfigurationToExistingCalculation;

  cy.wait('@createNewConfigurationForExistingCalculation')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('configuration');
      expect(body).to.have.property('calculation');
      expect(body.calculation.calculationFactor).to.eq(+mockData.calculationFactor);
      expect(body.calculation).to.have.property('singleCableCalculations');
      expect(body.calculation.singleCableCalculations[1]).to.have.property('batchSize');
      expect(body.calculation.singleCableCalculations[1].batchSize).to.eq(+mockData.batchSize);
    });
});

When('the user adds new configuration', () => {
  const mockData = mockDataByScenario.assignConfigurationToExistingCalculation;

  cy.getByCy('clear-to-add-new-config').click();

  cy.getByCy('assign-selected-config-item-config-number').type(mockData.configurationNumber);

  cy.getByCy('assign-selected-config-batch-size').type(mockData.batchSize);
});

When('the user copy configuration with old prices to new calculation', () => {
  const mockData = mockDataByScenario.copyConfigurationWithOldPricesToNewCalculation;

  cy.getByCy('open-duplicate-configuration-dialog').click();
  cy.getByCy('open-dialog-to-copy-config-into-new-calc').click();
  cy.getByCy('confirm-copy-with-old-prices-button').click();

  cy.getByCy('new-calculation-number-form-input').type(mockData.calculationNumber);
  cy.getByCy('generate-conf-customer-type-select').click();
  cy.get(selectors.matOption).eq(0).containsTranslated(mockData.customerType).click();
  cy.getByCy('generate-conf-calculation-factor').focus();
  cy.getByCy('generate-conf-calculation-factor').type(mockData.calculationFactor);

  cy.getByCy('config-number-copy-config').type(mockData.configurationNumber);
  cy.getByCy('batch-size-copy-config').focus();
  cy.getByCy('batch-size-copy-config').type(mockData.batchSize);
  cy.getByCy('chainflex-length-copy-config').focus();
  cy.getByCy('chainflex-length-copy-config').type(mockData.chainflexLength);

  cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToNewCalculation)}`).as(
    'copyConfigurationToCalculationRequest'
  );
  cy.getByCy('add-new-config-to-new-calculation').click();
  cy.wait('@copyConfigurationToCalculationRequest')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('configuration');
      const configuration: Configuration = body.configuration;
      const mat017ItemToCompare = configuration.state?.connectorState?.leftConnector
        ?.mat017ItemListWithWidenData[0] as Mat017ItemWithWidenData;
      const amountDividedByPriceUnitFromOverrides = mat017ItemToCompare?.overrides?.amountDividedByPriceUnit;
      const amountDividedByPriceUnit = mat017ItemToCompare?.amountDividedByPriceUnit;

      expect(amountDividedByPriceUnitFromOverrides).not.to.eq(amountDividedByPriceUnit);
      expect(body).to.have.property('calculation');
    });
});

When('the user copy configuration with current prices to new calculation', () => {
  const mockData = mockDataByScenario.copyConfigurationWithCurrentPricesToNewCalculation;

  cy.getByCy('open-duplicate-configuration-dialog').click();
  cy.getByCy('open-dialog-to-copy-config-into-new-calc').click();

  cy.getByCy('confirm-copy-with-new-prices-button').click();

  // enter calculation details
  cy.getByCy('new-calculation-number-form-input').type(mockData.calculationNumber);
  cy.getByCy('generate-conf-customer-type-select').click();
  cy.get(selectors.matOption).eq(0).containsTranslated(mockData.customerType).click();
  cy.getByCy('generate-conf-calculation-factor').focus();
  cy.getByCy('generate-conf-calculation-factor').type(mockData.calculationFactor);

  // enter configuration details
  cy.getByCy('config-number-copy-config').type(mockData.configurationNumber);
  cy.getByCy('batch-size-copy-config').focus();
  cy.getByCy('batch-size-copy-config').type(mockData.batchSize);
  cy.getByCy('chainflex-length-copy-config').focus();
  cy.getByCy('chainflex-length-copy-config').type(mockData.chainflexLength);

  // confirm to save
  cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToNewCalculation)}`).as(
    'copyConfigurationToCalculationRequest'
  );
  cy.getByCy('add-new-config-to-new-calculation').click();

  // assert that created configuration has current prices
  cy.wait('@copyConfigurationToCalculationRequest')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('configuration');
      const configuration: Configuration = body.configuration;
      const mat017ItemToCompare = configuration.state?.connectorState?.leftConnector
        ?.mat017ItemListWithWidenData[0] as Mat017ItemWithWidenData;
      const amountDividedByPriceUnitFromOverrides = mat017ItemToCompare?.overrides?.amountDividedByPriceUnit;
      const amountDividedByPriceUnit = mat017ItemToCompare?.amountDividedByPriceUnit;

      expect(amountDividedByPriceUnitFromOverrides).to.eq(amountDividedByPriceUnit);
      expect(body).to.have.property('calculation');
    });
});

When('the user copy configuration from locked calculation to new calculation', () => {
  const data = mockDataByScenario.copyConfigurationFromLockedToNewCalculation;

  cy.getByCy('open-duplicate-configuration-dialog').click();
  cy.getByCy('open-dialog-to-copy-config-into-new-calc').click();

  // enter calculation details
  cy.getByCy('new-calculation-number-form-input').type(data.calculationNumber);
  cy.getByCy('generate-conf-customer-type-select').click();
  cy.get(selectors.matOption).eq(0).containsTranslated(data.customerType).click();
  cy.getByCy('generate-conf-calculation-factor').focus();
  cy.getByCy('generate-conf-calculation-factor').type(data.calculationFactor);

  // enter configuration details
  cy.getByCy('config-number-copy-config').type(data.configurationNumber);
  cy.getByCy('batch-size-copy-config').focus();
  cy.getByCy('batch-size-copy-config').type(data.batchSize);
  cy.getByCy('chainflex-length-copy-config').focus();
  cy.getByCy('chainflex-length-copy-config').type(data.chainflexLength);

  // confirm to save
  cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToNewCalculation)}`).as(
    'copyConfigurationToCalculationRequest'
  );
  cy.getByCy('add-new-config-to-new-calculation').click();
});

Then('iCalc should display the copied configuration with current prices on Meta Data page', () => {
  const mockData = mockDataByScenario.copyConfigurationWithCurrentPricesToNewCalculation;

  cy.getByCy('calculation-items-input-select').contains(mockData.calculationNumber);
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated(mockData.customerType);
  cy.getByCy('assign-selected-calculation-item-calculation-factor')
    .invoke('val')
    .should('contain', mockData.calculationFactor);
  cy.getByCy('select-config-number').contains(mockData.configurationNumber);
  cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', mockData.batchSize);
  cy.getByCy('assign-selected-config-description').invoke('val').should('contain', mockData.description); // TODO remove if statement from this line once ICALC-698 is done
});

Then('iCalc should display the copied configuration from locked calculation on Meta Data page', () => {
  const mockData = mockDataByScenario.copyConfigurationFromLockedToNewCalculation;

  cy.getByCy('calculation-items-input-select').contains(mockData.calculationNumber);
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated(mockData.customerType);
  cy.getByCy('assign-selected-calculation-item-calculation-factor')
    .invoke('val')
    .should('contain', mockData.calculationFactor);
  cy.getByCy('select-config-number').contains(mockData.configurationNumber);
  cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', mockData.batchSize);
  cy.getByCy('assign-selected-config-description').invoke('val').should('contain', mockData.description); // TODO remove if statement from this line once ICALC-698 is done
});

When('the user copy configuration to existing calculation', () => {
  const mockData = mockDataByScenario.copyConfigurationToExistingCalculation;

  cy.getByCy('open-duplicate-configuration-dialog').click();
  cy.getByCy('copy-config-into-existing-calc').click();

  // enter configuration details
  cy.getByCy('config-number-copy-config').type(mockData.configurationNumber);
  cy.getByCy('batch-size-copy-config').focus();
  cy.getByCy('batch-size-copy-config').type(mockData.batchSize);
  cy.getByCy('chainflex-length-copy-config').focus();
  cy.getByCy('chainflex-length-copy-config').type(mockData.chainflexLength);

  cy.intercept('POST', `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}`).as(
    'copyConfigurationToCalculationRequest'
  );
  cy.getByCy('add-new-config-to-existing-calculation').click();
});

Then('iCalc should display the copied configuration to existing calculation on Meta Data page', () => {
  const mockData = mockDataByScenario.copyConfigurationToExistingCalculation;

  cy.wait('@copyConfigurationToCalculationRequest')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('configuration');
      const configuration: Configuration = body.configuration;
      const mat017ItemToCompare = configuration.state?.connectorState?.leftConnector
        ?.mat017ItemListWithWidenData[0] as Mat017ItemWithWidenData;
      const amountDividedByPriceUnitFromOverrides = mat017ItemToCompare?.overrides?.amountDividedByPriceUnit;
      const amountDividedByPriceUnit = mat017ItemToCompare?.amountDividedByPriceUnit;

      expect(amountDividedByPriceUnitFromOverrides).to.eq(amountDividedByPriceUnit);
      expect(body).to.have.property('calculation');
    });

  cy.getByCy('calculation-items-input-select').contains(mockData.calculationNumber);
  cy.getByCy('choose-selected-calc-customer-type').containsTranslated(mockData.customerType);
  cy.getByCy('assign-selected-calculation-item-calculation-factor')
    .invoke('val')
    .should('contain', mockData.calculationFactor);
  cy.getByCy('select-config-number').contains(mockData.configurationNumber);
  cy.getByCy('assign-selected-config-batch-size').invoke('val').should('contain', mockData.batchSize);
  cy.getByCy('assign-selected-config-description').invoke('val').should('contain', mockData.description); // TODO remove if statement from this line once ICALC-698 is done
});

When('the user copy locked calculation with its configuration', () => {
  const mockData = mockDataByScenario.copyCalculationAndAssignConfiguration;

  cy.getByCy('copy-calculation-action-button').click();
  cy.getByCy('new-calculation-number-form-input').type(mockData.calculationNumber);

  // select configuration
  cy.getByCy('select-scc-copy-calc').click();
  cy.get(selectors.matOption).contains(mockData.configurationNumber).click();
  cy.get(selectors.transparentBackdrop).click();

  // confirm copying
  cy.intercept('POST', `${buildApiPath(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`).as(
    'assignConfigurationItemsToCopiedCalculation'
  );
  cy.getByCy('assign-configuration-to-copied-calculation').click();
});

Then('iCalc should save the copied calculation and assign the selected configuration', () => {
  const mockData = mockDataByScenario.copyCalculationAndAssignConfiguration;

  cy.wait('@assignConfigurationItemsToCopiedCalculation')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('calculationNumber');
      expect(body).to.have.property('calculationFactor');
      const { calculation, configuration } = body;

      expect(calculation).to.have.property('singleCableCalculations');
      expect(configuration).to.have.property('singleCableCalculations');
      expect(calculation).to.have.property('customerType');
      expect(calculation.calculationNumber).to.eq(mockData.calculationNumber);
      expect(configuration.matNumber).to.deep.equal(mockData.configurationNumber);
    });
});

When('the user removes selected assignment from Calculation', () => {
  cy.getByCy('open-remove-configuration-dialog').click();
  cy.intercept('POST', `${buildApiPath(apiEndpoints.removeLinkBetweenConfigurationAndCalculation)}`).as(
    'removeLinkBetweenConfigurationAndCalculation'
  );
  cy.getByCy('remove-configuration-confirm').click();
});

Then('iCalc should remove the Calculation and leave one assignment to the calculation', () => {
  cy.wait('@removeLinkBetweenConfigurationAndCalculation')
    .its('response.body')
    .then((body) => {
      expect(body).to.have.property('configuration');
      expect(body).to.have.property('calculation');
      expect(body.calculation.singleCableCalculations).to.have.length(1);
    });
});
