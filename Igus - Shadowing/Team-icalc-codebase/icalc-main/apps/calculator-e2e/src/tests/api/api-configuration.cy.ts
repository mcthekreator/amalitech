import type { Configuration, DbSeedResponse, FilterConfigurationResponseDto } from '@igus/icalc-domain';
import {
  ICALC_DYNAMIC_CALC_NUMBER_PREFIX,
  ICALC_DYNAMIC_MAT_NUMBER_PREFIX,
  icalcTestCalculation,
  icalcTestConfiguration,
} from '@igus/icalc-domain';
import { testUser } from '../../support/auth.po';
import { apiEndpoints, buildUrl } from '../../support/utils';

let testCalcId: string;

describe('configuration API', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('user');
    cy.dbSeed('calculation-and-configuration').then((dbSeedResponse: DbSeedResponse) => {
      const { data } = dbSeedResponse;

      testCalcId = data.calculation[icalcTestCalculation.calculationNumber].id;
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

  context('GET /configuration/findByMatNumber', () => {
    it('should be able to find existing configuration by matNumber', () => {
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.configurationFindByMatNumber)}?matNumber=${icalcTestConfiguration.matNumber}`,
      }).then((response: Cypress.Response<Configuration>) => {
        const { status, body } = response;

        expect(status).to.eq(200);
        expect(body).to.have.property('isCopyOfConfigurationId');
        expect(body).to.have.property('matNumber');
        expect(body.matNumber).to.equal(icalcTestConfiguration.matNumber);
        expect(body).to.have.property('labelingLeft');
        expect(body.labelingLeft).to.equal(icalcTestConfiguration.labelingLeft);
        expect(body).to.have.property('labelingRight');
        expect(body.labelingRight).to.equal(icalcTestConfiguration.labelingRight);
        expect(body).to.have.property('creationDate');
        expect(body.creationDate).to.match(dateFormatRegex);
        expect(body).to.have.property('modificationDate');
        expect(body.modificationDate).to.match(dateFormatRegex);
        expect(body).to.have.property('createdBy');
        expect(body).to.have.property('modifiedBy');
        expect(body).to.have.property('partNumber');
        expect(body.partNumber).to.equal(icalcTestConfiguration.partNumber);
      });
    });

    it('should not be able to find non-existing configuration by matNumber', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(
          apiEndpoints.configurationFindByMatNumber
        )}?matNumber=${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}UnlikelyMatNumberSoItShouldNotExist`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq('');
      });
    });
  });

  context('GET /configuration/filter', () => {
    it('it should be able to use default sorting order in configuration search', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(
          apiEndpoints.configurationFilter
        )}?orderDirection=asc&search=&skip=0&take=100&orderBy=matNumber`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.listParameter.orderBy).to.be.equal('matNumber');
        expect(response.body.listParameter.orderDirection).to.be.equal('asc');
        expect(response.body.listParameter.search).to.be.equal('');
        expect(response.body.listParameter.skip).to.be.equal('0');
        expect(response.body.listParameter.take).to.be.equal('100');
      });
    });

    it('it should be able to filter in configuration search', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(apiEndpoints.configurationFilter)}?labeling=left&search=${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.listParameter.labeling).to.eq('left');
        expect(response.body.data.length).to.be.at.least(1);
        expect(
          response.body.data.filter(
            (configuration) =>
              !configuration.labelingLeft.includes('left') && !configuration.labelingRight.includes('left')
          ).length
        ).to.eq(0);
      });
    });

    it('it should be able to search for matNumber in configuration search', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(
          apiEndpoints.configurationFilter
        )}?orderDirection=asc&search=${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}&skip=0&take=100&orderBy=matNumber`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.be.at.least(1);
        expect(response.body.data[0].matNumber).to.eq(icalcTestConfiguration.matNumber);
        expect(
          response.body.data.filter(
            (configuration) => !configuration.matNumber.includes(ICALC_DYNAMIC_MAT_NUMBER_PREFIX)
          ).length
        ).to.eq(0);
      });
    });

    it('it should be able to search for calculationNumber in configuration search', () => {
      cy.request<FilterConfigurationResponseDto>({
        method: 'GET',
        url: `${buildUrl(
          apiEndpoints.configurationFilter
        )}?orderDirection=asc&search=${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}&skip=0&take=100&orderBy=matNumber`,
      }).then((response) => {
        const configurationSearchResultsLengthWithCalNumber = response.body.data.filter((configuration) =>
          configuration.calculationNumbers.includes(testCalcId)
        );

        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.be.at.least(1);
        expect(configurationSearchResultsLengthWithCalNumber.length).to.eq(0);
      });
    });

    it('should return no result when searching for non-existing matNumber', () => {
      cy.request({
        method: 'GET',
        url: `${buildUrl(
          apiEndpoints.configurationFilter
        )}?orderDirection=asc&search=${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}UnlikelyMatNumberSoItShouldNotExist&skip=0&take=100&orderBy=matNumber`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.eq(0);
      });
    });
  });
});
