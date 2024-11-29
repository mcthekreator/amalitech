import { externalUrls } from '../../../support/utils';
import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { testUser } from '../../../support/auth.po';

Before(() => {
  cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, {
    statusCode: 500,
  }).as('piwikTemplates');

  cy.intercept({
    url: '/api/auth/*',
  }).as('authRequests');
});

Given('an unauthenticated user', () => {});

Given('the user is on login page', () => {
  cy.visit('/auth/login');
});

When('the user opens iCalc', () => {
  cy.visit('/meta-data');
});

When('the user enters valid credentials', () => {
  cy.getByCy('email-input').type(testUser.email);
  cy.getByCy('password-input').type(testUser.password);
  cy.getByCy('submit').click();
});

When(/^the user enters invalid credentials$/, () => {
  cy.getByCy('email-input').type(testUser.email);
  cy.getByCy('password-input').type('wrong');
  cy.getByCy('submit').click();
});

Then('iCalc should open the login page', () => {
  cy.wait('@authRequests').its('response.statusCode').should('eq', 401);
  cy.location('pathname').should('contain', '/auth/login');
  cy.wait('@piwikTemplates').its('request.method').should('equal', 'GET');
  cy.getByCy('logo').should('be.visible');
  cy.getByCy('login-headline').should('contain', 'Login');
  cy.getByCy('login-form').should('be.visible');
  cy.getByCy('submit').should('be.disabled');
  cy.getByCy('auth-error').should('not.exist');
});

Then(/^iCalc should navigate to meta data page$/, () => {
  cy.location('pathname').should('contain', '/app/meta-data');
});

Then(/^iCalc should show an error message$/, () => {
  cy.getByCy('auth-error').should('exist');
});
