/// <reference types="cypress" />

// import { mount } from 'cypress/angular';
// import { AppModule } from '@icalc/frontend/app/app.module';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Chainable<Subject> {
    //mount: typeof mount;
    getByCy(selector, ...args): Chainable<JQuery<HTMLElement>>;
  }
}

//TO-DO: provide shared lib with reusable cypress commands (ICALC-748)
Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[dataCy=${selector}]`, ...args);
});

// type MountParams = Parameters<typeof mount>;
//
// Cypress.Commands.add('mount', (component: MountParams[0], config: MountParams[1] = {}) => {
//   return mount(component, {
//     ...config,
//     imports: [...(config.imports || []), AppModule],
//   });
// });
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
