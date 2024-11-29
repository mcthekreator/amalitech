import { externalUrls, selectors } from '../../../support/utils';
import { Before, BeforeAll, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { testUser } from '../../../support/auth.po';
import { ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '@igus/icalc-domain';

BeforeAll(() => {
  cy.dbSeed('delete-testdata');
  cy.deleteMat017TestItemWidenImages();
});

Before(() => {
  cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, {
    statusCode: 500,
  }).as('piwikTemplates');

  cy.session('loginByApi', () => {
    cy.loginByApi(testUser.email, testUser.password);
  });
});

afterEach(() => {
  cy.deleteMat017TestItemWidenImages();
});

const checkForDefaultPositionOfElements = (): void => {
  cy.getByCy('library-comment-element').invoke('position').as('commentPosition');
  cy.getByCy('library-box-element').invoke('position').as('boxPosition');
  cy.getByCy('library-circle-element').invoke('position').as('circlePosition');
  cy.getByCy('library-line-element').invoke('position').as('linePosition');
  cy.getByCy('library-arrow-element').invoke('position').as('arrowPosition');

  cy.get('@boxPosition').then((boxPosition) => {
    const { top, left } = boxPosition as unknown as JQuery.Coordinates;

    cy.get('@commentPosition').its('top').should('be.lessThan', top);
    cy.get('@commentPosition').its('left').should('be.lessThan', left);
    cy.get('@circlePosition').its('top').should('be.greaterThan', top);
    cy.get('@circlePosition').its('left').should('be.greaterThan', left);
  });

  cy.get('@linePosition').then((linePosition) => {
    const { top, left } = linePosition as unknown as JQuery.Coordinates;

    cy.get('@circlePosition').its('top').should('be.lessThan', top);
    cy.get('@circlePosition').its('left').should('be.lessThan', left);
    cy.get('@arrowPosition').its('top').should('be.greaterThan', top);
    cy.get('@arrowPosition').its('left').should('be.greaterThan', left);
  });
};

When('the user adds elements to the sketch', () => {
  // comment
  cy.getByCy('library-add-comment-button').click();
  cy.getByCy('library-comment-element').should('be.visible');

  // box
  cy.getByCy('library-add-box-button').click();
  cy.getByCy('library-box-element').should('be.visible');

  // circle
  cy.getByCy('library-add-circle-button').click();
  cy.getByCy('library-circle-element').should('be.visible');

  // line
  cy.getByCy('library-add-line-button').click();
  cy.getByCy('library-line-element').should('be.visible');

  // arrow
  cy.getByCy('library-add-arrow-button').click();
  cy.getByCy('library-arrow-element').should('be.visible');
  checkForDefaultPositionOfElements();
});

When(/^(the user )?reopens the page$/, () => {
  cy.getByCy('library-right-connector-button').click();
  cy.getByCy('save-connector-mat017-items').click();
});

Then('iCalc should show the added elements at the right position', () => {
  cy.getByCy('library-comment-element').should('be.visible');
  cy.getByCy('library-box-element').should('be.visible');
  cy.getByCy('library-circle-element').should('be.visible');
  cy.getByCy('library-line-element').should('be.visible');
  cy.getByCy('library-arrow-element').should('be.visible');
  checkForDefaultPositionOfElements();
});

When(/^the user adds an image to the sketch$/, () => {
  cy.getByCy('library-add-image-button').click();
  cy.getByCy('library-image-input').selectFile('src/support/images/icalcTestImage.png');
  cy.getByCy('library-image-element').should('be.visible');
  cy.getByCy('library-image').invoke('attr', 'class').should('not.contain', 'border-red');
});

Then('iCalc should show the added image', () => {
  cy.getByCy('library-image-element').should('be.visible');
  cy.getByCy('library-image').invoke('attr', 'class').should('not.contain', 'border-red');
});

When(/^the user uploads an image to Widen$/, () => {
  cy.getByCy('widen-image-in-mat-card')
    .eq(0)
    .then((noImageElement) => {
      const sourceWithoutImage = noImageElement.attr('src');

      expect(sourceWithoutImage).to.eq('');
    });

  cy.getByCy('upload-widen-image-button-photo').eq(0).click();
  cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/1.png');

  cy.getByCy('photo-loading-spinner').eq(0).should('be.visible');

  cy.getByCy('widen-image-in-mat-card').eq(0, { timeout: 50000 }).should('be.visible');
});

Then('iCalc should show the correct image in the tile of this item', () => {
  cy.getByCy('widen-image-in-mat-card').eq(0).should('be.visible');
});

When(/^the user updates the Widen image for a mat017 item$/, () => {
  cy.getByCy('widen-image-in-mat-card')
    .eq(0)
    .then((noImageElement) => {
      const sourceWithoutImage = noImageElement.attr('src');

      expect(sourceWithoutImage).to.eq('');
    });

  cy.getByCy('upload-widen-image-button-photo').eq(0).click();
  cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/1.png');

  cy.getByCy('widen-image-in-mat-card').eq(0, { timeout: 50000 }).should('be.visible');

  cy.getByCy('widen-image-in-mat-card')
    .eq(0)
    .then((firstImageElement) => {
      const sourceOfFirstImage = firstImageElement.attr('src');

      expect(sourceOfFirstImage).not.to.eq('');

      cy.getByCy('save-library').click();
      cy.getByCy('back-to-library-button').click();

      cy.getByCy('widen-image-in-mat-card').eq(0).should('be.visible');

      cy.getByCy('upload-widen-image-button-photo').eq(0).click();
      cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/2.png');

      cy.getByCy('photo-loading-spinner').eq(0).should('be.visible');

      cy.getByCy('widen-image-in-mat-card').eq(0, { timeout: 50000 }).should('be.visible');

      cy.getByCy('widen-image-in-mat-card')
        .eq(0)
        .then((secondImageElement) => {
          const sourceOfSecondImage = secondImageElement.attr('src');

          expect(sourceOfSecondImage).not.to.eq(sourceOfFirstImage);
        });
    });
});

When(/^the user updates the Widen image for a mat017 item which is selected in more than one configuration$/, () => {
  cy.getByCy('widen-image-in-mat-card')
    .eq(0)
    .then((noImageElement) => {
      const sourceWithoutImage = noImageElement.attr('src');

      expect(sourceWithoutImage).to.eq('');
    });

  // introduce image in context of first configuration
  cy.getByCy('upload-widen-image-button-photo').eq(0).click();
  cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/1.png');
  cy.getByCy('widen-image-in-mat-card').eq(0, { timeout: 50000 }).should('be.visible');
  cy.getByCy('widen-image-in-mat-card')
    .eq(0)
    .then((firstImageElement) => {
      const firstImageSource = firstImageElement.attr('src');

      expect(firstImageSource).to.not.eq('');

      // copy configuration
      cy.get(selectors.step).eq(0).click();
      cy.getByCy('open-duplicate-configuration-dialog').click();
      cy.getByCy('copy-config-into-existing-calc').should('be.visible').click();
      cy.getByCy('config-number-copy-config')
        .should('be.visible')
        .type(`${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}CopyToTestWidenImageUpdate`);
      cy.getByCy('batch-size-copy-config').should('be.visible').type('10');
      cy.getByCy('chainflex-length-copy-config').focus();
      cy.getByCy('chainflex-length-copy-config').should('be.visible').type('10');
      cy.getByCy('config-number-copy-config').focus();
      cy.getByCy('add-new-config-to-existing-calculation').should('be.visible').click();

      // click through to library step
      cy.getByCy('start-calculation').click();
      cy.getByCy('save-chainflex-length').click();
      cy.getByCy('save-connector-mat017-items').click();
      cy.getByCy('save-connector-mat017-items').click();

      // update image in context of copied configuration (second configuration)
      cy.getByCy('upload-widen-image-button-photo').eq(0).click();
      cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/2.png');
      cy.getByCy('photo-loading-spinner').eq(0).should('be.visible');
      cy.getByCy('widen-image-in-mat-card').eq(0, { timeout: 50000 }).should('be.visible');
      cy.getByCy('widen-image-in-mat-card')
        .eq(0)
        .then((secondImageElement) => {
          const secondImageSource = secondImageElement.attr('src');

          expect(secondImageSource).to.not.eq(firstImageSource);

          // go back to first configuration
          cy.get(selectors.step).eq(0).click();
          cy.getByCy('select-config-number').click();
          cy.get(selectors.matOption).eq(0).click();

          // click through to library step
          cy.getByCy('start-calculation').click();
          cy.getByCy('save-chainflex-length').click();
          cy.getByCy('save-connector-mat017-items').click();
          cy.getByCy('save-connector-mat017-items').click();

          cy.getByCy('widen-image-in-mat-card')
            .eq(0)
            .then((secondImageInFirstConfigElement) => {
              const secondImageInFirstConfigSource = secondImageInFirstConfigElement.attr('src');

              expect(secondImageInFirstConfigSource).to.not.eq('');
              expect(secondImageInFirstConfigSource).to.not.eq(firstImageSource);
            });
        });
    });
});
