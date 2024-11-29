// @ts-check
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../../global.d.ts" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { Steps, interpolateStringParameters, selectors, staticStrings } from './utils';

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});

Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[dataCy=${selector}]`, ...args);
});

Cypress.Commands.add('getStringByLang', (key, lang) => {
  const langKey = lang.indexOf('de') > -1 ? 'de' : 'en';

  return staticStrings[key][langKey];
});

Cypress.Commands.add('shouldContainTranslated', { prevSubject: true }, (subject, key, interpolationParams) => {
  return cy
    .window()
    .its('navigator.language')
    .then((lang) => {
      return cy.getStringByLang(key, lang).then((str) => {
        str = interpolationParams ? interpolateStringParameters(str, interpolationParams) : str;
        cy.wrap(subject).should('be.visible').should('contain', str);
      });
    });
});

Cypress.Commands.add('shouldHaveTextTranslated', { prevSubject: true }, (subject, key, interpolationParams) => {
  return cy
    .window()
    .its('navigator.language')
    .then((lang) => {
      return cy.getStringByLang(key, lang).then((str) => {
        str = interpolationParams ? interpolateStringParameters(str, interpolationParams) : str;
        cy.wrap(subject).should('be.visible').should('have.text', str);
      });
    });
});

Cypress.Commands.add('containsTranslated', { prevSubject: true }, (subject, key, interpolationParams) => {
  return cy
    .window()
    .its('navigator.language')
    .then((lang) => {
      return cy.getStringByLang(key, lang).then((str) => {
        str = interpolationParams ? interpolateStringParameters(str, interpolationParams) : str;
        return cy.wrap(subject).contains(str);
      });
    });
});

Cypress.Commands.add('filterByTranslatedString', { prevSubject: true }, (subject, key, interpolationParams) => {
  return cy
    .window()
    .its('navigator.language')
    .then((lang) => {
      return cy.getStringByLang(key, lang).then((str) => {
        str = interpolationParams ? interpolateStringParameters(str, interpolationParams) : str;
        return cy.wrap(subject).filter(`:contains("${str}")`);
      });
    });
});

Cypress.Commands.add('findByExactString', { prevSubject: true }, (subject, searchedText: string) => {
  return cy
    .wrap(subject)
    .contains(searchedText)
    .filter((index, element) => {
      return Cypress.$(element).text().trim() === searchedText;
    });
});

Cypress.Commands.add('loginByApi', (email, password, failOnStatusCode = true) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/signin`,
    failOnStatusCode,
    body: {
      email,
      password,
    },
  });
});

Cypress.Commands.add('logoutByApi', (failOnStatusCode = true) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/logout`,
    failOnStatusCode,
  });
});

Cypress.Commands.add('dbSeed', (seedType) => {
  cy.exec(`yarn db:seed ${seedType}`, { timeout: 120000 }).then((value) => {
    if (value.stdout) {
      try {
        return cy.wrap(JSON.parse(value.stdout));
      } catch (e) {
        cy.task('log', '\nvalue.stdout:\n' + value.stdout);
        cy.task('log', '\nError(Message):\n' + e.message || e.toString());
        cy.screenshot(JSON.stringify('catch error from db:seed command: ' + e, null, 4), {
          capture: 'runner',
        });
        return cy.wrap({
          status: 'error',
          message: 'could not parse response',
          error: e,
        });
      }
    }
    cy.task('log', '\nstdError:\n' + value.stderr);
    cy.screenshot(JSON.stringify('unexpected error from db:seed command: ' + value.stderr, null, 4), {
      capture: 'runner',
    });

    return cy.wrap({
      status: 'error',
      message: 'unexpected error from db:seed command',
      error: value.stderr,
    });
  });
});

Cypress.Commands.add('deleteMat017TestItemWidenImages', () => {
  cy.exec(`yarn delete-mat017-test-item-widen-images`, { timeout: 120000 }).then((value) => {
    if (value.stdout) {
      try {
        return cy.wrap(JSON.parse(value.stdout));
      } catch (e) {
        cy.task('log', '\nvalue.stdout:\n' + value.stdout);
        cy.task('log', '\nError(Message):\n' + e.message || e.toString());
        cy.screenshot(JSON.stringify('catch error from deleteMat017TestItemWidenImages command: ' + e, null, 4), {
          capture: 'runner',
        });
        return cy.wrap({
          status: 'error',
          message: 'could not parse response',
          error: e,
        });
      }
    }
    cy.task('log', '\nstdError:\n' + value.stderr);
    cy.screenshot(JSON.stringify('unexpected error from deleteWidenImage command: ' + value.stderr, null, 4), {
      capture: 'runner',
    });

    return cy.wrap({
      status: 'error',
      message: 'unexpected error from deleteWidenImage command',
      error: value.stderr,
    });
  });
});

Cypress.Commands.add('clickThroughToStep', (selectCalculationNumber, step) => {
  cy.visit('/app/meta-data');
  // click through meta-data component to reach chainflex step
  cy.getByCy('meta-data-tab-group').find(selectors.tab).eq(1).click();
  cy.getByCy('calc-tab-search-field').type(selectCalculationNumber);
  cy.contains(selectCalculationNumber).click();
  cy.getByCy('edit-calculation').click();
  if (step === Steps.metaData) {
    return;
  }
  cy.getByCy('start-calculation').click();
  if (step === Steps.chainflex) {
    return;
  }

  cy.getByCy('save-chainflex-length').click();
  if (step === Steps.leftConnector) {
    return;
  }

  cy.getByCy('save-connector-mat017-items').click();
  if (step === Steps.rightConnector) {
    return;
  }

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
  cy.getByCy('save-connector-mat017-items').click();
  if (step === Steps.library) {
    return;
  }

  cy.getByCy('save-library').click();
  if (step === Steps.pinAssignment) {
    return;
  }
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);
  cy.getByCy('save-and-validate-configuration').click();
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('loginByState', (signedInUserData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.window().then((win) => (win as any).appStateFacadeService.setUser(signedInUserData));
});

// command to start a test in a custom icalc state
Cypress.Commands.add('setIcalcState', (icalcState) => {
  cy.window().then((win) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _window = win as any;

    _window.appStateFacadeService.setState(icalcState.appState);
    _window.processStateFacadeService.setState(icalcState.processState);
    _window.pinAssignmentStateFacadeService.setState(icalcState.pinAssignmentState);
    _window.libraryStateFacadeService.setState(icalcState.libraryState);
    _window.connectorStateFacadeService.setState(icalcState.connectorState);
    _window.chainflexStateFacadeService.setState(icalcState.chainflexState);
  });
});
