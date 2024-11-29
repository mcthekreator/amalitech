import { testUser } from '../../support/auth.po';

describe('auth API', () => {
  before(() => {
    cy.dbSeed('user');
  });

  context('POST /auth/signin', () => {
    it('should check if response object contains the right properties, if user exists', () => {
      cy.loginByApi(testUser.email, testUser.password).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.user).to.have.property('email', testUser.email);
        expect(response.body.user).to.have.property('firstName', testUser.firstName);
        expect(response.body.user).to.have.property('lastName', testUser.lastName);
        expect(response.body.user).to.have.property('role', testUser.role);
      });
    });
    it('should return an error if user does not exist', () => {
      cy.loginByApi('test@bla.de', testUser.password, false).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.have.property('message', 'Access Denied');
      });
    });
    it('should return an error if wrong password is passed', () => {
      cy.loginByApi(testUser.email, '112200', false).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.have.property('message', 'Access Denied');
      });
    });
  });

  context('POST /auth/profile', () => {
    it("should return the logged-in user's profile", () => {
      cy.loginByApi(testUser.email, testUser.password);
      cy.request('GET', `${Cypress.env('apiUrl')}/auth/profile`).then((response) => {
        expect(response.body).to.have.property('email', testUser.email);
        expect(response.body).to.have.property('firstName', testUser.firstName);
        expect(response.body).to.have.property('lastName', testUser.lastName);
        expect(response.body).to.have.property('role', testUser.role);
      });
    });
  });

  context('POST /auth/logout', () => {
    it('should return an empty object on logout', () => {
      cy.loginByApi(testUser.email, testUser.password);
      cy.logoutByApi().then((response) => {
        expect(response.status).to.eq(200);
        cy.wrap(response.body).should('be.empty');
      });
    });

    it('should return an error if user is not logged in', () => {
      cy.logoutByApi(false).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
      });
    });
  });

  context('POST /auth/refresh', () => {
    it('should refresh bearer token', () => {
      cy.loginByApi(testUser.email, testUser.password);
      cy.request('POST', `${Cypress.env('apiUrl')}/auth/refresh`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.contain('refreshed');
      });
    });
    it('should return an error if user is not logged in', () => {
      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/auth/refresh`, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.have.property('message', 'Unauthorized');
        }
      );
    });
  });
});
