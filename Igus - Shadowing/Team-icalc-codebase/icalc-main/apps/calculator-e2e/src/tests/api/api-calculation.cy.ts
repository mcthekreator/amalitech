/* eslint-disable @typescript-eslint/no-unused-expressions */
import type {
  Calculation,
  ChainflexCable,
  Configuration,
  ConfigurationState,
  DbSeedResponse,
  AssignConfigurationToExistingCalculationResponseDto,
  SaveSingleCableCalculationResponseDto,
} from '@igus/icalc-domain';
import {
  CustomerTypeEnum,
  ICALC_DYNAMIC_CALC_NUMBER_PREFIX,
  ICALC_DYNAMIC_MAT_NUMBER_PREFIX,
  Mat017ItemOverridesEnum,
  WorkStepName,
  createCalculationDoesNotExistErrorMessage,
  createLockedCalculationCannotBeModifiedErrorMessage,
  icalcIncompleteTestCalculation,
  icalcIncompleteTestConfiguration,
  icalcLockedTestCalculation,
  icalcLockedTestCalculationWithManyAssignments,
  icalcLockedTestConfiguration,
  icalcLockedTestConfigurationWithManyAssignments,
  icalcTestCalculation,
  icalcTestCalculationForLocking,
  icalcTestCalculationWithManyAssignments,
  icalcTestCalculationWithUpdatedMat017ItemPrice,
  icalcTestConfiguration,
  icalcTestConfigurationWithManyAssignments,
  icalcTestConfigurationWithUpdatedMat017ItemPrice,
  icalcTestNonExistingUUID,
  icalcTestSingleCableCalculation,
} from '@igus/icalc-domain';
import { testUser } from '../../support/auth.po';
import { apiEndpoints, buildUrl } from '../../support/utils';

let testCalcId: string;
let testCalcWithManyAssignmentsId: string;
let testCalcIdForLocking: string;
let testLockedCalcId: string;
let testLockedCalcWithManyAssignmentsId: string;
let testLockedConfWithManyAssignmentsId: string;
let testLockedCalc: Calculation;
let testConfId: string;
let testConfWithManyAssignmentsId: string;
let testLockedConfId: string;
let lockedCalcSCCIds: string[];
let originalConfigurationData: Partial<Configuration>;
let testCalcWithUpdatedMat017ItemPriceId: string;
let testConfWithUpdatedMat017ItemPriceId: string;

const lockedByTestUser = testUser.firstName + ' ' + testUser.lastName;

