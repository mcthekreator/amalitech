/// <reference types="cypress" />

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  import type { DbSeedResponse, DeleteMat017TestItemWidenImagesResponse } from '@igus/icalc-domain';
  import type { Steps } from './src/support/utils';
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    getByCy(selector, ...args): Chainable<JQuery<HTMLElement>>;
    getStringByLang(key, lang): Chainable<string>;
    shouldContainTranslated(key: string, interpolationParams?: Record<string, string>): Chainable<any>;
    containsTranslated(key: string, interpolationParams?: Record<string, string>): Chainable<any>;
    filterByTranslatedString(key: string, interpolationParams?: Record<string, string>): Chainable<any>;
    shouldHaveTextTranslated(key: string, interpolationParams?: Record<string, string>): Chainable<any>;
    loginByApi(email: string, password: string, failOnStatusCode?: boolean): Chainable<Cypress.Response<any>>;
    logoutByApi(failOnStatusCode?: boolean): Chainable<Cypress.Response<any>>;
    loginByState(signedInUserData: UserData): Chainable<Cypress.Response<any>>;
    setIcalcState(icalcState: any): void;
    dbSeed(seedType: string): Chainable<DbSeedResponse>;
    deleteMat017TestItemWidenImages(): Chainable<DeleteMat017TestItemWidenImagesResponse>;
    findByExactString(searchedText: string): Chainable<Subject>;
    clickThroughToStep(selectCalculationNumber: string, step: Steps): void;
  }

  interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ProjectResponsible' | 'Customer' | 'Manager';
  }

  interface WindowWithState extends AUTWindow {
    processStateFacadeService: { processStateSnapshot(): any };
  }
}
