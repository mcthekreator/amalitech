import {
  CustomerTypeEnum,
  IcalcValidationError,
  createApproveConfigurationStatusResponse,
  createCalculationPresentation,
  createCheckForNewChainflexPricesResponse,
  createConfigurationPresentation,
  createCreateCalculationAndConfigurationResponse,
  createFilterCalculationResponse,
  createGetChainflexResponse,
  createGetMat017Response,
  createGetWidenSearchResponse,
  createHaveMat017ItemsOverridesChangedResponse,
  createIcalcTestChainflexStateWithValidChainflex,
  createIcalcTestConnectorState,
  createIcalcTestConnectorStatePresentation,
  createIcalcTestLibraryState,
  createIcalcTestMat017Item,
  createIcalcTestPinAssignmentState,
  createProcessResponse,
  createSaveSingleCableCalculationResponse,
  createSingleCableCalculationPresentation,
  createUpdateMat017ItemsOverridesResponse,
  createValidatePinAssignmentResponse,
  icalcTestCalculation,
  icalcTestConfiguration,
  icalcTestSingleCableCalculation,
  createMat017ItemLatestModificationDateResponse,
} from '@igus/icalc-domain';
import { signedInUserData } from '../../support/auth.po';
import { apiEndpoints, externalUrls, byCy, selectors, buildApiPath } from '../../support/utils';

