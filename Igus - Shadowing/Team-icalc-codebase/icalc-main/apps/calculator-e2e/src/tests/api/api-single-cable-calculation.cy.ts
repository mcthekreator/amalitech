/* eslint-disable @typescript-eslint/no-unused-expressions */
import type {
  ChainflexCable,
  Configuration,
  ConfigurationChainFlexState,
  ConfigurationPinAssignmentState,
  DbSeedResponse,
  SaveSingleCableCalculationRequestData,
  SaveSingleCableCalculationResponseDto,
  SaveSnapshotRequestData,
} from '@igus/icalc-domain';
import {
  ObjectUtils,
  createTestUserFullName,
  icalcLockedTestCalculation,
  icalcLockedTestConfiguration,
  icalcTestCalculation,
  icalcTestConfiguration,
  icalcTestSaveSingleCableCalculationBodyWithSnapshot,
} from '@igus/icalc-domain';
import { testUser } from '../../support/auth.po';
import { apiEndpoints, buildUrl } from '../../support/utils';
import type { HttpErrorResponse } from '@angular/common/http';

let testCalcId: string;
let testConfId: string;
let testSCCData;
let testConfig: Partial<Configuration>;
let testLockedCalcId: string;
let testLockedConfId: string;
let testLockedSCCData;

