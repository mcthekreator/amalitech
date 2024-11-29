import { loadingText, testUser } from '../../../support/auth.po';
import { externalUrls } from '../../../support/utils';

describe('auth', () => {
  before(() => {
    cy.dbSeed('user');
  });

  beforeEach(() => {
    // avoid displaying piwik gdpr window
    cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, {
      statusCode: 500,
    }).as('piwikTemplates');

    cy.intercept({
      url: '/api/auth/*',
    }).as('authRequests');
  });

  it('should have piwik scripts included', () => {
    cy.visit('/auth/login');
    cy.wait('@piwikTemplates').its('request.method').should('equal', 'GET');
  });

  it('should check if user is authorized and redirect to login page', () => {
    cy.visit('/');
    cy.wait('@authRequests').its('response.statusCode').should('eq', 401);
    cy.location('pathname').should('contain', '/auth/login');
  });

  it('should be on the login page if not authorized', () => {
    cy.visit('/');
    cy.location('pathname').should('contain', '/auth/login');

    cy.contains(loadingText).should('not.be.visible');
    cy.getByCy('logo').should('be.visible');
    cy.getByCy('login-headline').should('be.visible');
    cy.getByCy('login-headline').should('contain', 'Login');
  });

  it('should see login form if not authorized', () => {
    cy.visit('/auth/login');
    cy.location('pathname').should('contain', '/auth/login');

    cy.contains(loadingText).should('not.be.visible');
    cy.getByCy('login-form').should('be.visible');
    cy.getByCy('submit').should('be.visible');
    cy.getByCy('email-input').should('be.visible');
    cy.getByCy('password-input').should('be.visible');
    cy.getByCy('submit').should('be.disabled');
  });

  it('should be able to login', () => {
    cy.visit('/auth/login');
    cy.location('pathname').should('contain', '/auth/login');

    cy.contains(loadingText).should('not.be.visible');
    cy.getByCy('auth-error').should('not.exist');
    cy.getByCy('email-input').type(testUser.email);
    cy.getByCy('password-input').type('wrong');
    cy.getByCy('submit').should('be.enabled');
    cy.getByCy('submit').click();

    cy.getByCy('auth-error').should('exist');
    cy.getByCy('password-input').clear();
    cy.getByCy('password-input').type(testUser.password);

    cy.getByCy('submit').should('be.enabled');
    cy.getByCy('submit').click();

    cy.location('pathname').should('contain', '/app/meta-data');
  });
});