describe('status-handling', () => {
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

    cy.intercept('POST', `${buildApiPath(apiEndpoints.authRefresh)}`, {
      status: { statusCode: 200 },
      body: 'refreshed',
    }).as('authRefresh');

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
    }).as('authProfileRequest');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.chainflex)}?orderDirection=asc&search=&skip=0&take=100&orderBy=partNumber`,
      createGetChainflexResponse()
    ).as('getChainflexListRequest');

    // the recommendations in the connector steps are not relevant for the status handling test cases, so a general intercept is sufficient
    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.mat017Item
      )}?orderDirection=desc&search=&skip=0&take=100&orderBy=score&showZeroMatches=false&showOnlyManuallyCreated=false&partNumber=*`,
      createGetMat017Response()
    ).as('getMat017ItemListSuccessfulRequest');

    // the images for the selected mat017Items are not relevant for status handling test cases, so a general intercept is sufficient
    cy.intercept('GET', `${buildApiPath(apiEndpoints.getWidenData)}*`, createGetWidenSearchResponse()).as(
      'getMat017ItemImageFromWidenSuccessfulRequest'
    );

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.checkChainflexAndPriceExistence)}`,
      createCheckForNewChainflexPricesResponse()
    ).as('checkForNewChainflexPricesRequest');

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.haveMat017ItemsOverridesChanged)}`,
      createHaveMat017ItemsOverridesChangedResponse()
    ).as('haveMat017ItemsOverridesChangedRequest');

    cy.intercept(
      'PATCH',
      `${buildApiPath(apiEndpoints.updateMat017ItemsOverrides)}`,
      createUpdateMat017ItemsOverridesResponse()
    ).as('updateMat017ItemsOverrides');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.getMat017ItemsLatestModificationDate)}`,
      createMat017ItemLatestModificationDateResponse()
    ).as('latestModificationDate');
  });

  it('should be able to go to the results page without approval popup in pin assignment step for a new valid configuration', () => {
    const finalChainflexStateWithValidChainflex = createIcalcTestChainflexStateWithValidChainflex();
    const exampleMat017Item = createIcalcTestMat017Item();

    const finalConnectorState = createIcalcTestConnectorState({
      leftConnector: {
        mat017ItemListWithWidenData: [
          {
            ...exampleMat017Item,
            quantity: 1,
            status: 'left',
          },
        ],
      },
    });

    const finalLibraryState = createIcalcTestLibraryState();
    const finalPinAssignmentState = createIcalcTestPinAssignmentState();

    cy.visit('/app/meta-data');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=${
        icalcTestCalculation.calculationNumber
      }`,
      {}
    ).as('findByNumberCalculationNumberNotFoundRequest');

    cy.getByCy('assign-calculation-number').should('be.visible').focus();
    cy.getByCy('assign-calculation-number').type(icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').click();
    cy.wait('@findByNumberCalculationNumberNotFoundRequest');

    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.betriebsMittler).click();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(`${icalcTestCalculation.calculationFactor}`);

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=${icalcTestConfiguration.matNumber}`,
      {}
    ).as('findByNumberMatNumberNotFoundRequest');

    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').focus();
    cy.getByCy('assign-selected-config-item-config-number').type(icalcTestConfiguration.matNumber);

    cy.getByCy('assign-selected-config-labeling-left').focus();

    cy.getByCy('assign-selected-config-labeling-left').type(icalcTestConfiguration.labelingLeft);
    cy.wait('@findByNumberMatNumberNotFoundRequest');

    cy.getByCy('selected-config-copy-labeling-left-to-right').should('contain', 'arrow_forward').click();

    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', icalcTestConfiguration.labelingLeft)
      .focus();

    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type(icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').should('be.visible').focus();

    cy.getByCy('assign-selected-config-batch-size').type(`${icalcTestSingleCableCalculation.batchSize}`);

    const scc = createSingleCableCalculationPresentation();

    const calculation = createCalculationPresentation({
      ...icalcTestCalculation,
      singleCableCalculations: [scc],
      isLocked: false,
    });

    const configuration = createConfigurationPresentation({
      ...icalcTestConfiguration,
      singleCableCalculations: [scc],
    });

    const firstCreateCreateCalculationAndConfigurationResponseFixture = createCreateCalculationAndConfigurationResponse(
      {
        calculation,
        configuration,
      }
    );

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.createCalculationAndConfiguration)}`,
      firstCreateCreateCalculationAndConfigurationResponseFixture
    ).as('createCalculationAndConfigurationSuccessRequest');

    cy.getByCy('start-calculation').should('be.visible').click();

    cy.wait('@createCalculationAndConfigurationSuccessRequest');
    cy.wait('@getChainflexListRequest');

    cy.getByCy('chainflex-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();

    cy.getByCy('choose-chainflex-length').should('be.visible').focus();

    cy.getByCy('choose-chainflex-length').type(`${icalcTestSingleCableCalculation.chainflexLength}`);

    const createSaveSingleCableCalculationResponseFixture = createSaveSingleCableCalculationResponse({
      singleCableCalculation: {
        configuration: {
          state: {
            chainFlexState: finalChainflexStateWithValidChainflex,
            pinAssignmentState: null,
          },
        },
      },
    });

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponseFixture
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('save-chainflex-length').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');
    cy.wait('@getMat017ItemListSuccessfulRequest');

    // change intercepts before clicking to right connector step
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              connectorState: finalConnectorState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('save-connector-mat017-items').should('be.visible').click();

    cy.wait('@saveSingleCableCalculationRequest');
    cy.wait('@getMat017ItemListSuccessfulRequest');

    cy.getByCy('save-connector-mat017-items').should('be.visible').click();

    cy.wait('@saveSingleCableCalculationRequest');

    // change intercept before clicking to pin-assignment step
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              libraryState: finalLibraryState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('library-mat-card-content').should('be.visible');
    cy.getByCy('save-library').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest', { requestTimeout: 45000 });

    // Before clicking to Result step
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.validatePinAssignment)}/*/*`,
      createValidatePinAssignmentResponse()
    ).as('validatePinAssignmentSuccessfulRequest');

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              pinAssignmentState: finalPinAssignmentState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.intercept('POST', `${buildApiPath(apiEndpoints.process)}`, createProcessResponse()).as(
      'processStatusHandlingRequest'
    );

    cy.getByCy('save-and-validate-configuration').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              pinAssignmentState: finalPinAssignmentState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.wait('@validatePinAssignmentSuccessfulRequest');
    cy.wait('@saveSingleCableCalculationRequest', { requestTimeout: 45000 });
    cy.location('pathname').should('contain', 'app/results');
    cy.getByCy('open-download-excel-dialog').should('be.visible');
    cy.wait('@processStatusHandlingRequest').getByCy('open-download-excel-dialog').click();

    cy.getByCy('export-calculation-excel').should('be.visible');
    cy.getByCy('export-production-plan-excel').should('exist');
  });

  it('should show approval popup in pin assignment step for a new invalid configuration and go to results page when approved', () => {
    const finalChainflexStateWithValidChainflex = createIcalcTestChainflexStateWithValidChainflex();
    const exampleMat017Item = createIcalcTestMat017Item();

    const finalConnectorState = createIcalcTestConnectorStatePresentation({
      leftConnector: {
        mat017ItemListWithWidenData: [
          {
            ...exampleMat017Item,
            mat017ItemGroup: 'RC-K6',
            quantity: 1,
            status: 'left',
          },
        ],
      },
    });

    const finalLibraryState = createIcalcTestLibraryState();
    const finalPinAssignmentState = createIcalcTestPinAssignmentState();

    cy.visit('/app/meta-data');

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.calculationFindByNumber)}?calculationNumber=${
        icalcTestCalculation.calculationNumber
      }`,
      {}
    ).as('findByNumberCalculationNumberNotFoundRequest');

    cy.getByCy('assign-calculation-number').should('be.visible').focus();
    cy.getByCy('assign-calculation-number').type(icalcTestCalculation.calculationNumber);
    cy.getByCy('assign-calculation-number').should('have.value', icalcTestCalculation.calculationNumber);

    cy.getByCy('choose-selected-calc-customer-type').click();
    cy.wait('@findByNumberCalculationNumberNotFoundRequest');

    cy.get(selectors.matOption).containsTranslated(CustomerTypeEnum.betriebsMittler).click();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').should('be.visible').focus();

    cy.getByCy('assign-selected-calculation-item-calculation-factor').type(`${icalcTestCalculation.calculationFactor}`);
    cy.getByCy('assign-selected-calculation-item-calculation-factor').should(
      'have.value',
      icalcTestCalculation.calculationFactor
    );

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.configurationFindByMatNumber)}?matNumber=${icalcTestConfiguration.matNumber}`,
      {}
    ).as('findByNumberMatNumberNotFoundRequest');

    cy.getByCy('assign-selected-config-item-config-number').should('be.visible').focus();

    cy.getByCy('assign-selected-config-item-config-number').type(icalcTestConfiguration.matNumber);
    cy.getByCy('assign-selected-config-item-config-number').should('have.value', icalcTestConfiguration.matNumber);

    cy.getByCy('assign-selected-config-labeling-left').focus();

    cy.getByCy('assign-selected-config-labeling-left').type(icalcTestConfiguration.labelingLeft);
    cy.wait('@findByNumberMatNumberNotFoundRequest');

    cy.getByCy('assign-selected-config-labeling-left').should('have.value', icalcTestConfiguration.labelingLeft);
    cy.getByCy('selected-config-copy-labeling-left-to-right').should('contain', 'arrow_forward').click();

    cy.getByCy('assign-selected-config-labeling-right').should('be.visible');
    cy.getByCy('assign-selected-config-labeling-right')
      .should('be.visible')
      .should('have.value', icalcTestConfiguration.labelingLeft)
      .focus();

    cy.getByCy('assign-selected-config-labeling-right').type('{selectall}{backspace}');
    cy.getByCy('assign-selected-config-labeling-right').type(icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-labeling-right').should('have.value', icalcTestConfiguration.labelingRight);

    cy.getByCy('assign-selected-config-batch-size').should('be.visible').focus();

    cy.getByCy('assign-selected-config-batch-size').type(`${icalcTestSingleCableCalculation.batchSize}`);

    const scc = createSingleCableCalculationPresentation();

    const secondCreateCreateCalculationAndConfigurationResponseFixture =
      createCreateCalculationAndConfigurationResponse({
        calculation: createCalculationPresentation({
          ...icalcTestCalculation,
          singleCableCalculations: [scc],
        }),
        configuration: createConfigurationPresentation({
          ...icalcTestConfiguration,
          singleCableCalculations: [scc],
        }),
      });

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.createCalculationAndConfiguration)}`,
      secondCreateCreateCalculationAndConfigurationResponseFixture
    ).as('createCalculationAndConfigurationSuccessRequest');

    cy.getByCy('start-calculation').should('be.visible').click();

    cy.wait('@createCalculationAndConfigurationSuccessRequest');
    cy.wait('@getChainflexListRequest');

    cy.getByCy('chainflex-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();

    cy.getByCy('choose-chainflex-length').should('be.visible');

    cy.getByCy('choose-chainflex-length').type(`${icalcTestSingleCableCalculation.chainflexLength}`);

    // change intercept before clicking to left connector step
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              chainFlexState: finalChainflexStateWithValidChainflex,
              pinAssignmentState: null,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('save-chainflex-length').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');
    cy.wait('@getMat017ItemListSuccessfulRequest');

    cy.getByCy('mat017-items-table').find(selectors.tableRow).eq(12).find(byCy('add-mat017-item')).click();

    cy.wait('@getMat017ItemListSuccessfulRequest');

    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              connectorState: finalConnectorState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('save-connector-mat017-items').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');

    // change intercept before clicking to library step
    cy.intercept('GET', `${externalUrls.widenContent}/*`, {}).as('getWidenImageForMAT017Item');

    cy.getByCy('save-connector-mat017-items').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');

    // change intercept before clicking to pin-assignment step
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              libraryState: finalLibraryState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');

    cy.getByCy('library-mat-card-content').should('be.visible');
    cy.getByCy('save-library').should('be.visible').click();
    cy.wait('@getMat017ItemImageFromWidenSuccessfulRequest');
    cy.wait('@saveSingleCableCalculationRequest', { requestTimeout: 45000 });

    // change intercepts before opening validation dialog
    // unsuccessful
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              pinAssignmentState: finalPinAssignmentState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.validatePinAssignment)}/*/*`,
      createValidatePinAssignmentResponse({
        isValid: false,
        leftItemCount: 1,
        leftIsValid: false,
        validationErrors: [IcalcValidationError.pinAssignmentRightRCK6ItemContactMismatch],
      })
    ).as('validatePinAssignmentInvalidTestcaseRequest');

    cy.getByCy('save-and-validate-configuration').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest', { requestTimeout: 45000 });
    cy.wait('@validatePinAssignmentInvalidTestcaseRequest');

    // change intercepts before approving the dialog and going to the result step
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              pinAssignmentState: finalPinAssignmentState,
            },
          },
        },
      })
    ).as('saveSingleCableCalculationRequest');
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.approveConfigurationStatus)}`,
      createApproveConfigurationStatusResponse()
    ).as('approveConfigurationStatusRequest');
    cy.intercept('POST', `${buildApiPath(apiEndpoints.process)}`, createProcessResponse()).as(
      'processStatusHandlingApprovedRequest'
    );

    cy.getByCy('approve-and-go-to-result').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');
    cy.wait('@approveConfigurationStatusRequest');

    cy.location('pathname').should('contain', '/app/results');
    cy.wait('@processStatusHandlingApprovedRequest').getByCy('open-download-excel-dialog').should('be.visible').click();

    cy.getByCy('export-calculation-excel').should('be.visible');
    cy.getByCy('export-production-plan-excel').should('exist');
  });

  it('should show a notification when approval has been revoked after changes to a previously approved configuration', () => {
    const exampleMat017Item = createIcalcTestMat017Item();

    const finalConnectorState = createIcalcTestConnectorStatePresentation({
      leftConnector: {
        mat017ItemListWithWidenData: [
          {
            ...exampleMat017Item,
            mat017ItemGroup: 'RC-K6',
            quantity: 1,
            status: 'left',
          },
        ],
      },
    });

    // start at app/meta-data
    cy.visit('/app/meta-data');

    const responseFixture = createFilterCalculationResponse();

    cy.intercept(
      'GET',
      `${buildApiPath(
        apiEndpoints.calculationFilter
      )}?orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`,
      responseFixture
    ).as('filterCalculationItemsWithNoFilterRequest');

    const scc = createSingleCableCalculationPresentation();

    const getSingleCableCalculationByCalculationIdFixture = createSingleCableCalculationPresentation({
      calculation: createCalculationPresentation({
        ...icalcTestCalculation,
        singleCableCalculations: [scc],
        isLocked: false,
      }),
      configuration: createConfigurationPresentation({
        ...icalcTestConfiguration,
        singleCableCalculations: [scc],
      }),
    });

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.singleCableCalculation)}?calculationId=${responseFixture.data[0].id}`,
      getSingleCableCalculationByCalculationIdFixture
    ).as('getSingleCableCalculationByCalculationId');

    // change to calculation search tab
    cy.getByCy('meta-data-tab-group').should('be.visible');
    cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
    cy.wait('@filterCalculationItemsWithNoFilterRequest');
    // select integration-calc001 with integration-mat001
    cy.getByCy('calculation-search-result-table').should('be.visible').find(selectors.tableRow).eq(0).click();
    cy.getByCy('edit-calculation').should('be.visible').should('be.enabled').click();

    cy.intercept(
      'GET',
      `${buildApiPath(apiEndpoints.chainflex)}?orderDirection=asc&search=&skip=0&take=100&orderBy=partNumber`,
      createGetChainflexResponse()
    ).as('getChainflexListRequest');

    // got to chainflex step
    cy.getByCy('start-calculation').should('be.visible').click();
    cy.wait('@getChainflexListRequest');

    // go to right connector
    cy.getByCy('save-chainflex-length').should('be.visible').click();
    cy.wait('@getMat017ItemListSuccessfulRequest');

    // deselect mat017Item
    cy.getByCy('mat017-items-table').should('be.visible');
    cy.getByCy('add-mat017-item').eq(0).invoke('show').click();

    cy.getByCy('mat017-items-table').should('be.visible');
    cy.getByCy('remove-mat017-item').invoke('show').click();
    cy.wait('@getMat017ItemListSuccessfulRequest');

    // select new mat017Item
    cy.getByCy('mat017-items-table')
      .should('be.visible')
      .find(selectors.tableRow)
      .eq(0)
      .find(byCy('add-mat017-item'))
      .click();
    cy.wait('@getMat017ItemListSuccessfulRequest');

    // adjust saveSingleCableCalculationResponse to right connector step as if approval has been revoked through the changes before
    cy.intercept(
      'POST',
      `${buildApiPath(apiEndpoints.saveSingleCableCalculation)}`,
      createSaveSingleCableCalculationResponse({
        singleCableCalculation: {
          configuration: {
            state: {
              connectorState: finalConnectorState,
            },
          },
        },
        calculationConfigurationStatus: {
          hasApprovalBeenRevoked: true,
        },
      })
    ).as('saveSingleCableCalculationRequest');

    // go to right connector step
    cy.getByCy('save-connector-mat017-items').should('be.visible').click();
    cy.wait('@saveSingleCableCalculationRequest');
    cy.wait('@getMat017ItemListSuccessfulRequest');
    // check if snack bar appears
    cy.get('.mat-mdc-snack-bar-label').should('be.visible');
  });
});
