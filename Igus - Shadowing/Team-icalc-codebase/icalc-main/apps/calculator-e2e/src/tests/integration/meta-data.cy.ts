/* eslint-disable @typescript-eslint/naming-convention */
import {
  CustomerTypeEnum,
  createAssignConfigurationItemsToCopiedCalculationResponse,
  createFindCalculationByNumberResponse,
  createCopyConfigurationToNewCalculationResponse,
  icalcTestCalculation,
  icalcTestConfiguration,
  icalcTestSingleCableCalculation,
  createFindConfigurationByMatNumberResponse,
  createFilterCalculationResponse,
  createFilterConfigurationResponse,
  createGetChainflexResponse,
  createSaveSingleCableCalculationResponse,
  createGetSingleCableCalculationResponse,
} from '@igus/icalc-domain';
import { signedInUserData } from '../../support/auth.po';
import { apiEndpoints, buildApiPath, externalUrls, selectors } from '../../support/utils';

describe('meta-data', () => {
  beforeEach(() => {
    // External URL Intercepts
    cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, { status: { statusCode: 500 }, body: {} }).as(
      'piwikTemplates'
    );

    cy.intercept('GET', `${externalUrls.oribiLinkedIn}`, {
      status: { statusCode: 200 },
      body: { allowed: false, scriptToken: null },
    }).as('oribiLinkedIn');

    cy.intercept('GET', `${externalUrls.igusLocation}`, { status: { statusCode: 200 }, body: 'EN' }).as('igusLocation');

    cy.intercept('POST', `${externalUrls.koplaShopSession}`, {
      status: { statusCode: 404 },
      path: '/shop/session/new',
      message: 'Cannot GET /shop/session/new',
      error: 'Not Found',
    }).as('koplaShopSession');

    // iCalc Backend Intercepts
    cy.intercept('POST', `${buildApiPath(apiEndpoints.authSignIn)}`, {
      status: { statusCode: 200 },
      body: {
        user: {
          id: signedInUserData.id,
          email: signedInUserData.email,
          firstName: signedInUserData.firstName,
          lastName: signedInUserData.lastName,
          role: signedInUserData.role,
        },
      },
    }).as('authSignInRequest');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.authProfile)}`, {
      status: { statusCode: 200 },
      body: {
        user: {
          id: signedInUserData.id,
          email: signedInUserData.email,
          firstName: signedInUserData.firstName,
          lastName: signedInUserData.lastName,
          role: signedInUserData.role,
        },
      },
    }).as('authSignInRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.authRefresh)}`, {
      status: { statusCode: 200 },
      body: {},
    }).as('authRefresh');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.haveMat017ItemsOverridesChanged)}`, {
      status: { statusCode: 200 },
      body: {},
    });

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`,
      createFilterCalculationResponse()
    ).as('filterCalculationItemsWithNoFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`,
      createFilterConfigurationResponse()
    ).as('filterConfigurationItemsWithNoFilterRequest');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.chainflex)}*`, createGetChainflexResponse()).as(
      'getChainflexListRequest'
    );
  });

  it('should show empty meta-data forms on first start', () => {
    cy.visit('/app/meta-data');

    cy.getByCy('assign-calculation-number').should('be.visible').should('contain', '');

    cy.getByCy('assign-calculation-item-quote-number').should('be.visible').should('contain', '');

    cy.getByCy('assign-selected-calculation-item-customer').should('be.visible').should('contain', '');

    cy.getByCy('choose-selected-calc-customer-type').should('be.visible');

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').should('contain', '');

    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').should('contain', '');

    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').should('contain', '');

    cy.getByCy('selected-config-copy-labeling-left-to-right').should('be.visible').should('contain', 'arrow_forward');

    cy.getByCy('assign-selected-config-labeling-right').should('be.visible').should('contain', '');

    cy.getByCy('assign-selected-config-batch-size').focus();

    cy.getByCy('assign-selected-config-batch-size').should('be.visible').should('contain', '');

    cy.getByCy('start-calculation').should('be.visible').should('be.disabled');
  });

  it('should fill in Calculation and Configuration data to start a new calculation ', () => {
    cy.visit('/app/meta-data');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=*`, {}).as(
      'calculationfindByNumberNotFoundRequest'
    );

    cy.getByCy('assign-calculation-number').should('be.visible').focus();
    cy.getByCy('assign-calculation-number').type(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-calculation-number').should('have.value', icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').click();
    cy.wait('@calculationfindByNumberNotFoundRequest');

    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.serialCustomer).click();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();
    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(
      icalcTestCalculation.calculationFactor.toString()
    );
    cy.getByCy('assign-selected-calculation-item-calculation-factor').should(
      'have.value',
      icalcTestCalculation.calculationFactor
    );

    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=*`, {}).as(
      'configurationFindByMatNumberNotFoundRequest'
    );

    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').focus();
    cy.getByCy('assign-selected-config-item-config-number').type(icalcTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-item-config-number').should('have.value', icalcTestConfiguration.matNumber);

    cy.getByCy('assign-selected-config-description').focus();
    cy.getByCy('assign-selected-config-description').type(icalcTestConfiguration.description);
    cy.getByCy('assign-selected-config-description').should('have.value', icalcTestConfiguration.description);
    cy.getByCy('assign-selected-config-description-info-icon').should('be.visible');

    cy.getByCy('assign-selected-config-labeling-left').focus();
    cy.getByCy('assign-selected-config-labeling-left').type(icalcTestConfiguration.labelingLeft);
    cy.wait('@configurationFindByMatNumberNotFoundRequest');
    cy.getByCy('assign-selected-config-labeling-left').should('have.value', icalcTestConfiguration.labelingLeft);

    cy.getByCy('selected-config-copy-labeling-left-to-right').should('contain', 'arrow_forward').click();

    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', icalcTestConfiguration.labelingLeft)
      .focus();

    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type(icalcTestConfiguration.labelingRight);
    cy.getByCy('assign-selected-config-labeling-right').should('have.value', icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').should('be.visible').focus();
    cy.getByCy('assign-selected-config-batch-size').type(icalcTestSingleCableCalculation.batchSize.toString());
    cy.getByCy('assign-selected-config-batch-size').should('have.value', icalcTestSingleCableCalculation.batchSize);

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.createCalculationAndConfiguration)}`,
      createGetSingleCableCalculationResponse()
    ).as('createCalculationAndConfigurationSuccessRequest');

    cy.getByCy('start-calculation').should('be.visible').click();
    cy.wait('@createCalculationAndConfigurationSuccessRequest');
    cy.wait('@getChainflexListRequest');
  });

  it('should fill in Calculation and Configuration data to start a new calculation, but the calculationNumber already exists', () => {
    cy.visit('/app/meta-data');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=*`,
      createFindCalculationByNumberResponse()
    ).as('calculationFindByNumberFoundRequest');

    cy.getByCy('assign-calculation-number').should('be.visible').focus();
    cy.getByCy('assign-calculation-number').type(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-calculation-number').should('have.value', icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').click();
    cy.wait('@calculationFindByNumberFoundRequest');

    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.serialCustomer).click();

    cy.get(selectors.formlyValidationMessage).should('be.visible');

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();
    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(
      icalcTestCalculation.calculationFactor.toString()
    );

    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=*`, {}).as(
      'configurationFindByMatNumberNotFoundRequest'
    );

    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').focus();
    cy.getByCy('assign-selected-config-item-config-number').type(icalcTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-item-config-number').should('have.value', icalcTestConfiguration.matNumber);

    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').focus();

    cy.getByCy('assign-selected-config-labeling-left').type(icalcTestConfiguration.labelingLeft);
    cy.wait('@configurationFindByMatNumberNotFoundRequest');

    cy.getByCy('selected-config-copy-labeling-left-to-right')
      .should('be.visible')
      .should('contain', 'arrow_forward')
      .click();

    cy.getByCy('assign-selected-config-labeling-right').should('be.visible').focus();
    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type(icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').should('be.visible');
    cy.getByCy('assign-selected-config-batch-size').type(icalcTestSingleCableCalculation.batchSize.toString());

    cy.getByCy('start-calculation').should('be.visible').should('be.disabled');

    cy.get(selectors.formlyValidationMessage).shouldContainTranslated('calcNumberTaken');
  });

  it('should fill in Calculation and Configuration data to start a new calculation, but the configuration matNumber already exists', () => {
    cy.visit('/app/meta-data');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=*`, {}).as(
      'calculationFindByNumberNotFoundRequest'
    );

    cy.getByCy('assign-calculation-number').should('be.visible').focus();
    cy.getByCy('assign-calculation-number').type(icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').click();
    cy.wait('@calculationFindByNumberNotFoundRequest');

    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.serialCustomer).click();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(
      icalcTestCalculation.calculationFactor.toString()
    );

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=*`,
      createFindConfigurationByMatNumberResponse()
    ).as('configurationFindByMatNumberFoundRequest');

    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').focus();
    cy.getByCy('assign-selected-config-item-config-number').type(icalcTestConfiguration.matNumber);

    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').focus();
    cy.getByCy('assign-selected-config-labeling-left').type(icalcTestConfiguration.labelingLeft);
    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').blur();
    cy.wait('@configurationFindByMatNumberFoundRequest');

    cy.get(selectors.formlyValidationMessage).should('be.visible');

    cy.getByCy('selected-config-copy-labeling-left-to-right').should('be.visible').click();

    cy.getByCy('assign-selected-config-labeling-right').should('be.visible').focus();

    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type(icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').should('be.visible').focus();

    cy.getByCy('assign-selected-config-batch-size').type(icalcTestSingleCableCalculation.batchSize.toString());

    cy.getByCy('start-calculation').should('be.visible').should('be.disabled');

    cy.get(selectors.formlyValidationMessage).shouldContainTranslated('configNumberTaken');
  });

  it('should search for a calculation, filter the table and copy it with all configurations attached to it', () => {
    const newCalculation = {
      calculationNumber: 'calcNumberOfCopiedConf',
      quoteNumber: 'quoteNumberOfCopiedConf',
      customer: 'customerOfCopiedConf',
    };
    const singleCableCalculationFixture = createGetSingleCableCalculationResponse({
      calculation: { isLocked: true },
    });

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...singleCableCalculationFixture,
      }
    ).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');
    cy.getByCy('toggle-calculation-search-filter').should('be.visible').click();

    const calculationSearch = { ...createFilterCalculationResponse() };

    calculationSearch.data = [calculationSearch.data[1], calculationSearch.data[0]];
    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFilter)}*`, calculationSearch).as(
      'filterCalculationItemsWithCalculationFactorFilterRequest'
    );

    cy.getByCy('assign-calculation-factor-filter').should('be.visible').focus();
    cy.getByCy('assign-calculation-factor-filter').type('1');
    cy.getByCy('apply-calculation-search-filter').click();
    cy.wait('@filterCalculationItemsWithCalculationFactorFilterRequest');
    cy.getByCy('calculation-search-result-table').should('be.visible').find(selectors.tableRow).eq(1).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('calculation-items-input-select').should('be.visible').contains(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-selected-calculation-item-quote-number')
      .invoke('val')
      .should('contain', icalcTestCalculation.quoteNumber);
    cy.getByCy('assign-selected-calculation-item-customer')
      .invoke('val')
      .should('contain', icalcTestCalculation.customer);
    cy.getByCy('select-config-number').should('be.visible').should('contain', icalcTestConfiguration.matNumber);
    cy.getByCy('copy-calculation-action-button').click();

    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=*`, {}).as(
      'calculationFindByNumberNotFoundRequest'
    );

    cy.getByCy('new-calculation-number-form-input').focus();
    cy.getByCy('new-calculation-number-form-input').should('be.visible').should('contain', '');

    cy.getByCy('new-calculation-number-form-input').type(newCalculation.calculationNumber);
    cy.getByCy('new-calculation-quote-number-form-input').focus();
    cy.getByCy('new-calculation-quote-number-form-input').should('be.visible').type(newCalculation.quoteNumber);
    cy.getByCy('clear-calc-copy-customer').click();
    cy.getByCy('new-calculation-customer-form-input').should('be.visible').type(newCalculation.customer);

    cy.getByCy('select-scc-copy-calc').should('be.visible').click();
    cy.wait('@calculationFindByNumberNotFoundRequest');
    cy.get(`${selectors.matOption}`).eq(0).click();
    cy.get(`${selectors.transparentBackdrop}`).click();

    const assignConfigurationItemsToCopiedCalculationResponse =
      createAssignConfigurationItemsToCopiedCalculationResponse({
        calculationNumber: newCalculation.calculationNumber,
      });

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`,
      assignConfigurationItemsToCopiedCalculationResponse
    ).as('assignConfigurationItemsToCopiedCalculationRequest');

    cy.getByCy('assign-configuration-to-copied-calculation').click();
    cy.wait('@assignConfigurationItemsToCopiedCalculationRequest');

    cy.getByCy('start-calculation').should('be.visible').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should search for a configuration, filter the table and copy it inside a calculation under a new matNumber', () => {
    const newConfiguration = { matNumber: icalcTestConfiguration.matNumber };

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');
    cy.getByCy('toggle-config-search-filter').should('be.visible').click();

    cy.getByCy('assign-labeling-filter').should('be.visible').focus();
    cy.getByCy('assign-labeling-filter').type(icalcTestConfiguration.labelingLeft);

    const fixture = createFilterConfigurationResponse();

    fixture.data = [fixture.data[0], fixture.data[1]];
    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFilter)}*`, fixture).as(
      'filterConfigurationItemsWithLabelingFilterRequest'
    );

    cy.intercept('PATCH', `${buildApiPath(apiEndpoints.calculation)}`, {
      statusCode: 200,
    }).as('patchCalculation');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.checkChainflexAndPriceExistence)}`, {
      statusCode: 200,
    }).as('checkChainflexAndPriceExistence');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}*`,
      createFindConfigurationByMatNumberResponse()
    ).as('configurationFindByMatNumberFoundRequest');

    cy.getByCy('apply-config-search-filter').click();
    cy.wait('@filterConfigurationItemsWithLabelingFilterRequest');

    const singleCableCalculationFixture = createGetSingleCableCalculationResponse();

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...singleCableCalculationFixture,
      }
    ).as('getSingleCableCalculationRequest');
    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('calculation-items-input-select')
      .should('be.visible')
      .should('contain', icalcTestCalculation.calculationNumber);
    cy.getByCy('select-config-number').should('be.visible').contains(icalcTestConfiguration.matNumber);

    cy.getByCy('open-duplicate-configuration-dialog').click();

    cy.getByCy('copy-config-into-existing-calc').should('be.visible').click();
    cy.getByCy('confirm-copy-with-old-prices-button').click();

    cy.getByCy('config-number-copy-config').should('be.visible').focus();

    cy.getByCy('config-number-copy-config').type(icalcTestConfiguration.matNumber);
    cy.getByCy('label-left-copy-config').focus();

    cy.wait('@configurationFindByMatNumberFoundRequest');

    cy.getByCy('label-left-copy-config').type(icalcTestConfiguration.labelingLeft);
    cy.getByCy('label-right-copy-config').focus();
    cy.getByCy('label-right-copy-config').type(icalcTestConfiguration.labelingRight);
    cy.getByCy('batch-size-copy-config').focus();
    cy.getByCy('batch-size-copy-config').type(icalcTestSingleCableCalculation.batchSize.toString());

    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').should('be.visible').focus();

    cy.getByCy('chainflex-length-copy-config').type(icalcTestSingleCableCalculation.chainflexLength.toString());

    cy.getByCy('add-new-config-to-existing-calculation').should('be.disabled');

    cy.get(selectors.formlyValidationMessage).shouldContainTranslated('configNumberTaken');

    cy.getByCy('config-number-copy-config').should('be.visible').clear();
    cy.getByCy('config-number-copy-config').focus();

    cy.getByCy('config-number-copy-config').type(newConfiguration.matNumber);

    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}*`, {}).as(
      'configurationFindByMatNumberNotFoundRequest'
    );

    const duplicateConfigurationFixture = { ...singleCableCalculationFixture };

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}*`,
      duplicateConfigurationFixture
    ).as('copyConfigurationToExistingCalculationRequest');
    cy.getByCy('config-number-copy-config').blur();

    cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').click();

    cy.wait('@configurationFindByMatNumberNotFoundRequest');

    cy.wait('@copyConfigurationToExistingCalculationRequest');

    cy.getByCy('calculation-items-input-select')
      .should('be.visible')
      .should('contain', singleCableCalculationFixture.calculation.calculationNumber);

    cy.getByCy('start-calculation').should('be.visible').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should search for a configuration, filter the table and copy it as a new calculation and new configuration', () => {
    const newCalculation = { calculationNumber: `${icalcTestCalculation.calculationNumber}-new-copy` };
    const newConfiguration = { matNumber: `${icalcTestConfiguration.matNumber}-new-copy` };

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');
    cy.getByCy('toggle-config-search-filter').should('be.visible').click();

    cy.getByCy('assign-labeling-filter').should('be.visible').focus();
    cy.getByCy('assign-labeling-filter').type(icalcTestConfiguration.labelingLeft);

    const fixture = { ...createFilterConfigurationResponse() };

    fixture.data = [fixture.data[0], fixture.data[1]];
    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFilter)}*`, fixture).as(
      'filterConfigurationItemsWithLabelingFilterRequest'
    );
    cy.getByCy('apply-config-search-filter').click();
    cy.wait('@filterConfigurationItemsWithLabelingFilterRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}*`,
      createGetSingleCableCalculationResponse()
    ).as('getSingleCableCalculationRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}*`,
      createFindConfigurationByMatNumberResponse()
    ).as('configurationFindByMatNumberFoundRequest');

    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();

    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('calculation-items-input-select')
      .should('be.visible')
      .should('contain', icalcTestCalculation.calculationNumber);
    cy.getByCy('select-config-number').should('be.visible').contains(icalcTestConfiguration.matNumber);

    cy.getByCy('open-duplicate-configuration-dialog').should('be.visible').click();

    cy.getByCy('open-dialog-to-copy-config-into-new-calc').should('be.visible').click();

    cy.getByCy('confirm-copy-with-old-prices-button').click();

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFindByNumber)}*`,
      createFindCalculationByNumberResponse()
    ).as('calculationFindByNumberFoundRequest');

    cy.getByCy('new-calculation-number-form-input').should('be.visible').focus();
    cy.getByCy('new-calculation-number-form-input').type(newCalculation.calculationNumber);

    cy.getByCy('generate-conf-customer-type-select').should('be.visible').click();

    cy.wait('@calculationFindByNumberFoundRequest');

    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.serialCustomer).click();

    cy.get(selectors.formlyValidationMessage).shouldContainTranslated('calcNumberTaken');
    cy.getByCy('add-new-config-to-new-calculation').should('be.visible').should('be.disabled');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=*`, {}).as(
      'calculationFindByNumberNotFoundRequest'
    );

    cy.getByCy('new-calculation-number-form-input').focus();
    cy.getByCy('new-calculation-number-form-input').should('be.visible').clear();
    cy.getByCy('new-calculation-number-form-input').type(icalcTestCalculation.calculationNumber);

    cy.getByCy('generate-conf-calculation-factor').focus();
    cy.getByCy('generate-conf-calculation-factor').type(icalcTestCalculation.calculationFactor.toString());
    cy.wait('@calculationFindByNumberNotFoundRequest');

    cy.getByCy('config-number-copy-config').focus();
    cy.getByCy('config-number-copy-config').type(icalcTestConfiguration.matNumber);
    cy.getByCy('config-number-copy-config').blur();

    cy.wait('@configurationFindByMatNumberFoundRequest');

    cy.getByCy('labeling-left-copy-config').focus();

    cy.getByCy('labeling-right-copy-config').focus();

    cy.getByCy('batch-size-copy-config').focus();
    cy.getByCy('batch-size-copy-config').type(icalcTestSingleCableCalculation.batchSize.toString());

    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').type(icalcTestSingleCableCalculation.chainflexLength.toString());

    cy.get(selectors.formlyValidationMessage).shouldContainTranslated('configNumberTaken');
    cy.getByCy('add-new-config-to-new-calculation').should('be.visible').should('be.disabled');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}*`, {}).as(
      'configurationFindByMatNumberNotFoundRequest'
    );

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.copyConfigurationToNewCalculation)}`,
      createCopyConfigurationToNewCalculationResponse()
    ).as('copyConfigurationToNewCalculationRequest');

    cy.getByCy('config-number-copy-config').should('be.visible').clear();
    cy.getByCy('config-number-copy-config').focus();
    cy.getByCy('config-number-copy-config').type(newConfiguration.matNumber);
    cy.getByCy('config-number-copy-config').blur();

    cy.getByCy('add-new-config-to-new-calculation').should('be.visible').should('be.enabled').click();

    cy.wait('@configurationFindByMatNumberNotFoundRequest');
    cy.wait('@copyConfigurationToNewCalculationRequest');

    cy.getByCy('start-calculation').should('be.visible').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should load a calculation from calculation search and link an existing configuration to it', () => {
    const newSingleCableCalculation = { batchSize: 2, chainflexLength: 2 };
    const firstSingleCableCalculationFixture = createGetSingleCableCalculationResponse();
    const secondSccId = `${firstSingleCableCalculationFixture.id}2`;
    const secondConfigurationId = `${firstSingleCableCalculationFixture.configurationId}2`;
    const secondMatNumber = `${firstSingleCableCalculationFixture.matNumber}2`;

    const secondSingleCableCalculationForConfiguration = {
      ...firstSingleCableCalculationFixture.configuration.singleCableCalculations[0],
      id: secondSccId,
      configurationId: secondConfigurationId,
      matNumber: secondMatNumber,
    };

    const singleCableCalculationForCalculation = {
      ...firstSingleCableCalculationFixture.calculation.singleCableCalculations[0],
      id: secondSccId,
      configurationId: secondConfigurationId,
      matNumber: secondMatNumber,
    };

    const secondSingleCableCalculationFixture = {
      ...firstSingleCableCalculationFixture,
      configurationId: secondConfigurationId,
      matNumber: secondMatNumber,
      id: secondSccId,
      configuration: {
        ...firstSingleCableCalculationFixture.configuration,
        id: secondConfigurationId,
        matNumber: secondMatNumber,
        singleCableCalculations: [{ ...secondSingleCableCalculationForConfiguration }],
      },
      calculation: {
        ...firstSingleCableCalculationFixture.calculation,
        singleCableCalculations: [
          ...firstSingleCableCalculationFixture.calculation.singleCableCalculations,
          { ...singleCableCalculationForCalculation },
        ],
      },
    };

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...firstSingleCableCalculationFixture,
      }
    ).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.getByCy('calculation-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog').should('be.visible').should('be.enabled').click();
    cy.getByCy('open-assign-existing-config-or-copy-dialog').should('be.visible').should('be.enabled').click();
    cy.getByCy('open-link-existing-config-dialog').should('be.visible').should('be.enabled').click();

    cy.getByCy('link-existing-config-with-existing-calc').should('be.visible').should('be.disabled');

    cy.getByCy('batch-size-link-existing-config-to-existing-calc').should('be.visible').focus();

    cy.getByCy('batch-size-link-existing-config-to-existing-calc').type(newSingleCableCalculation.batchSize.toString());
    cy.getByCy('batch-size-link-existing-config-to-existing-calc').should(
      'have.value',
      newSingleCableCalculation.batchSize
    );

    cy.getByCy('chainflex-length-link-existing-config-to-existing-calc').should('be.visible').focus();
    cy.getByCy('chainflex-length-link-existing-config-to-existing-calc').type(
      newSingleCableCalculation.chainflexLength.toString()
    );
    cy.getByCy('chainflex-length-link-existing-config-to-existing-calc').should(
      'have.value',
      newSingleCableCalculation.chainflexLength
    );

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.assignConfigurationToExistingCalculation)}`,
      secondSingleCableCalculationFixture
    ).as('assignConfigurationToExistingCalculationRequest');

    cy.intercept('PATCH', `${buildApiPath(apiEndpoints.calculation)}`, {
      statusCode: 200,
    }).as('patchCalculation');

    // this gets called seemingly random, so it needs to be intercepted
    cy.intercept('POST', `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`, {
      status: { statusCode: 200 },
      body: {},
    }).as('saveSingleCableCalculation');

    cy.getByCy('link-existing-config-with-existing-calc').should('be.visible').should('be.enabled').click();

    cy.wait('@assignConfigurationToExistingCalculationRequest');
    cy.getByCy('select-config-number')
      .should('be.visible')
      .should('contain', secondSingleCableCalculationFixture.matNumber);
  });

  it('should load a locked calculation from calculation search and fails to link an existing configuration to it', () => {
    const singleCableCalculationFixture = createGetSingleCableCalculationResponse({
      calculation: { isLocked: true },
    });

    cy.visit('/app/meta-data');

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...singleCableCalculationFixture,
      }
    ).as('getSingleCableCalculationRequest');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.getByCy('calculation-search-result-table').should('be.visible');
    cy.getByCy('calculation-search-result-table').find(selectors.tableRow).eq(2).click();
    cy.wait('@getSingleCableCalculationRequest');

    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog-disabled').should('be.visible').should('be.disabled');
    cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should load a configuration from configuration search and add a duplication of it to its calculation', () => {
    const newConfiguration = {
      matNumber: 'newConfigurationMatNumber',
      labelingLeft: icalcTestConfiguration.labelingLeft,
      labelingRight: icalcTestConfiguration.labelingRight,
    };
    const newSingleCableCalculation = { batchSize: 2, chainflexLength: 2 };

    const singleCableCalculationFixture = createGetSingleCableCalculationResponse();

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...singleCableCalculationFixture,
      }
    ).as('getSingleCableCalculationRequest');

    cy.intercept('PATCH', `${buildApiPath(apiEndpoints.calculation)}`, {
      statusCode: 200,
    }).as('patchCalculation');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=*`,
      createFindConfigurationByMatNumberResponse()
    ).as('configurationFindByMatNumberFoundRequest');

    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();

    cy.wait('@getSingleCableCalculationRequest');

    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog').should('be.visible').should('be.enabled').click();
    cy.getByCy('open-assign-existing-config-or-copy-dialog').should('be.visible').should('be.enabled').click();
    cy.getByCy('open-duplicate-config-dialog').should('be.visible').should('be.enabled').click();

    cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').should('be.disabled');

    cy.getByCy('config-number-copy-config').should('be.visible').focus();

    cy.getByCy('config-number-copy-config').type(icalcTestConfiguration.matNumber);
    cy.getByCy('config-number-copy-config').should('have.value', icalcTestConfiguration.matNumber);
    cy.getByCy('label-left-copy-config').should('exist').focus();

    cy.wait('@configurationFindByMatNumberFoundRequest');

    cy.getByCy('label-left-copy-config').type(newConfiguration.labelingLeft);

    cy.getByCy('label-right-copy-config').should('exist').focus();
    cy.getByCy('label-right-copy-config').type(newConfiguration.labelingRight);

    cy.getByCy('batch-size-copy-config').should('be.visible').focus();

    cy.getByCy('batch-size-copy-config').type(newSingleCableCalculation.batchSize.toString());

    cy.getByCy('chainflex-length-copy-config').focus();
    cy.getByCy('chainflex-length-copy-config').should('be.visible').focus();

    cy.getByCy('chainflex-length-copy-config').type(newSingleCableCalculation.chainflexLength.toString());
    cy.getByCy('chainflex-length-copy-config').should('have.value', newSingleCableCalculation.chainflexLength);

    cy.getByCy('config-number-copy-config').should('be.visible').focus();

    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=*`, {}).as(
      'configurationFindByMatNumberNotFoundRequest'
    );

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.copyConfigurationToExistingCalculation)}`,
      singleCableCalculationFixture
    ).as('copyConfigurationToExistingCalculationRequest');

    cy.getByCy('config-number-copy-config').clear();
    cy.getByCy('config-number-copy-config').type(newConfiguration.matNumber);
    cy.getByCy('config-number-copy-config').should('be.visible').blur();

    cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').should('be.enabled').click();

    cy.wait('@copyConfigurationToExistingCalculationRequest').then((subject) => {
      const { calculationNumber } = subject.response.body.calculation;

      cy.getByCy('calculation-items-input-select').should('contain', calculationNumber);
      cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();

      cy.wait('@getChainflexListRequest');
    });
  });

  it('should load a configuration from configuration search and fails to add a duplication of it, because it is inside a locked calculation', () => {
    const singleCableCalculationFixture = createGetSingleCableCalculationResponse({
      calculation: { isLocked: true },
    });

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`, singleCableCalculationFixture).as(
      'getSingleCableCalculationRequest'
    );

    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(2).click();

    cy.wait('@getSingleCableCalculationRequest');

    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog-disabled').should('be.visible').should('be.disabled');

    cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should load a calculation from configuration search and have commercialWorkStepOverrides is correctly set', () => {
    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}*`,
      createGetSingleCableCalculationResponse()
    ).as('getSingleCableCalculationRequest');

    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(2).click();

    cy.wait('@getSingleCableCalculationRequest').then((subject) => {
      const body = subject.response.body;
      const firstScc = body.configuration.singleCableCalculations[0];
      const { id } = firstScc;

      cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();
      cy.window().then((window: Cypress.WindowWithState) => {
        const processState = window.processStateFacadeService.processStateSnapshot();
        const commercialWorkStepOverrides =
          processState?.entities?.singleCableCalculations?.items?.[id]?.commercialWorkStepOverrides || {};
        const technicalWorkStepOverrides =
          processState?.entities?.configurations?.items?.[id]?.state?.workStepOverrides || {};

        expect(commercialWorkStepOverrides).to.deep.eq(firstScc.commercialWorkStepOverrides);
        expect(technicalWorkStepOverrides).to.deep.eq(firstScc?.state?.workStepOverrides || {});
      });
    });
  });

  it('should load a locked calculation from calculation search, has disabled meta-data of fields and select a different configuration over the configuration select field', () => {
    const singleCableCalculation = createGetSingleCableCalculationResponse({ calculation: { isLocked: true } });

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...singleCableCalculation,
      }
    ).as('getSingleCableCalculationRequest');
    cy.visit('/app/meta-data');

    const fixture = createFilterCalculationResponse();

    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFilter)}*`, fixture).as(
      'filterCalculationItemsWithNoFilterRequest'
    );

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.getByCy('calculation-search-result-table').should('be.visible').find(selectors.tableRow).eq(2).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog-disabled').should('be.visible').should('be.disabled');
    cy.getByCy('clear-to-add-new-config-disabled').should('be.visible').should('be.disabled');

    cy.getByCy('calculation-items-input-select')
      .should('be.visible')
      .contains(singleCableCalculation.calculationNumber);
    cy.getByCy('choose-selected-calc-customer-type')
      .should('be.visible')
      .should('have.class', 'mat-mdc-select-disabled');
    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').should('be.disabled');

    cy.getByCy('assign-selected-config-labeling-left').scrollIntoView();
    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').should('be.disabled');
    cy.getByCy('assign-selected-config-labeling-right').should('be.visible').should('be.disabled');
    cy.getByCy('assign-selected-config-batch-size').should('be.visible').should('be.disabled');

    cy.getByCy('select-config-number').should('be.visible').click();
    cy.get(selectors.matOption).eq(0).click();

    cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should load a locked calculation from configuration search, has disabled meta-data fields and select a different calculation over the calculation select field', () => {
    const singleCableCalculationFixture = createGetSingleCableCalculationResponse({
      calculation: { isLocked: true },
    });

    cy.intercept(
      { method: 'GET', url: `${buildApiPath(apiEndpoints.singleCableCalculation)}*` },
      {
        ...singleCableCalculationFixture,
      }
    ).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(2).click();

    cy.wait('@getSingleCableCalculationRequest');

    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog-disabled').should('be.visible').should('be.disabled');
    cy.getByCy('clear-to-add-new-config-disabled').should('be.visible').should('be.disabled');
    cy.getByCy('choose-selected-calc-customer-type')
      .should('be.visible')
      .should('have.class', 'mat-mdc-select-disabled');
    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').should('be.disabled');

    cy.getByCy('assign-selected-config-labeling-left').scrollIntoView();
    cy.getByCy('select-config-number').should('be.visible');
    cy.getByCy('assign-selected-config-labeling-left').should('be.visible').should('be.disabled');
    cy.getByCy('assign-selected-config-labeling-right').should('be.visible').should('be.disabled');
    cy.getByCy('assign-selected-config-batch-size').should('be.visible').should('be.disabled');

    cy.getByCy('calculation-items-input-select').should('be.visible').click();
    cy.get(selectors.matOption).eq(0).click();
    cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should load a configuration from configuration search, edit the meta-data fields and select a different calculation over the calculation select field', () => {
    const singleCableCalculationFixture = createGetSingleCableCalculationResponse();
    const fixture = createFilterConfigurationResponse();
    const calculationNumber2 = `${singleCableCalculationFixture.calculationNumber} - 2`;
    const calculationId2 = `${singleCableCalculationFixture.calculationId} - 2`;
    const id2 = `${singleCableCalculationFixture.id} - 2`;

    const newSingleCableCalculation = {
      ...singleCableCalculationFixture.configuration.singleCableCalculations[0],
      calculationNumber: calculationNumber2,
      calculationId: calculationId2,
      id: id2,
    };

    singleCableCalculationFixture.configuration.singleCableCalculations.push(newSingleCableCalculation);
    singleCableCalculationFixture.calculation.singleCableCalculations.push(newSingleCableCalculation);

    const secondSingleCableCalculationFixture = {
      ...singleCableCalculationFixture,
      calculationId: calculationId2,
      calculationNumber: calculationNumber2,
      id: id2,
      calculation: {
        ...singleCableCalculationFixture.calculation,
        calculationNumber: calculationNumber2,
        id: calculationId2,
      },
    };

    fixture.data = [fixture.data[1], fixture.data[0], fixture.data[3]];
    cy.intercept('GET', `${buildApiPath(apiEndpoints.configurationFilter)}*`, fixture).as(
      'filterConfigurationItemsWithNoFilterRequest'
    );

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`, singleCableCalculationFixture).as(
      'getSingleCableCalculationRequest'
    );

    cy.getByCy('config-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();

    cy.wait('@getSingleCableCalculationRequest');

    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('choose-selected-calc-customer-type')
      .should('be.visible')
      .shouldHaveTextTranslated(singleCableCalculationFixture.calculation.customerType);

    cy.getByCy('choose-selected-calc-customer-type').click();
    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.betriebsMittler).click();
    cy.getByCy('choose-selected-calc-customer-type')
      .should('be.visible')
      .shouldHaveTextTranslated(CustomerTypeEnum.betriebsMittler);

    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .should('be.visible')
      .should('have.value', singleCableCalculationFixture.calculation.calculationFactor);

    cy.getByCy('assign-selected-calculation-item-calculation-factor').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-calculation-item-calculation-factor').type('3');

    cy.getByCy('select-config-number')
      .should('be.visible')
      .contains(singleCableCalculationFixture.configuration.matNumber);

    cy.getByCy('assign-selected-config-labeling-left')
      .should('be.visible')
      .should('have.value', singleCableCalculationFixture.configuration.labelingLeft);

    cy.getByCy('assign-selected-config-labeling-left').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-left').type('labeling left 3');

    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', singleCableCalculationFixture.configuration.labelingRight);

    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type('labeling right 3');

    cy.getByCy('selected-config-copy-labeling-left-to-right').should('contain', 'arrow_forward').click();
    cy.getByCy('assign-selected-config-labeling-right').should('have.value', 'labeling left 3');

    cy.getByCy('assign-selected-config-batch-size')
      .should('be.visible')
      .should('have.value', singleCableCalculationFixture.batchSize);

    cy.getByCy('assign-selected-config-batch-size').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-batch-size').type('3');

    cy.getByCy('calculation-items-input-select')
      .should('be.visible')
      .should('have.text', singleCableCalculationFixture.calculationNumber)
      .click();

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}*`,
      secondSingleCableCalculationFixture
    ).as('getSingleCableCalculationRequest2');

    cy.get(selectors.matOption).eq(1).click();

    cy.wait('@getSingleCableCalculationRequest2');

    cy.getByCy('calculation-items-input-select')
      .should('be.visible')
      .should('have.text', secondSingleCableCalculationFixture.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').should('be.visible').focus();
    cy.getByCy('choose-selected-calc-customer-type').shouldHaveTextTranslated(
      secondSingleCableCalculationFixture.calculation.customerType
    );

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();
    cy.getByCy('assign-selected-calculation-item-calculation-factor').should(
      'have.value',
      secondSingleCableCalculationFixture.calculation.calculationFactor
    );

    cy.getByCy('select-config-number').should('be.visible').focus();
    cy.getByCy('select-config-number').contains(secondSingleCableCalculationFixture.configuration.matNumber);

    cy.getByCy('assign-selected-config-labeling-left')
      .should('be.visible')
      .should('have.value', secondSingleCableCalculationFixture.configuration.labelingLeft);

    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', secondSingleCableCalculationFixture.configuration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').focus();
    cy.getByCy('assign-selected-config-batch-size').should('be.visible');

    cy.getByCy('assign-selected-config-batch-size').should('have.value', secondSingleCableCalculationFixture.batchSize);

    cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();
    cy.wait('@getChainflexListRequest');
  });

  it('should load a calculation from calculation search, edit the meta-data fields and select a different configuration over the configuration select field', () => {
    const firstSingleCableCalculationFixture = createGetSingleCableCalculationResponse();
    const fixture = createFilterConfigurationResponse();
    const id2 = `${firstSingleCableCalculationFixture.id}2`;
    const configurationId2 = `${firstSingleCableCalculationFixture.configurationId}2`;
    const matNumber2 = `${firstSingleCableCalculationFixture.matNumber}2`;

    const secondSingleCableCalculationForConfiguration = {
      ...firstSingleCableCalculationFixture.configuration.singleCableCalculations[0],
      id: id2,
      configurationId: configurationId2,
    };

    const singleCableCalculationForCalculation = {
      ...firstSingleCableCalculationFixture.calculation.singleCableCalculations[0],
      id: id2,
      configurationId: configurationId2,
      matNumber: matNumber2,
    };

    firstSingleCableCalculationFixture.calculation.singleCableCalculations.push(singleCableCalculationForCalculation);

    const secondSingleCableCalculationFixture = {
      ...firstSingleCableCalculationFixture,
      configurationId: configurationId2,
      matNumber: matNumber2,
      id: id2,
      configuration: {
        ...firstSingleCableCalculationFixture.configuration,
        id: configurationId2,
        matNumber: matNumber2,
        singleCableCalculations: [{ ...secondSingleCableCalculationForConfiguration }],
      },
    };

    fixture.data = [fixture.data[1], fixture.data[0], fixture.data[3]];

    const newLabelingLeft = 'labeling left 2';
    const newLabelingRight = 'labeling right 2';
    const newCustomerType = CustomerTypeEnum.betriebsMittler;
    const newBatchSize = 2;
    const newCalculationFactor = 2;

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.intercept('GET', `${buildApiPath(apiEndpoints.calculationFilter)}*`, fixture).as(
      'filterCalculationItemsWithNoFilterRequest'
    );
    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`, firstSingleCableCalculationFixture).as(
      'getSingleCableCalculationRequest'
    );

    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.getByCy('calculation-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('calculation-items-input-select').should('be.visible').contains(icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type')
      .should('be.visible')
      .shouldHaveTextTranslated(icalcTestCalculation.customerType)
      .click();
    cy.get(selectors.matOption).containsTranslated(newCustomerType).click();
    cy.getByCy('choose-selected-calc-customer-type').should('be.visible').shouldHaveTextTranslated(newCustomerType);

    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .should('be.visible')
      .should('have.value', icalcTestCalculation.calculationFactor);

    cy.getByCy('assign-selected-calculation-item-calculation-factor').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(newCalculationFactor.toString());

    cy.getByCy('assign-selected-config-labeling-left')
      .should('be.visible')
      .should('have.value', icalcTestConfiguration.labelingLeft)
      .focus();

    cy.getByCy('assign-selected-config-labeling-left').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-left').type(newLabelingLeft);
    cy.getByCy('assign-selected-config-labeling-left').should('have.value', newLabelingLeft);

    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type(newLabelingRight);

    cy.getByCy('selected-config-copy-labeling-left-to-right').should('contain', 'arrow_forward').click();
    cy.getByCy('assign-selected-config-labeling-right').should('have.value', newLabelingLeft);

    cy.getByCy('assign-selected-config-batch-size')
      .should('be.visible')
      .should('have.value', icalcTestSingleCableCalculation.batchSize);

    cy.getByCy('assign-selected-config-batch-size').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-batch-size').type(newBatchSize.toString());
    cy.getByCy('assign-selected-config-batch-size').should('have.value', newBatchSize.toString());

    cy.getByCy('select-config-number')
      .should('be.visible')
      .shouldHaveTextTranslated('configurationWithChainflexLengthAndBatchSize', {
        matNumber: icalcTestConfiguration.matNumber,
        chainflexLength: icalcTestSingleCableCalculation.chainflexLength.toString(),
        batchSize: icalcTestSingleCableCalculation.batchSize.toString(),
      })
      .click();
    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}*`,
      secondSingleCableCalculationFixture
    ).as('secondGetSingleCableCalculationRequest');

    cy.get(selectors.matOption)
      .eq(1)
      .containsTranslated('configurationWithChainflexLengthAndBatchSize', {
        matNumber: singleCableCalculationForCalculation.matNumber,
        chainflexLength: secondSingleCableCalculationFixture.chainflexLength.toString(),
        batchSize: secondSingleCableCalculationFixture.batchSize.toString(),
      })
      .click();
    cy.wait('@secondGetSingleCableCalculationRequest');

    cy.getByCy('calculation-items-input-select').should('be.visible').contains(icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type')
      .should('be.visible')
      .shouldHaveTextTranslated(secondSingleCableCalculationFixture.calculation.customerType);

    cy.getByCy('assign-selected-calculation-item-calculation-factor')
      .should('be.visible')
      .should('have.value', secondSingleCableCalculationFixture.calculation.calculationFactor);

    cy.getByCy('select-config-number')
      .should('be.visible')
      .shouldHaveTextTranslated('configurationWithChainflexLengthAndBatchSize', {
        matNumber: icalcTestConfiguration.matNumber,
        chainflexLength: secondSingleCableCalculationFixture.chainflexLength.toString(),
        batchSize: secondSingleCableCalculationFixture.batchSize.toString(),
      });

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}/saveSingleCableCalculation`,
      createSaveSingleCableCalculationResponse()
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('assign-selected-config-labeling-left')
      .should('be.visible')
      .should('have.value', secondSingleCableCalculationFixture.configuration.labelingLeft);

    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', secondSingleCableCalculationFixture.configuration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').focus();
    cy.getByCy('assign-selected-config-batch-size')
      .should('be.visible')
      .should('have.value', secondSingleCableCalculationFixture.batchSize.toString());

    cy.getByCy('start-calculation').should('be.visible').should('be.enabled').click();

    cy.wait('@getChainflexListRequest');
  });

  it('should correctly build the calculation search url with filter parameters', () => {
    const customerTypeFilterValue = CustomerTypeEnum.serialCustomer;
    const calculationFactorFilterValue = '2';
    const calculationFactorOperandSymbol = '<'; // equals '%3C'
    const calculationFactorOperandFilterValue = '%3C'; // equals <
    const expectedDefaultUrlParameterWithNoFilter =
      '?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber';
    const expectedUrlParameterWithFilter = `?calculationFactor=${calculationFactorFilterValue}&customerType=${customerTypeFilterValue}&calculationFactorOperand=${calculationFactorOperandFilterValue}&orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`;

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest')
      .its('request.url')
      .should('include', expectedDefaultUrlParameterWithNoFilter);
    cy.getByCy('meta-data-headline').should('not.exist');
    cy.getByCy('toggle-calculation-search-filter').should('be.visible').click();

    cy.getByCy('customer-type-select-filter').should('be.visible').click();
    cy.get(selectors.matOption).containsTranslated(customerTypeFilterValue).click();
    cy.getByCy('customer-type-select-filter').should('be.visible').shouldHaveTextTranslated(customerTypeFilterValue);
    cy.getByCy('assign-calculation-factor-filter').should('be.visible').focus();
    cy.getByCy('assign-calculation-factor-filter').type(calculationFactorFilterValue);
    cy.getByCy('assign-calculation-factor-operand-filter').should('be.visible').click();
    cy.get(selectors.matOption).contains(calculationFactorOperandSymbol).click();
    cy.getByCy('assign-calculation-factor-operand-filter')
      .should('be.visible')
      .should('have.text', calculationFactorOperandSymbol);

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFilter)}${expectedUrlParameterWithFilter}`,
      createFilterCalculationResponse()
    ).as('filterCalculationItemsWithCalculationFactorAndCustomerTypeFilterRequest');

    cy.getByCy('apply-calculation-search-filter').click();

    cy.wait('@filterCalculationItemsWithCalculationFactorAndCustomerTypeFilterRequest')
      .its('request.url')
      .should('include', `${expectedUrlParameterWithFilter}`);
  });

  it('should correctly build the configuration search url with filter parameters', () => {
    const labelingFilterValue = 'left';
    const expectedDefaultUrlParameterWithNoFilter = '?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber';
    const expectedUrlParameterWithFilter = `?labeling=${labelingFilterValue}&orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`;

    cy.visit('/app/meta-data');
    cy.getByCy('meta-data-headline').should('exist');
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(2).click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest')
      .its('request.url')
      .should('include', expectedDefaultUrlParameterWithNoFilter);
    cy.getByCy('meta-data-headline').should('not.exist');
    cy.getByCy('toggle-config-search-filter').should('be.visible').click();

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}${expectedUrlParameterWithFilter}`,
      createFilterConfigurationResponse()
    ).as('filterConfigurationItemsWithLabelingFilterRequest');

    cy.getByCy('assign-labeling-filter').should('be.visible').focus();
    cy.getByCy('assign-labeling-filter').type(labelingFilterValue);
    cy.getByCy('apply-config-search-filter').click();

    cy.wait('@filterConfigurationItemsWithLabelingFilterRequest')
      .its('request.url')
      .should('include', expectedUrlParameterWithFilter);
  });

  it('should correctly build the configuration search url in the link existing configuration dialog with filter parameters', () => {
    const labelingFilterValue = 'left';
    const expectedDefaultUrlParameterWithNoFilter = '?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber';
    const expectedUrlParameterWithFilter = `?labeling=${labelingFilterValue}&orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`;

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}*`,
      createGetSingleCableCalculationResponse()
    ).as('getSingleCableCalculationRequest');

    cy.visit('/app/meta-data');

    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    cy.getByCy('meta-data-headline').should('not.exist');

    cy.getByCy('calculation-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();
    cy.wait('@getSingleCableCalculationRequest');
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.getByCy('open-assign-config-dialog').should('be.visible').should('be.enabled').click();
    cy.wait('@filterConfigurationItemsWithNoFilterRequest')
      .its('request.url')
      .should('include', expectedDefaultUrlParameterWithNoFilter);
    cy.getByCy('toggle-config-search-filter').should('be.visible').click();

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFilter)}${expectedUrlParameterWithFilter}`,
      createFilterConfigurationResponse()
    ).as('filterConfigurationItemsWithLabelingFilterRequest');

    cy.getByCy('assign-labeling-filter').should('be.visible').focus();
    cy.getByCy('assign-labeling-filter').type(labelingFilterValue);
    cy.getByCy('apply-config-search-filter').click();

    cy.wait('@filterConfigurationItemsWithLabelingFilterRequest')
      .its('request.url')
      .should('include', expectedUrlParameterWithFilter);
  });
});
