/* eslint-disable @typescript-eslint/no-unused-expressions */
import type {
  DbSeedResponse,
  SaveSingleCableCalculationResponseDto,
  AssignConfigurationItemsToCopiedCalculationResponseDto,
  CreateExcelProductionPlanFileRequestDto,
} from '@igus/icalc-domain';
import {
  FileDownloadButtonsActionEnum,
  IcalcValidationError,
  NumberUtils,
  RISK_FACTORS,
  createTestUserFullName,
  fileDownloadOptions,
  icalcIncompleteTestCalculation,
  icalcIncompleteTestConfiguration,
  icalcLockedTestCalculation,
  icalcLockedTestCalculationWithManyAssignments,
  icalcLockedTestConfiguration,
  icalcLockedTestConfigurationWithManyAssignments,
  icalcTestCalculation,
  icalcTestCalculationWithManyAssignments,
  icalcTestCalculationWithoutOverrides,
  icalcTestConfiguration,
  icalcTestConfigurationWithManyAssignments,
  icalcTestConfigurationWithoutOverrides,
  icalcTestExcelCalculation,
  icalcTestExcelProductionPlansRequest,
  icalcTestInvalidUUID,
  icalcTestNonExistingUUID,
} from '@igus/icalc-domain';
import { testUser } from '../../support/auth.po';
import { apiEndpoints, buildUrl } from '../../support/utils';

let testCalcWithoutOverridesId: string;
let testConfigWithoutOverridesId: string;
let testCalcWithoutOverridesSCCIds: string[];

let testCalcId: string;
let testConfigId: string;
let testCalcSCCIds: string[];

let testCalcWithManyAssignmentsId: string;
let testConfigWithManyAssignmentsId: string;
let testCalcWithManyAssignmentsSCCIds: string[];

let lockedTestCalcId: string;
let lockedTestConfigId: string;
let lockedTestCalcSCCIds: string[];

let lockedTestCalcWithManyAssignmentsId: string;
let lockedTestConfigWithManyAssignmentsId: string;
let lockedTestCalcWithManyAssignmentsSCCIds: string[];

let incompleteTestCalcId: string;
let incompleteTestConfigId: string;