describe('single-cable-calculation API', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcId = data.calculation[icalcTestCalculation.calculationNumber].id;

      testConfig = data.configuration[icalcTestConfiguration.matNumber];
      testConfId = testConfig.id;
      testSCCData = data.calculation[icalcTestCalculation.calculationNumber].singleCableCalculations.find(
        (scc) => scc.configurationId === testConfId && scc.calculationId === testCalcId
      );
    });
    cy.dbSeed('calculation-and-configuration --locked').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testLockedCalcId = data.calculation[icalcLockedTestCalculation.calculationNumber].id;
      testLockedConfId = data.configuration[icalcLockedTestConfiguration.matNumber].id;
      testLockedSCCData = data.calculation[icalcLockedTestCalculation.calculationNumber].singleCableCalculations.find(
        (scc) => scc.calculationId === testLockedCalcId
      );
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

  context('POST /single-cable-calculation/saveSingleCableCalculation', () => {
    it('should throw error if no scc data is provided', () => {
      cy.request<SaveSingleCableCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: {
          singleCableCalculation: {},
          configuration: {
            id: testConfId,
            labelingLeft: 'new-labelingLeft-for-saveSingleCableCalculation-test',
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should work as intended for unlocked calculations', () => {
      const { id, batchSize, chainflexLength, calculationFactor } = testSCCData;

      const saveSingleCableCalculationPayload: SaveSingleCableCalculationRequestData = {
        id,
        batchSize,
        calculationFactor,
        chainflexLength,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
        configuration: {
          id: testConfId,
          labelingLeft: 'new-labelingLeft-for-saveSingleCableCalculation-test',
          state: {
            chainFlexState: {
              chainflexCable: {} as ChainflexCable,
            },
          },
        },
      };

      cy.request<SaveSingleCableCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('singleCableCalculation');

        const { singleCableCalculation } = response.body;

        expect(singleCableCalculation).to.not.be.null;
        expect(singleCableCalculation).to.have.property('configuration');

        const { configuration } = singleCableCalculation;

        expect(configuration).to.not.be.null;
        expect(configuration).to.have.property('labelingLeft');

        const { labelingLeft } = configuration;

        expect(labelingLeft).to.not.be.null;
        expect(labelingLeft).to.eq('new-labelingLeft-for-saveSingleCableCalculation-test');
      });
    });

    it('should be able to only update base64String in PinAssignmentState, leaving other configuration data untouched', () => {
      const newDummyBase64String = 'new-base64';

      const { id, batchSize, chainflexLength, calculationFactor } = testSCCData;

      const saveSingleCableCalculationPayload: SaveSingleCableCalculationRequestData = {
        id,
        batchSize,
        chainflexLength,
        calculationFactor,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
        configuration: {
          id: testConfig.id,
          state: {
            pinAssignmentState: {
              base64Image: newDummyBase64String,
            } as ConfigurationPinAssignmentState,
          },
        },
      };

      cy.request<SaveSingleCableCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('singleCableCalculation');

        const { singleCableCalculation } = response.body;

        expect(singleCableCalculation).to.not.be.null;
        expect(singleCableCalculation).to.have.property('configuration');

        const { configuration } = singleCableCalculation;
        const {
          state: {
            pinAssignmentState: { base64Image },
          },
        } = configuration;

        expect(base64Image).to.not.be.null;
        expect(base64Image).to.eq(newDummyBase64String);
      });
    });

    it('should throw error if no configuration data is provided, for unlocked calculations', () => {
      const { id, batchSize, chainflexLength, calculationFactor } = testSCCData;

      const saveSingleCableCalculationPayload: SaveSingleCableCalculationRequestData = {
        ...icalcTestSaveSingleCableCalculationBodyWithSnapshot,
        id,
        batchSize,
        chainflexLength,
        calculationFactor,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
      };

      saveSingleCableCalculationPayload.snapshot.id = testLockedSCCData.snapshotId;
      saveSingleCableCalculationPayload.snapshot.libraryState.leftChainFlex.text =
        'e2e-saveSingleCableCalculation-test';

      cy.request<HttpErrorResponse>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq('must provide a configuration to save, since calculation is unlocked');
      });
    });

    it('should not be possible to save singleCableCalculation of locked calculation without providing snapshot', () => {
      const saveSingleCableCalculationPayload = {
        configuration: {
          id: testLockedConfId,
          labelingLeft: 'new-labelingLeft-for-saveSingleCableCalculation-test',
        },
        id: testLockedSCCData.id,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
      };

      cy.request<HttpErrorResponse>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(406);
        expect(response.body.message).to.eq('must provide a snapshot to save, since calculation is locked');
      });
    });

    it('should not be possible to update any snapshot data besides library state for locked calculations', () => {
      const { id, batchSize, calculationFactor, chainflexLength } = testLockedSCCData;
      const saveSingleCableCalculationPayload: SaveSingleCableCalculationRequestData = {
        id,
        batchSize,
        calculationFactor,
        chainflexLength,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
        snapshot: {
          id: testLockedSCCData.snapshotId,
          chainflexState: testLockedSCCData.snapshot.configurationData.state.chainflexState,
        } as unknown as SaveSnapshotRequestData, // forced use of different property than expected in request
      };

      cy.request<HttpErrorResponse>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.message).to.eq(`Could not save Snapshot with id ${testLockedSCCData.snapshotId}`);
      });
    });

    it('should not be possible to update library state with empty object in snapshot for locked calculations', () => {
      cy.request<HttpErrorResponse>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: {
          id: testLockedSCCData.id,
          snapshot: {
            id: testLockedSCCData.snapshotId,
            libraryState: {},
            connectorState: {},
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Bad Request');
        expect(response.body.message[0]).to.eq('snapshot.libraryState.imageList should not be empty');
      });
    });

    it('should be possible to update library state in snapshot for locked calculations', () => {
      const { id, batchSize, chainflexLength, calculationFactor } = testLockedSCCData;
      const saveSingleCableCalculationPayload: SaveSingleCableCalculationRequestData = {
        ...icalcTestSaveSingleCableCalculationBodyWithSnapshot,
        id,
        batchSize,
        chainflexLength,
        calculationFactor,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
      };

      saveSingleCableCalculationPayload.snapshot.id = testLockedSCCData.snapshotId;
      saveSingleCableCalculationPayload.snapshot.libraryState.leftChainFlex.text =
        'e2e-saveSingleCableCalculation-test';
      saveSingleCableCalculationPayload.snapshot.connectorState.leftConnector.mat017ItemListWithWidenData[0].photoVersionId =
        'newVersionId';

      cy.request<SaveSingleCableCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('singleCableCalculation');

        const { singleCableCalculation } = response.body;

        expect(singleCableCalculation).to.not.be.null;
        expect(singleCableCalculation).to.have.property('snapshot');

        const { snapshot } = singleCableCalculation;

        expect(snapshot).to.not.be.null;
        expect(snapshot).to.have.property('configurationData');

        const { configurationData } = snapshot;

        expect(configurationData).to.not.be.null;
        expect(configurationData).to.have.property('state');

        const { state } = configurationData;

        expect(state).to.not.be.null;
        expect(state).to.have.property('libraryState');
        expect(state).to.have.property('connectorState');

        const { libraryState, connectorState } = state;

        expect(libraryState).to.not.be.null;
        expect(libraryState).to.have.property('leftChainFlex');

        const { leftChainFlex } = libraryState;

        expect(leftChainFlex).to.not.be.null;
        expect(leftChainFlex).to.have.property('text');

        const { text } = leftChainFlex;

        expect(text).to.not.be.null;
        expect(text).to.eq('e2e-saveSingleCableCalculation-test');

        expect(connectorState).to.not.be.null;
        expect(connectorState).to.have.property('leftConnector');

        const { leftConnector } = connectorState;

        expect(leftConnector).to.not.be.null;
        expect(leftConnector).to.have.property('mat017ItemListWithWidenData');

        const { mat017ItemListWithWidenData } = leftConnector;

        expect(mat017ItemListWithWidenData).to.not.be.empty;
        expect(mat017ItemListWithWidenData[0]).to.have.property('photoVersionId');

        const { photoVersionId } = mat017ItemListWithWidenData[0];

        expect(photoVersionId).to.not.be.null;
        expect(photoVersionId).to.eq('newVersionId');
      });
    });

    it('should secure that updating the configuration state with a new state return only the new state in response', () => {
      const { id, batchSize, chainflexLength, calculationFactor } = testSCCData;
      const newChainFlexState = {
        chainflexCable: {
          ...testConfig.state.chainFlexState.chainflexCable,
          partNumber: 'CF10.01.08',
          numberOfCores: '8',
        } as ChainflexCable,
      } as ConfigurationChainFlexState;

      const saveSingleCableCalculationPayload: SaveSingleCableCalculationRequestData = {
        id,
        batchSize,
        calculationFactor,
        chainflexLength,
        assignedBy: createTestUserFullName(),
        assignmentDate: new Date(),
        commercialWorkStepOverrides: {},
        configuration: {
          id: testConfId,
          state: {
            chainFlexState: newChainFlexState as ConfigurationChainFlexState,
            pinAssignmentState: null,
          },
        },
      };

      cy.request<SaveSingleCableCalculationResponseDto>({
        method: 'POST',
        url: `${buildUrl(apiEndpoints.saveSingleCableCalculation)}`,
        body: saveSingleCableCalculationPayload,
      }).then((response) => {
        const { configuration } = response.body.singleCableCalculation;
        const { state } = configuration;
        const isNewChainFlexState = ObjectUtils.isEqualJSONRepresentation(state.chainFlexState, newChainFlexState);

        expect(response.status).to.eq(201);
        expect(state).to.not.be.null;
        expect(isNewChainFlexState).equal(true);
        expect(state).not.to.have.property('workStepSet');
        expect(state.pinAssignmentState).to.be.null;
      });
    });
  });

  context('POST /single-cable-calculation/configuration/status/approve', () => {});

  context('GET /single-cable-calculation/configuration/status/findCalculationConfigurationStatusByIds', () => {});
});