describe('calculation API', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcId = data.calculation[icalcTestCalculation.calculationNumber].id;
      testConfId = data.configuration[icalcTestConfiguration.matNumber].id;
    });
    cy.dbSeed('calculation-and-configuration --manyAssignments').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcWithManyAssignmentsId = data.calculation[icalcTestCalculationWithManyAssignments.calculationNumber].id;
      testConfWithManyAssignmentsId = data.configuration[icalcTestConfigurationWithManyAssignments.matNumber].id;
    });
    cy.dbSeed('calculation-and-configuration --forLocking').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcIdForLocking = data.calculation[icalcTestCalculationForLocking.calculationNumber].id;
    });
    cy.dbSeed('calculation-and-configuration --locked').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      originalConfigurationData = data.configuration[icalcLockedTestConfiguration.matNumber];
      testLockedCalc = data.calculation[icalcLockedTestCalculation.calculationNumber] as Calculation;
      testLockedCalcId = testLockedCalc.id;
      testLockedConfId = data.configuration[icalcLockedTestConfiguration.matNumber].id;
      lockedCalcSCCIds = data.calculation[icalcLockedTestCalculation.calculationNumber].singleCableCalculations.map(
        (scc) => scc.id
      );
    });
    cy.dbSeed('calculation-and-configuration --locked --manyAssignments').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testLockedCalcWithManyAssignmentsId =
        data.calculation[icalcLockedTestCalculationWithManyAssignments.calculationNumber].id;
      testLockedConfWithManyAssignmentsId =
        data.configuration[icalcLockedTestConfigurationWithManyAssignments.matNumber].id;
    });
    cy.dbSeed('calculation-and-configuration --updatedMat017ItemPrice').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcWithUpdatedMat017ItemPriceId =
        data.calculation[icalcTestCalculationWithUpdatedMat017ItemPrice.calculationNumber].id;
      testConfWithUpdatedMat017ItemPriceId =
        data.configuration[icalcTestConfigurationWithUpdatedMat017ItemPrice.matNumber].id;
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

  context('POST /calculation/createCalculationAndConfiguration', () => {
    it('should be able to create a new calculation and a configuration', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculation: {
            ...icalcIncompleteTestCalculation,
            calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
          },
          configuration: {
            ...icalcIncompleteTestConfiguration,
            matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          },
          singleCableCalculation: icalcTestSingleCableCalculation,
        },
      }).then((response) => {
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        const { body, status } = response;

        expect(status).to.eq(201);
        expect(body).to.have.property('calculationId');
        expect(body).to.have.property('configurationId');
        expect(body.calculation.singleCableCalculations.length).to.eq(1);
        expect(body.calculation.customerType).to.equals(CustomerTypeEnum.serialCustomer);
        expect(body.calculation.creationDate).to.match(dateFormatRegex);
        expect(body.calculation.modificationDate).to.match(dateFormatRegex);
        expect(body.configuration.creationDate).to.match(dateFormatRegex);
        expect(body.configuration.modificationDate).to.match(dateFormatRegex);
      });
    });

    it('should not be able to create a new calculation and a configuration with missing customerType', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculation: {
            calculationFactor: 1,
            createdBy: 'testUser',
            calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
          },
          configuration: {
            ...icalcIncompleteTestConfiguration,
            matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          },
          singleCableCalculation: icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
      });
    });

    it('should not be able to create a new calculation and a configuration with missing calculationFactor', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculation: {
            customerType: CustomerTypeEnum.serialCustomer,
            assignedBy: 'test user',
            calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
          },
          configuration: {
            ...icalcIncompleteTestConfiguration,
            matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          },
          singleCableCalculation: icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
      });
    });

    it('should not be able to create a new calculation and a configuration with missing calculationNumber', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculation: {
            assignedBy: 'test user',
            calculationFactor: 1,
            customerType: CustomerTypeEnum.serialCustomer,
          },
          configuration: {
            ...icalcIncompleteTestConfiguration,
            matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          },
          singleCableCalculation: icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(409);
      });
    });

    it('should not be able to create a new calculation and a configuration with missing matNumber', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculation: {
            ...icalcIncompleteTestCalculation,
            calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
          },
          configuration: {
            labelingLeft: 'left label',
            labelingRight: 'right label',
            createdBy: 'testUser',
          },
          singleCableCalculation: icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(409);
      });
    });

    it('should not be able to create a new calculation and a configuration without singleCableCalculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculation: {
            ...icalcIncompleteTestCalculation,
            calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
          },
          configuration: {
            labelingLeft: 'left label',
            labelingRight: 'right label',
            createdBy: 'testUser',
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  context('POST /calculation/createNewConfigurationForExistingCalculation', () => {
    it('should be able to assign a new configuration to an existing calculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createNewConfigurationForExistingCalculation)}`,
        body: {
          createdBy: 'Test User',
          calculationId: testCalcId,
          configuration: {
            ...icalcIncompleteTestConfiguration,
            matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          },
          singleCableCalculation: {
            batchSize: 20,
          },
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('configurationId');
        expect(response.body.calculation.customerType).to.equals(CustomerTypeEnum.serialCustomer);
        expect(response.body.calculation.singleCableCalculations.length).to.be.greaterThan(1);
        expect(response.body).to.have.property('calculationId');
        expect(response.body.configuration.isCopyOfConfigurationId).to.be.equal(null);
      });
    });

    it('should not be able to assign a new configuration to an existing calculation with missing matNumber', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculationId: testCalcId,
          configuration: {
            labelingLeft: 'left label',
            labelingRight: 'right label',
            createdBy: 'testUser',
          },
          singleCableCalculation: icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to assign a new configuration to an existing calculation without singleCableCalculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
        body: {
          calculationId: testCalcId,
          configuration: {
            labelingLeft: 'left label',
            labelingRight: 'right label',
            createdBy: 'testUser',
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  context('POST /calculation/assignConfigurationToExistingCalculation', () => {
    it('should be able to assign an existing configuration to an existing calculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.assignConfigurationToExistingCalculation)}`,
        body: {
          createdBy: 'Test User',
          calculationId: testCalcId,
          configurationId: testConfId,
          singleCableCalculationBaseData: icalcTestSingleCableCalculation,
        },
      }).then((response) => {
        const configurationId: string = response.body.configurationId;
        const singleCalculationListLengthOfConfigId: boolean = response.body.calculation.singleCableCalculations.filter(
          (scc) => scc.configurationId === configurationId
        ).length;

        expect(response.status).to.eq(201);
        expect(response.body.configurationId).to.be.equal(testConfId);
        expect(response.body.calculationId).to.be.equal(testCalcId);
        expect(singleCalculationListLengthOfConfigId).to.be.greaterThan(0);
      });

      it('should not be able to create a new calculation and a configuration with missing configurationId', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
          body: {
            createdBy: 'Test User',
            calculationId: testCalcId,
            singleCableCalculationBaseData: icalcTestSingleCableCalculation,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });

      it('should not be able to create a new calculation and a configuration with missing calculationId', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
          body: {
            createdBy: 'Test User',
            configurationId: testConfId,
            singleCableCalculationBaseData: icalcTestSingleCableCalculation,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });

      it('should not be able to create a new calculation and a configuration with missing createdBy', () => {
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.createCalculationAndConfiguration)}`,
          body: {
            calculationId: testCalcId,
            singleCableCalculationBaseData: icalcTestSingleCableCalculation,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });
  });

  context('POST /calculation/copyConfigurationToExistingCalculation', () => {
    it('should be able to duplicate a configuration within an existing calculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          newMatNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          configurationId: testConfId,
          createdBy: 'TestUser',
          calculationId: testCalcId,
          labelingLeft: '',
          labelingRight: '',
          updatePrices: false,
          ...icalcTestSingleCableCalculation,
        },
      }).then((response) => {
        const newConfigId = response.body.configurationId;

        expect(response.status).to.eq(201);
        expect(response.body.calculationId).to.be.equal(testCalcId);
        expect(newConfigId).to.not.be.equal(testConfId);
        expect(response.body.batchSize).to.be.equal(icalcTestSingleCableCalculation.batchSize);
        expect(response.body.chainflexLength).to.be.equal(icalcTestSingleCableCalculation.chainflexLength);
        expect(response.body.configuration.isCopyOfConfigurationId).to.be.equal(testConfId);
        expect(response.body.configuration.id).to.be.equal(newConfigId);
      });
    });

    it('should not be able to duplicate a configuration within an existing calculation without matNumber', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          configurationId: testConfId,
          createdBy: 'TestUser',
          calculationId: testCalcId,
          labelingLeft: '',
          labelingRight: '',
          ...icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration within an existing calculation without configurationId', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          newMatNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          createdBy: 'TestUser',
          calculationId: testCalcId,
          labelingLeft: '',
          labelingRight: '',
          ...icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration within an existing calculation without calculationId', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          newMatNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          configurationId: testConfId,
          createdBy: 'TestUser',
          labelingLeft: '',
          labelingRight: '',
          ...icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration within an existing calculation without createdBy', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          newMatNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          configurationId: testConfId,
          calculationId: testCalcId,
          labelingLeft: '',
          labelingRight: '',
          ...icalcTestSingleCableCalculation,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration within an existing calculation without SCC data', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          newMatNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`,
          configurationId: testConfId,
          calculationId: testCalcId,
          createdBy: 'TestUser',
          labelingLeft: '',
          labelingRight: '',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  context('POST /calculation/copyConfigurationToNewCalculation', () => {
    it('should be able to duplicate a configuration to a new calculation', () => {
      const calculationId = `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`;
      const newMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          calculationNumber: calculationId,
          configurationId: testConfId,
          calculationFactor: 1.2,
          customerType: CustomerTypeEnum.serialCustomer,
          createdBy: 'TestUser',
          updatePrices: false,
          ...icalcTestSingleCableCalculation,
          newMatNumber,
        },
      }).then((response) => {
        const newCalcId: string = response.body.calculation.id;

        expect(response.status).to.eq(201);
        expect(response.body.calculation.calculationNumber).to.be.equal(calculationId);
        expect(response.body.configuration.matNumber).to.be.equal(newMatNumber);
        expect(response.body.configuration.id).not.to.be.equal(testConfId);
        expect(response.body.calculationId).to.be.equal(newCalcId);
      });
    });

    it('should not be able to duplicate a configuration to a new calculation without calculationNumber', () => {
      const newMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          configurationId: testConfId,
          calculationFactor: 1.2,
          customerType: CustomerTypeEnum.serialCustomer,
          createdBy: 'TestUser',
          ...icalcTestSingleCableCalculation,
          newMatNumber,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration to a new calculation without configurationId', () => {
      const calculationId = `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`;
      const newMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          calculationId,
          calculationFactor: 1.2,
          customerType: CustomerTypeEnum.serialCustomer,
          createdBy: 'TestUser',
          ...icalcTestSingleCableCalculation,
          newMatNumber,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration to a new calculation without customerType', () => {
      const calculationId = `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`;
      const newMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          calculationId,
          calculationFactor: 1.2,
          configurationId: testConfId,
          createdBy: 'TestUser',
          ...icalcTestSingleCableCalculation,
          newMatNumber,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration to a new calculation without calculationFactor', () => {
      const calculationId = `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`;
      const newMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          calculationId,
          configurationId: testConfId,
          createdBy: 'TestUser',
          customerType: CustomerTypeEnum.serialCustomer,
          ...icalcTestSingleCableCalculation,
          newMatNumber,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration to a new calculation without createdBy', () => {
      const calculationId = `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`;
      const newMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          calculationId,
          configurationId: testConfId,
          calculationFactor: 1.2,
          customerType: CustomerTypeEnum.serialCustomer,
          ...icalcTestSingleCableCalculation,
          newMatNumber,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should not be able to duplicate a configuration to a new calculation without newMatNumber', () => {
      const calculationNumber = `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToNewCalculation)}`,
        body: {
          calculationNumber,
          configurationId: testConfId,
          ...icalcTestSingleCableCalculation,
          createdBy: 'TestUser',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  context('POST /calculation/assignConfigurationItemsToCopiedCalculation', () => {
    // TODO add failing case for invalid sCC id and configurationId
    it('for locked calculations it should still be possible to be copied with selected configurations', () => {
      const { singleCableCalculations } = testLockedCalc;
      const {
        batchSize,
        chainflexLength,
        id,
        snapshot: { isSnapshotOf },
      } = singleCableCalculations[0];

      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`,
        body: {
          calculationId: testCalcIdForLocking,
          newCalculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
          singleCableCalculationIds: [id],
          createdBy: 'TestUser',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.calculation.singleCableCalculations[0].configurationId).to.be.equal(isSnapshotOf);
        expect(response.body.calculation.singleCableCalculations[0].chainflexLength).to.be.equal(
          parseInt(chainflexLength.toString(), 10)
        );
        expect(response.body.calculation.singleCableCalculations[0].batchSize).to.be.equal(
          parseInt(batchSize.toString(), 10)
        );
      });
    });

    it('should be able to duplicate a calculation and assign selected configuration to newly created calculation', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.calculationFindById)}?id=${testCalcId}`,
      }).then((calcGetResponse) => {
        const { configurationId, batchSize, chainflexLength, id } = calcGetResponse.body.singleCableCalculations[0];

        expect(calcGetResponse.status).to.eq(200);
        cy.request({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`,
          body: {
            calculationId: testCalcId,
            newCalculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-${Date.now()}`,
            singleCableCalculationIds: [id],
            createdBy: 'TestUser',
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.calculation.singleCableCalculations[0].configurationId).to.be.equal(configurationId);
          expect(response.body.calculation.singleCableCalculations[0].chainflexLength).to.be.equal(chainflexLength);
          expect(response.body.calculation.singleCableCalculations[0].batchSize).to.be.equal(batchSize);
        });
      });
    });
  });

  context('GET /calculation/filter', () => {
    it('should be able to search and filter with the calculation-search and select a calculation', () => {
      const calculationFactor = 1.5;

      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.calculationFilter)}?calculationFactor=${calculationFactor}&customerType=${
          CustomerTypeEnum.serialCustomer
        }&calculationFactorOperand=>&orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`,
        body: {},
      }).then((response) => {
        const {
          calculationFactorOperand,
          calculationFactor: calculationFactorRes,
          customerType: customerTypeRes,
        } = response.body.listParameter;

        expect(response.status).to.eq(200);
        expect(response.body.data.filter((calc) => calc.calculationFactor < calculationFactorRes).length).to.equal(0);
        expect(
          response.body.data.filter((calc) => calc.customerType === CustomerTypeEnum.betriebsMittler).length
        ).to.equal(0);
        expect(calculationFactorOperand).to.be.equal('>');
        expect(customerTypeRes).to.be.equal(CustomerTypeEnum.serialCustomer);
        expect(response.body.listParameter.calculationFactor).to.be.equal(calculationFactor.toString());
        expect(response.body.listParameter.customerType).to.be.equal(CustomerTypeEnum.serialCustomer);
      });

      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.calculationFilter)}?calculationFactor=${calculationFactor}&customerType=${
          CustomerTypeEnum.betriebsMittler
        }&calculationFactorOperand=<&orderDirection=asc&search=&skip=0&take=100&orderBy=calculationNumber`,
        body: {},
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.filter((calc) => calc.calculationFactor > calculationFactor).length).to.equal(0);
        expect(
          response.body.data.filter((calc) => calc.customerType === CustomerTypeEnum.serialCustomer).length
        ).to.equal(0);
        expect(response.body.listParameter.calculationFactorOperand).to.be.equal('<');
        expect(response.body.listParameter.calculationFactor).to.be.equal(calculationFactor.toString());
        expect(response.body.listParameter.customerType).to.be.equal(CustomerTypeEnum.betriebsMittler);
      });
    });
  });

  context('GET /configuration/filter', () => {
    it('should be able to search and filter with the configuration-search and select a configuration', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.configurationFilter)}?labeling=left%20label`,
        body: {},
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(
          response.body.data.filter(
            (config) => config.labelingLeft !== 'left label' && config.labelingRight !== 'left label'
          ).length
        ).to.be.equal(0);
        expect(response.body.listParameter.labeling).to.be.equal('left label');
      });
    });
  });

  context('PATCH /calculation', () => {
    it('should be possible to update calculation, if unlocked', () => {
      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.calculation)}`,
        body: {
          calculationNumber: icalcTestCalculation.calculationNumber,
          calculationFactor: 2,
          mat017ItemAndWorkStepRiskFactor: 3,
          mat017ItemRiskFactor: 4,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('calculationFactor');
        expect(response.body).to.have.property('mat017ItemAndWorkStepRiskFactor');
        expect(response.body).to.have.property('mat017ItemRiskFactor');

        const { id, calculationFactor, mat017ItemAndWorkStepRiskFactor, mat017ItemRiskFactor } = response.body;

        expect(id).to.eq(testCalcId);

        expect(calculationFactor).to.eq(2);

        expect(mat017ItemAndWorkStepRiskFactor).to.eq(3);

        expect(mat017ItemRiskFactor).to.eq(4);
      });
    });

    it('should be impossibe to update calculation, if locked', () => {
      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.calculation)}`,
        body: {
          calculationNumber: icalcLockedTestCalculation.calculationNumber,
          calculationFactor: 2,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq(
          `Calculation with calculationNumber ${icalcLockedTestCalculation.calculationNumber} is locked and can not be updated.`
        );
      });
    });
  });

  context('PATCH /calculation/setExcelDownloadFlags', () => {
    context('set excel flags to lock calculation', () => {
      it('should update productionPlanExcelDownloaded flag if provided', () => {
        cy.request({
          method: 'GET',
          url: `${buildUrl(apiEndpoints.calculationFindById)}?id=${testCalcIdForLocking}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
        cy.request({
          method: 'PATCH',
          url: `${buildUrl(apiEndpoints.calculationSetExcelDownloadFlags)}`,
          body: {
            calculationNumber: icalcTestCalculationForLocking.calculationNumber,
            productionPlanExcelDownloaded: true,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('productionPlanExcelDownloaded');
          expect(response.body).to.have.property('isLocked');
          expect(response.body).to.have.property('lockingDate');
          expect(response.body).to.have.property('lockedBy');

          const { id, productionPlanExcelDownloaded, isLocked, lockingDate, lockedBy } = response.body;

          expect(id).to.eq(testCalcIdForLocking);
          expect(productionPlanExcelDownloaded).to.be.true;
          expect(isLocked).to.be.false;
          expect(lockingDate).to.be.null;
          expect(lockedBy).to.be.null;
        });
      });
      it('should update calculationExcelDownloaded flag if provided and lock if productionPlanExcelDownloaded is already set', () => {
        cy.request({
          method: 'PATCH',
          url: `${buildUrl(apiEndpoints.calculationSetExcelDownloadFlags)}`,
          body: {
            calculationNumber: icalcTestCalculationForLocking.calculationNumber,
            calculationExcelDownloaded: true,
          },
        }).then((response) => {
          const { id, calculationExcelDownloaded, isLocked, lockingDate, lockedBy } = response.body;

          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('calculationExcelDownloaded');
          expect(response.body).to.have.property('isLocked');
          expect(response.body).to.have.property('lockingDate');
          expect(response.body).to.have.property('lockedBy');
          expect(id).to.eq(testCalcIdForLocking);
          expect(calculationExcelDownloaded).to.be.true;
          expect(isLocked).to.be.true;
          expect(lockingDate).to.not.be.null;
          expect(lockedBy).to.equal(lockedByTestUser);
        });
      });
      it('should still include overrides after locking and snapshot should include work step prices', () => {
        cy.request({
          method: 'GET',
          url: `${buildUrl(apiEndpoints.singleCableCalculation)}?calculationId=${testCalcIdForLocking}`,
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(200);

          const responseBody = getResponse.body;
          const commercialWorkStepOverrides = responseBody.commercialWorkStepOverrides;
          const { projektierung } = commercialWorkStepOverrides;
          const { snapshot } = responseBody;
          const { configurationData } = snapshot;
          const { state } = configurationData;
          const workStepOverridesInSnapshot = state.workStepOverrides;
          const { consignment } = workStepOverridesInSnapshot;
          const { crimp } = workStepOverridesInSnapshot;
          const { sendTestReport } = workStepOverridesInSnapshot;

          expect(responseBody).to.have.property('commercialWorkStepOverrides');

          expect(commercialWorkStepOverrides).to.not.be.null;
          expect(commercialWorkStepOverrides).to.have.property('projektierung');
          expect(projektierung).to.not.be.null;
          expect(projektierung).to.equal(2);
          expect(responseBody).to.have.property('snapshot');

          expect(snapshot).to.not.be.null;
          expect(snapshot).to.have.property('configurationData');
          expect(snapshot).to.have.property('workStepPrices');
          expect(snapshot).to.have.property('configurationData');
          expect(configurationData).to.not.be.null;
          expect(configurationData).to.have.property('state');
          expect(state).to.have.property('workStepOverrides');
          expect(workStepOverridesInSnapshot).to.not.be.null;
          expect(workStepOverridesInSnapshot).to.have.property('consignment');
          expect(consignment).to.not.be.null;
          expect(consignment).to.equal(2);
          expect(workStepOverridesInSnapshot).to.have.property('crimp');
          expect(crimp).to.not.be.null;
          expect(crimp).to.equal(4);
          expect(workStepOverridesInSnapshot).to.have.property('sendTestReport');
          expect(sendTestReport).to.not.be.null;
          expect(sendTestReport).to.equal(1);
        });
      });
    });
    context('set excel flags in reversed order to lock calculation', () => {
      before(() => {
        cy.dbSeed('calculation-and-configuration --forLocking').then((dbSeedResponse: DbSeedResponse) => {
          const { data } = dbSeedResponse;

          testCalcIdForLocking = data.calculation[icalcTestCalculationForLocking.calculationNumber].id;
        });
      });

      it('should update calculationExcelDownloaded flag if provided', () => {
        cy.request({
          method: 'PATCH',
          url: `${buildUrl(apiEndpoints.calculationSetExcelDownloadFlags)}`,
          body: {
            calculationNumber: icalcTestCalculationForLocking.calculationNumber,
            calculationExcelDownloaded: true,
          },
        }).then((response) => {
          const { id, calculationExcelDownloaded, isLocked, lockingDate, lockedBy } = response.body;

          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('calculationExcelDownloaded');
          expect(response.body).to.have.property('isLocked');
          expect(response.body).to.have.property('lockingDate');
          expect(response.body).to.have.property('lockedBy');
          expect(id).to.eq(testCalcIdForLocking);
          expect(calculationExcelDownloaded).to.be.true;
          expect(isLocked).to.be.false;
          expect(lockingDate).to.be.null;
          expect(lockedBy).to.be.null;
        });
      });
      it('should update productionPlanExcelDownloaded flag if provided and lock if calculationExcelDownloaded is already set', () => {
        cy.request({
          method: 'PATCH',
          url: `${buildUrl(apiEndpoints.calculationSetExcelDownloadFlags)}`,
          body: {
            calculationNumber: icalcTestCalculationForLocking.calculationNumber,
            productionPlanExcelDownloaded: true,
          },
        }).then((response) => {
          const { id, productionPlanExcelDownloaded, isLocked, lockingDate, lockedBy } = response.body;

          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('productionPlanExcelDownloaded');
          expect(response.body).to.have.property('isLocked');
          expect(response.body).to.have.property('lockingDate');
          expect(response.body).to.have.property('lockedBy');
          expect(id).to.eq(testCalcIdForLocking);
          expect(productionPlanExcelDownloaded).to.be.true;
          expect(isLocked).to.be.true;
          expect(lockingDate).to.not.be.null;
          expect(lockedBy).to.equal(lockedByTestUser);
        });
      });
    });
  });

  context('GET /calculation/findById', () => {
    it('should have a config reference in scc and no snapshot reference, if unlocked', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.calculationFindById)}?id=${testCalcWithManyAssignmentsId}`,
      }).then((response) => {
        const { singleCableCalculations } = response.body;
        const { configuration, configurationId, snapshotId } = singleCableCalculations[0];
        const { configurationId: configurationIdTwo } = singleCableCalculations[1];

        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('singleCableCalculations');
        expect(singleCableCalculations[0]).to.have.property('configurationId');
        expect(singleCableCalculations[0]).to.have.property('snapshotId');
        expect(configuration).to.not.be.null;
        expect(configurationId).to.eq(testConfWithManyAssignmentsId);
        expect(configurationId).to.eq(configurationIdTwo);
        expect(snapshotId).to.be.null;
      });
    });

    it('should have a snapshot reference in scc and no config reference, if locked', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.calculationFindById)}?id=${testLockedCalcWithManyAssignmentsId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('singleCableCalculations');

        const { singleCableCalculations } = response.body;

        expect(singleCableCalculations[0]).to.have.property('snapshotId');
        expect(singleCableCalculations[0]).to.have.property('configurationId');

        const { snapshotId, configurationId } = singleCableCalculations[0];
        const { snapshotId: snapshotIdTwo } = singleCableCalculations[1];

        expect(snapshotId).to.not.be.null;
        expect(snapshotId).to.eq(snapshotIdTwo);
        expect(configurationId).to.be.null;
      });
    });

    it('should have a snapshot reference with identical data of the original configuration', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.singleCableCalculation)}?calculationId=${testLockedCalcId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const responseBody = response.body;

        const { snapshot } = responseBody;
        const { configurationData } = snapshot;
        const { chainFlexState, workStepSet, libraryState, pinAssignmentState, workStepOverrides, connectorState } =
          configurationData.state;
        const firstLeftConnectorMat017ItemOverrides =
          connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides;

        expect(responseBody).to.have.property('snapshot');
        expect(snapshot).to.not.be.null;
        expect(snapshot).to.have.property('configurationData');
        expect(configurationData).to.not.be.null;
        expect(chainFlexState).to.deep.equal(originalConfigurationData.state.chainFlexState);
        expect(workStepSet).to.deep.equal(originalConfigurationData.state.workStepSet);
        expect(libraryState).to.deep.equal(originalConfigurationData.state.libraryState);
        expect(pinAssignmentState).to.deep.equal(originalConfigurationData.state.pinAssignmentState);
        expect(workStepOverrides).to.deep.equal(originalConfigurationData.state.workStepOverrides);
        expect(firstLeftConnectorMat017ItemOverrides).to.have.property('itemStatus');
      });
    });
    it('should have a snapshot reference with untouched configuration data after manipulating original configuration', () => {
      cy.request<AssignConfigurationToExistingCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.assignConfigurationToExistingCalculation)}`,
        body: {
          calculationId: testCalcId,
          configurationId: testLockedConfId,
          createdBy: testUser.email,
          singleCableCalculationBaseData: {
            batchSize: 3,
            chainflexLength: 3,
          },
        },
      }).then((linkResponse) => {
        const scc = linkResponse.body;
        const saveSingleCableCalculationPayload = {
          id: scc.id,
          calculationFactor: scc.calculationFactor,
          batchSize: scc.batchSize,
          chainflexLength: scc.chainflexLength,
          configuration: {
            id: testLockedConfId,
            labelingLeft: 'new-labelingLeft-for-unchanged-snapshot-data-test',
          },
          assignedBy: 'test user',
          assignmentDate: new Date(),
          commercialWorkStepOverrides: {
            projektierung: 7,
          },
        };

        expect(linkResponse.status).to.eq(201);
        expect(scc).to.not.be.null;

        //manipulate original configuration
        cy.request<SaveSingleCableCalculationResponseDto>({
          method: 'POST',
          url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
          body: {
            ...saveSingleCableCalculationPayload,
            configuration: {
              id: testLockedConfId,
              labelingLeft: 'new-labelingLeft-for-unchanged-snapshot-data-test',
              state: {
                chainFlexState: {
                  chainflexCable: {} as ChainflexCable,
                },
              },
            },
          },
        }).then((manipulationResponse) => {
          const { singleCableCalculation: manipulatedSingleCableCalculation } = manipulationResponse.body;
          const { configuration } = manipulatedSingleCableCalculation;
          const { labelingLeft } = configuration;

          expect(manipulationResponse.status).to.eq(201);
          expect(manipulationResponse.body).to.have.property('singleCableCalculation');
          expect(manipulatedSingleCableCalculation).to.not.be.null;
          expect(manipulatedSingleCableCalculation).to.have.property('configuration');
          expect(configuration).to.not.be.null;
          expect(configuration).to.have.property('labelingLeft');
          expect(labelingLeft).to.eq('new-labelingLeft-for-unchanged-snapshot-data-test');

          cy.request({
            method: 'GET',
            url: `${buildUrl(apiEndpoints.singleCableCalculation)}?calculationId=${testLockedCalcId}`,
          }).then((response) => {
            const responseBody = response.body;

            const { snapshot } = responseBody;
            const { configurationData } = snapshot;
            const { chainFlexState, workStepSet, libraryState, pinAssignmentState, workStepOverrides, connectorState } =
              configurationData.state;
            const firstLeftConnectorMat017ItemOverrides =
              connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides;

            expect(response.status).to.eq(200);
            expect(responseBody).to.have.property('snapshot');
            expect(snapshot).to.not.be.null;
            expect(snapshot).to.have.property('configurationData');
            expect(responseBody).to.have.property('snapshot');
            expect(snapshot).to.not.be.null;
            expect(snapshot).to.have.property('configurationData');
            expect(configurationData).to.not.be.null;
            expect(chainFlexState).to.deep.equal(originalConfigurationData.state.chainFlexState);
            expect(workStepSet).to.deep.equal(originalConfigurationData.state.workStepSet);
            expect(libraryState).to.deep.equal(originalConfigurationData.state.libraryState);
            expect(pinAssignmentState).to.deep.equal(originalConfigurationData.state.pinAssignmentState);
            expect(workStepOverrides).to.deep.equal(originalConfigurationData.state.workStepOverrides);
            expect(firstLeftConnectorMat017ItemOverrides).to.have.property('itemStatus');
          });
        });
      });
    });
  });

  context('POST /calculation/assignConfigurationToExistingCalculation', () => {
    it('should not be possible to assign additional configuration to locked calculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.assignConfigurationToExistingCalculation)}`,
        body: {
          calculationId: testLockedCalcId,
          configurationId: testConfId,
          createdBy: testUser.email,
          singleCableCalculationBaseData: {
            batchSize: 2,
            chainflexLength: 2,
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq(
          `Calculation with id ${testLockedCalcId} is locked and no existing configurations can be assigned to it.`
        );
      });
    });
  });

  context('POST /calculation/copyConfigurationToExistingCalculation', () => {
    it('should not be possible to duplicate a configuration within a locked calculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.copyConfigurationToExistingCalculation)}`,
        body: {
          configurationId: testConfId,
          newMatNumber: 'e2e-newMatNumber-for-duplicateConfigurationInsideExistingCalculation-test',
          createdBy: testUser.email,
          calculationId: testLockedCalcId,
          batchSize: 3,
          chainflexLength: 3,
          updatePrices: false,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq(
          `Calculation with id ${testLockedCalcId} is locked and no new configurations can be assigned to it.`
        );
      });
    });
  });

  context('POST /calculation/createNewConfigurationForExistingCalculation', () => {
    it('should not be possible to create new configuration for locked calculation', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.createNewConfigurationForExistingCalculation)}`,
        body: {
          calculationId: testLockedCalcId,
          createdBy: testUser.email,
          configuration: {
            matNumber: 'e2e-newMatNumber-for-createNewConfigurationForExistingCalculation-test',
            state: {} as ConfigurationState,
            createdBy: testUser.email,
          },
          singleCableCalculation: {
            batchSize: 2,
            chainflexLength: 2,
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq(
          `Calculation with id ${testLockedCalcId} is locked and no new configurations can be assigned to it.`
        );
      });
    });
  });

  context('POST /calculation/assignConfigurationItemsToCopiedCalculation', () => {
    it('should be possible to copy calculation, if locked', () => {
      cy.request({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.assignConfigurationItemsToCopiedCalculation)}`,
        body: {
          singleCableCalculationIds: lockedCalcSCCIds,
          newCalculationNumber: 'e2e-newCalculationNumber-for-assignConfigurationItemsToCopiedCalculation-test',
          createdBy: testUser.email,
          calculationId: testLockedCalcId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        const calc = response.body.calculation;

        expect(calc).to.have.property('isLocked');
        expect(calc).to.have.property('calculationExcelDownloaded');
        expect(calc).to.have.property('productionPlanExcelDownloaded');
        expect(calc).to.have.property('calculationFactor');
        expect(calc).to.have.property('customerType');

        const { isLocked } = calc;
        const { calculationExcelDownloaded } = calc;
        const { productionPlanExcelDownloaded } = calc;
        const { calculationFactor } = calc;
        const { customerType: customerTypeRes } = calc;

        expect(isLocked).to.be.false;
        expect(calculationExcelDownloaded).to.be.false;

        expect(productionPlanExcelDownloaded).to.be.false;
        expect(calculationFactor).to.eq(icalcLockedTestCalculation.calculationFactor);

        expect(customerTypeRes).to.eq(icalcLockedTestCalculation.customerType);
      });
    });
  });

  context('PATCH /calculation/removeMat017Items', () => {
    it('should not be able to remove mat017Items from not existent calculation', () => {
      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.removeMat017Items)}`,
        body: {
          calculationId: icalcTestNonExistingUUID,
          configurations: [
            {
              configurationId: testLockedConfId,
              mat017Items: [],
            },
          ],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(409);
        expect(response.body.message).to.eq(createCalculationDoesNotExistErrorMessage(icalcTestNonExistingUUID));
      });
    });

    it('should not be able to remove mat017Items from locked calculation', () => {
      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.removeMat017Items)}`,
        body: {
          calculationId: testLockedCalcId,
          configurations: [
            {
              configurationId: testLockedConfId,
              mat017Items: [],
            },
          ],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq(createLockedCalculationCannotBeModifiedErrorMessage(testLockedCalcId));
      });
    });

    context('not approved configuration', () => {
      it('should be able to remove mat017Item from configuration', () => {
        const firstMat017ItemNumberToRemove =
          icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber;
        const secondMat017ItemNumberToRemove =
          icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[1].matNumber;

        cy.request({
          method: 'PATCH',
          url: `${buildUrl(apiEndpoints.removeMat017Items)}`,
          body: {
            calculationId: testCalcId,
            configurations: [
              {
                configurationId: testConfId,
                mat017Items: [firstMat017ItemNumberToRemove],
              },
            ],
          },
        }).then((response) => {
          expect(response.status).to.eq(200);

          expect(response.body[0].connectorState.leftConnector.addedMat017Items[firstMat017ItemNumberToRemove]).to.be
            .undefined;
          expect(response.body[0].connectorState.leftConnector.mat017ItemListWithWidenData).to.have.length(1);
          expect(response.body[0].connectorState.leftConnector.addedMat017Items[secondMat017ItemNumberToRemove]).to
            .exist;

          expect(response.body[0].hasRemovedOverrides).to.be.true;
          expect(response.body[0].removedOverrides).to.include(WorkStepName.consignment);
          expect(response.body[0].calculationConfigurationStatus.hasApprovalBeenRevoked).to.be.false;
        });
      });
    });
    context('approved configuration', () => {
      before(() => {
        cy.dbSeed('calculation-and-configuration --approved').then((dbSeedResponse: DbSeedResponse) => {
          const { data } = dbSeedResponse;

          testCalcId = data.calculation[icalcTestCalculation.calculationNumber].id;
          testConfId = data.configuration[icalcTestConfiguration.matNumber].id;
        });
      });

      it('should revoke approval after removing mat017Item', () => {
        const firstMat017ItemNumberToRemove =
          icalcTestConfiguration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber;

        cy.request({
          method: 'PATCH',
          url: `${buildUrl(apiEndpoints.removeMat017Items)}`,
          body: {
            calculationId: testCalcId,
            configurations: [
              {
                configurationId: testConfId,
                mat017Items: [firstMat017ItemNumberToRemove],
              },
            ],
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body[0].calculationConfigurationStatus.hasApprovalBeenRevoked).to.be.true;
        });
      });
    });
  });

  context('PATCH /calculation/updateMat017ItemsOverrides', () => {
    it('should not be able to update configuration info of non existing calculation', () => {
      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.updateMat017ItemsOverrides)}`,
        body: {
          calculationId: icalcTestNonExistingUUID,
          configurationIds: [testConfId],
          updateProperties: [Mat017ItemOverridesEnum.amountDividedByPriceUnit],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(409);
        expect(response.body.message).to.eq(
          `Calculation with calculation number ${icalcTestNonExistingUUID} does not exist.`
        );
      });
    });

    it('should not be able to update configuration info of locked calculation', () => {
      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.updateMat017ItemsOverrides)}`,
        body: {
          calculationId: testLockedCalcWithManyAssignmentsId,
          configurationIds: [testLockedConfWithManyAssignmentsId],
          updateProperties: [Mat017ItemOverridesEnum.amountDividedByPriceUnit],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq(
          `Calculation with id ${testLockedCalcWithManyAssignmentsId} is locked and cannot be modified.`
        );
      });
    });

    it('should be able to update given MAT017 overrides properties to current values', () => {
      let originalOverrideValueForMat017ItemPrice: number;
      let currentPrice: number;

      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.singleCableCalculation)}?configurationId=${testConfWithUpdatedMat017ItemPriceId}`,
      }).then((response) => {
        const mat017ItemInState =
          response.body.configuration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0];

        originalOverrideValueForMat017ItemPrice = mat017ItemInState.overrides.amountDividedByPriceUnit;
        currentPrice = mat017ItemInState.amountDividedByPriceUnit;

        expect(originalOverrideValueForMat017ItemPrice).to.not.equal(currentPrice);
      });

      cy.request({
        method: 'PATCH',
        url: `${buildUrl(apiEndpoints.updateMat017ItemsOverrides)}`,
        body: {
          calculationId: testCalcWithUpdatedMat017ItemPriceId,
          configurationIds: [testConfWithUpdatedMat017ItemPriceId],
          updateProperties: [Mat017ItemOverridesEnum.amountDividedByPriceUnit],
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        const overrides = response.body[0].connectorState.leftConnector.mat017ItemListWithWidenData[0].overrides;

        expect(overrides.amountDividedByPriceUnit).to.equal(currentPrice);
      });
    });
  });
});