describe('process API', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcId = data.calculation[icalcTestCalculation.calculationNumber].id;
      testConfigId = data.configuration[icalcTestConfiguration.matNumber].id;
      testCalcSCCIds = data.calculation[icalcTestCalculation.calculationNumber].singleCableCalculations.map(
        (scc) => scc.id
      );
    });
    cy.dbSeed('calculation-and-configuration --withoutOverrides').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcWithoutOverridesId = data.calculation[icalcTestCalculationWithoutOverrides.calculationNumber].id;
      testConfigWithoutOverridesId = data.configuration[icalcTestConfigurationWithoutOverrides.matNumber].id;
      testCalcWithoutOverridesSCCIds = data.calculation[
        icalcTestCalculationWithoutOverrides.calculationNumber
      ].singleCableCalculations.map((scc) => scc.id);
    });
    cy.dbSeed('calculation-and-configuration --manyAssignments').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcWithManyAssignmentsId = data.calculation[icalcTestCalculationWithManyAssignments.calculationNumber].id;
      testConfigWithManyAssignmentsId = data.configuration[icalcTestConfigurationWithManyAssignments.matNumber].id;
      testCalcWithManyAssignmentsSCCIds = data.calculation[
        icalcTestCalculationWithManyAssignments.calculationNumber
      ].singleCableCalculations.map((scc) => scc.id);
    });
    cy.dbSeed('calculation-and-configuration --locked').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      lockedTestCalcId = data.calculation[icalcLockedTestCalculation.calculationNumber].id;
      lockedTestConfigId = data.configuration[icalcLockedTestConfiguration.matNumber].id;
      lockedTestCalcSCCIds = data.calculation[icalcLockedTestCalculation.calculationNumber].singleCableCalculations.map(
        (scc) => scc.id
      );
    });
    cy.dbSeed('calculation-and-configuration --locked --manyAssignments').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      lockedTestCalcWithManyAssignmentsId =
        data.calculation[icalcLockedTestCalculationWithManyAssignments.calculationNumber].id;
      lockedTestConfigWithManyAssignmentsId =
        data.configuration[icalcLockedTestConfigurationWithManyAssignments.matNumber].id;
      lockedTestCalcWithManyAssignmentsSCCIds = data.calculation[
        icalcLockedTestCalculationWithManyAssignments.calculationNumber
      ].singleCableCalculations.map((scc) => scc.id);
    });
    cy.dbSeed('calculation-and-configuration --incomplete').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      incompleteTestCalcId = data.calculation[icalcIncompleteTestCalculation.calculationNumber].id;
      incompleteTestConfigId = data.configuration[icalcIncompleteTestConfiguration.matNumber].id;
    });
  });

  beforeEach(() => {
    cy.session('loginByApi', () => {
      cy.loginByApi(testUser.email, testUser.password);
    });
  });

  after(() => {
    cy.dbSeed('delete-testdata');
  });

  context('POST /process/validatePinAssignment/:calculationId/:configurationId', () => {
    it('should return a validation result with the right properties, if valid', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.validatePinAssignment)}/${testCalcId}/${testConfigId}`,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('isValid');
        expect(response.body.isValid).to.be.true;
      });
    });
    it('should return a validation result with the right properties, if invalid', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.validatePinAssignment)}/${incompleteTestCalcId}/${incompleteTestConfigId}`,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('isValid');
        expect(response.body).to.have.property('validationErrors');

        const { isValid } = response.body;

        expect(isValid).to.be.false;

        const { validationErrors } = response.body;

        expect(validationErrors.length).to.be.at.least(1);
        expect(validationErrors[0]).to.eq(IcalcValidationError.incompleteData);
      });
    });
    it('should return an error if calculation does not exist', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.validatePinAssignment)}/${icalcTestNonExistingUUID}/${testConfigId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
    it('should return an error if configuration does not exist', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.validatePinAssignment)}/${testCalcId}/${icalcTestNonExistingUUID}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
    it('should return an error if invalid params are passed', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.validatePinAssignment)}/${icalcTestInvalidUUID}/${icalcTestInvalidUUID}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Given string is not a UUID');
      });
    });
  });

  context('POST /process', () => {
    context('call endpoint with correct input data', () => {
      it('should return a correct ProcessManyResult for a calculation with an active/valid configuration', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: testCalcId,
            singleCableCalculationIds: testCalcSCCIds,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('allResultsValid');
          expect(response.body).to.have.property('calculationTotalPrice');
          expect(response.body).to.have.property('processResults');

          const { allResultsValid } = response.body;

          expect(allResultsValid).to.be.true;

          const { calculationTotalPrice } = response.body;

          expect(NumberUtils.round(calculationTotalPrice)).to.equal(23.18);

          const { processResults } = response.body;

          expect(processResults.length).to.not.be.null;
          expect(processResults.length).to.equal(1);

          expect(processResults[0]).to.have.property('configurationReference');
          expect(processResults[0]).to.have.property('discounts');

          const configurationReference = processResults[0].configurationReference;

          expect(configurationReference).to.have.property('configurationId');
          expect(configurationReference.configurationId).to.equal(testConfigId);
          expect(configurationReference).to.have.property('sccId');
          expect(configurationReference.sccId).to.equal(testCalcSCCIds[0]);

          const discounts = processResults[0].discounts;

          expect(discounts).to.have.property('chainflexDiscount');
          expect(discounts).to.have.property('mat017ItemDiscount');
          expect(discounts).to.have.property('workStepDiscount');

          const { chainflexDiscount, mat017ItemDiscount, workStepDiscount } = discounts;

          expect(chainflexDiscount).to.equal(1);
          expect(mat017ItemDiscount).to.equal(
            RISK_FACTORS.defaultMat017ItemRiskFactor * RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor
          );
          expect(workStepDiscount).to.equal(RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor);
        });
      });

      it('should return a correct ProcessManyResult for a calculation with an active/valid configuration (without overrides)', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: testCalcWithoutOverridesId,
            singleCableCalculationIds: testCalcWithoutOverridesSCCIds,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('allResultsValid');
          expect(response.body).to.have.property('calculationTotalPrice');
          expect(response.body).to.have.property('processResults');

          const { allResultsValid } = response.body;

          expect(allResultsValid).to.be.true;

          const { calculationTotalPrice } = response.body;

          expect(NumberUtils.round(calculationTotalPrice)).to.equal(21.14);

          const { processResults } = response.body;

          expect(processResults.length).to.not.be.null;
          expect(processResults.length).to.equal(1);

          expect(processResults[0]).to.have.property('configurationReference');

          const configurationReference = processResults[0].configurationReference;

          expect(configurationReference).to.have.property('configurationId');
          expect(configurationReference.configurationId).to.equal(testConfigWithoutOverridesId);
          expect(configurationReference).to.have.property('sccId');
          expect(configurationReference.sccId).to.equal(testCalcWithoutOverridesSCCIds[0]);
        });
      });

      it('should return a correct ProcessManyResult for a calculation with multiple active/valid configurations', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: testCalcWithManyAssignmentsId,
            singleCableCalculationIds: testCalcWithManyAssignmentsSCCIds,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('allResultsValid');
          expect(response.body).to.have.property('calculationTotalPrice');
          expect(response.body).to.have.property('processResults');

          const { allResultsValid } = response.body;

          expect(allResultsValid).to.be.true;

          const { calculationTotalPrice } = response.body;

          expect(NumberUtils.round(calculationTotalPrice)).to.equal(41.91);

          const { processResults } = response.body;

          expect(processResults.length).to.not.be.null;
          expect(processResults.length).to.equal(2);

          expect(processResults[0]).to.have.property('configurationReference');

          const firstConfigurationReference = processResults[0].configurationReference;

          expect(firstConfigurationReference).to.have.property('configurationId');
          expect(firstConfigurationReference.configurationId).to.equal(testConfigWithManyAssignmentsId);
          expect(firstConfigurationReference).to.have.property('sccId');
          expect(firstConfigurationReference.sccId).to.equal(testCalcWithManyAssignmentsSCCIds[0]);

          expect(processResults[1]).to.have.property('configurationReference');

          const secondConfigurationReference = processResults[1].configurationReference;

          expect(secondConfigurationReference).to.have.property('configurationId');
          expect(secondConfigurationReference.configurationId).to.equal(testConfigWithManyAssignmentsId);
          expect(secondConfigurationReference).to.have.property('sccId');
          expect(secondConfigurationReference.sccId).to.equal(testCalcWithManyAssignmentsSCCIds[1]);
        });
      });

      it('should return a correct ProcessManyResult for a locked calculation with an active/valid configuration', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: lockedTestCalcId,
            singleCableCalculationIds: lockedTestCalcSCCIds,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('allResultsValid');
          expect(response.body).to.have.property('calculationTotalPrice');
          expect(response.body).to.have.property('processResults');

          const { allResultsValid } = response.body;

          expect(allResultsValid).to.be.true;

          const { calculationTotalPrice } = response.body;

          expect(NumberUtils.round(calculationTotalPrice)).to.equal(33.11);

          const { processResults } = response.body;

          expect(processResults.length).to.not.be.null;
          expect(processResults.length).to.equal(1);

          expect(processResults[0]).to.have.property('configurationReference');

          const configurationReference = processResults[0].configurationReference;

          expect(configurationReference).to.have.property('configurationId');
          expect(configurationReference.configurationId).to.equal(lockedTestConfigId);
          expect(configurationReference).to.have.property('sccId');
          expect(configurationReference.sccId).to.equal(lockedTestCalcSCCIds[0]);
        });
      });

      it('should return a correct ProcessManyResult for a locked calculation with multiple active/valid configurations', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: lockedTestCalcWithManyAssignmentsId,
            singleCableCalculationIds: lockedTestCalcWithManyAssignmentsSCCIds,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('allResultsValid');
          expect(response.body).to.have.property('calculationTotalPrice');
          expect(response.body).to.have.property('processResults');

          const { allResultsValid } = response.body;

          expect(allResultsValid).to.be.true;

          const { calculationTotalPrice } = response.body;

          expect(NumberUtils.round(calculationTotalPrice)).to.equal(34.76);

          const { processResults } = response.body;

          expect(processResults.length).to.not.be.null;
          expect(processResults.length).to.equal(2);

          expect(processResults[0]).to.have.property('configurationReference');

          const firstConfigurationReference = processResults[0].configurationReference;

          expect(firstConfigurationReference).to.have.property('configurationId');
          expect(firstConfigurationReference.configurationId).to.equal(lockedTestConfigWithManyAssignmentsId);
          expect(firstConfigurationReference).to.have.property('sccId');
          expect(firstConfigurationReference.sccId).to.equal(lockedTestCalcWithManyAssignmentsSCCIds[0]);

          expect(processResults[1]).to.have.property('configurationReference');

          const secondConfigurationReference = processResults[1].configurationReference;

          expect(secondConfigurationReference).to.have.property('configurationId');
          expect(secondConfigurationReference.configurationId).to.equal(lockedTestConfigWithManyAssignmentsId);
          expect(secondConfigurationReference).to.have.property('sccId');
          expect(secondConfigurationReference.sccId).to.equal(lockedTestCalcWithManyAssignmentsSCCIds[1]);
        });
      });
    });

    context('call endpoint with wrong input data', () => {
      it('should give a meaningful response if given invalid uuids', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: icalcTestInvalidUUID,
            singleCableCalculationIds: [icalcTestInvalidUUID],
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message[0]).to.eq('calculationId must be a UUID');
          expect(response.body.message[1]).to.eq('each value in singleCableCalculationIds must be a UUID');
        });
      });
      it('should give a meaningful response if given empty singleCableCalculationIds array', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.process)}`,
          body: {
            calculationId: testCalcId,
            singleCableCalculationIds: [],
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message[0]).to.eq('singleCableCalculationIds should not be empty');
        });
      });
    });
  });

  context('POST /process/createExcelProductionPlanFile', () => {
    it('should create response if given correct parameters', () => {
      const payload: CreateExcelProductionPlanFileRequestDto = {
        fileDownloadOptions: fileDownloadOptions[FileDownloadButtonsActionEnum.fullXLSX],
        ...icalcTestExcelProductionPlansRequest,
        singleCableCalculationIds: testCalcSCCIds,
      };

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createExcelProductionPlanFile)}`,
        body: payload,
      }).then((response) => {
        expect(response.status).to.eq(201);
      });
    });
  });

  context('POST /process/createExcelCalculation', () => {
    it('should create response if given correct parameters', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createExcelCalculationFile)}`,
        body: {
          ...icalcTestExcelCalculation,
          calculationId: testCalcWithManyAssignmentsId,
          singleCableCalculationIds: testCalcWithManyAssignmentsSCCIds,
          fileDownloadOptions: fileDownloadOptions[FileDownloadButtonsActionEnum.fullXLSX],
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
      });
    });
  });

  context('locking/overrides functionality', () => {
    it('should secure that overrides are not changed in the configuration data of a snapshot and get used for the process step, if overrides of the original configuration get changed', () => {
      // link configuration that is included in locked calculation to an unlocked calculation
      cy.request<AssignConfigurationItemsToCopiedCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.assignConfigurationToExistingCalculation)}`,
        body: {
          calculationId: testCalcId,
          configurationId: lockedTestConfigId,
          createdBy: createTestUserFullName(),
          singleCableCalculationBaseData: {
            batchSize: 2,
            chainflexLength: 2,
          },
        },
        failOnStatusCode: false,
      }).then((linkResponse) => {
        expect(linkResponse.status).to.eq(201);
        const scc = linkResponse.body;
        const config = linkResponse.body?.configuration;
        const saveSingleCableCalculationPayload = {
          id: scc.id,
          calculationFactor: scc.calculationFactor,
          batchSize: scc.batchSize,
          chainflexLength: scc.chainflexLength,
          configuration: config,
          assignedBy: createTestUserFullName(),
          assignmentDate: new Date(),
          commercialWorkStepOverrides: {
            projektierung: 7,
          },
        };

        // reset work steps of newly assigned configuration
        cy.request<SaveSingleCableCalculationResponseDto>({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
          body: {
            ...saveSingleCableCalculationPayload,
            configuration: {
              ...saveSingleCableCalculationPayload.configuration,
              state: {
                workStepOverrides: {},
              },
            },
          },
        }).then((saveResponse) => {
          expect(saveResponse.status).to.eq(201);
          expect(saveResponse.body).to.have.property('singleCableCalculation');

          const { singleCableCalculation } = saveResponse.body;

          expect(singleCableCalculation).to.not.be.null;
          expect(singleCableCalculation).to.have.property('configuration');

          const { configuration } = singleCableCalculation;

          expect(configuration).to.not.be.null;
          expect(configuration).to.have.property('state');

          const { state } = configuration;

          expect(state).to.not.be.null;
          expect(state).to.have.property('workStepOverrides');

          const { workStepOverrides } = state;

          expect(workStepOverrides).to.not.have.property('projektierung');
          cy.request({
            method: 'GET',
            url: `${buildUrl(apiEndpoints.singleCableCalculation)}?calculationId=${lockedTestCalcId}`,
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(200);

            const responseBody = getResponse.body;

            expect(responseBody).to.have.property('snapshot');

            const { snapshot } = responseBody;

            expect(snapshot).to.not.be.null;
            expect(snapshot).to.have.property('configurationData');

            const { configurationData } = snapshot;

            expect(configurationData).to.not.be.null;
            expect(configurationData).to.have.property('state');

            const stateInSnapshot = configurationData.state;

            expect(stateInSnapshot).to.not.be.null;
            expect(stateInSnapshot).to.have.property('workStepOverrides');

            const workStepOverridesInSnapshot = stateInSnapshot.workStepOverrides;

            expect(workStepOverridesInSnapshot).to.not.be.null;
            expect(workStepOverridesInSnapshot).to.have.property('consignment');

            const { consignment } = workStepOverridesInSnapshot;

            expect(consignment).to.not.be.null;
            expect(consignment).to.equal(2);

            expect(workStepOverridesInSnapshot).to.have.property('crimp');

            const { crimp } = workStepOverridesInSnapshot;

            expect(crimp).to.not.be.null;
            expect(crimp).to.equal(4);

            expect(workStepOverridesInSnapshot).to.have.property('sendTestReport');

            const { sendTestReport } = workStepOverridesInSnapshot;

            expect(sendTestReport).to.not.be.null;
            expect(sendTestReport).to.equal(1);

            // check that the work step overrides and work step prices are taken from the snapshot and not from the active config (which would be none at this point)
            cy.request({
              method: 'POST',
              url: `${buildUrl(apiEndpoints.process)}`,
              body: {
                calculationId: lockedTestCalcId,
                singleCableCalculationIds: lockedTestCalcSCCIds,
              },
            }).then((response) => {
              expect(response.status).to.eq(201);

              expect(response.body).to.have.property('processResults');

              const { processResults } = response.body;

              expect(processResults.length).to.not.be.null;
              expect(processResults.length).to.equal(1);

              expect(processResults[0]).to.have.property('workSteps');

              const workSteps = processResults[0].workSteps;

              expect(workSteps[4]).to.have.property('name');
              const name = workSteps[4].name;

              expect(name).to.equal('consignment');

              expect(workSteps[4]).to.have.property('quantity');
              const consignmentQuantity = workSteps[4].quantity;

              expect(consignmentQuantity).to.equal(2);
            });
          });
        });
      });
    });
  });
});
