import {
  ICALC_DYNAMIC_MAT_NUMBER_PREFIX,
  icalcLockedTestCalculation,
  icalcTestCalculation,
  icalcTestCalculationWithLibraryImage,
  icalcTestConfiguration,
} from '@igus/icalc-domain';
import { testUser } from '../../../support/auth.po';
import { apiEndpoints, buildApiPath, externalUrls, selectors, Steps } from '../../../support/utils';

const defaultLeftMarkerDistance = 100;
const defaultRightMarkerDistance = 100;

describe('library', () => {
  before(() => {
    cy.dbSeed('delete-testdata');
    cy.dbSeed('calculation-and-configuration');
    cy.dbSeed('calculation-and-configuration --locked');
  });

  beforeEach(() => {
    // avoid displaying piwik gdpr window
    cy.intercept('GET', `${externalUrls.igusPiwikContainer}/*`, {
      statusCode: 500,
    }).as('piwikTemplates');

    cy.session('loginByApi', () => {
      cy.loginByApi(testUser.email, testUser.password);
    });

    cy.intercept('GET', `${buildApiPath(apiEndpoints.singleCableCalculation)}*`).as('getSingleCableCalculationRequest');
  });

  after(() => {
    cy.deleteMat017TestItemWidenImages();
    cy.dbSeed('delete-testdata');
  });

  it('should load initial data correctly', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.library);

    cy.getByCy('library-mat-card-content').should('be.visible');

    cy.wait('@getSingleCableCalculationRequest').then((subject) => {
      const mat017Item =
        subject.response.body.configuration.state.connectorState.leftConnector.mat017ItemListWithWidenData[0];

      cy.getByCy('library-mat-card-content').should('contain', mat017Item.matNumber);
    });

    cy.getByCy('library-meta-data-box').should('be.visible');
    cy.getByCy('library-meta-data-box').should('contain', icalcTestConfiguration.matNumber);

    cy.getByCy('library-marker-distance-input-field-left').should('be.visible');
    cy.getByCy('library-marker-distance-input-field-left').should('have.value', defaultLeftMarkerDistance);
    cy.getByCy('library-marker-distance-input-field-right').should('be.visible');
    cy.getByCy('library-marker-distance-input-field-right').should('have.value', defaultRightMarkerDistance);

    cy.getByCy('library-label-input-field-left').should('be.visible');
    cy.getByCy('library-label-input-field-left').should('have.value', icalcTestConfiguration.labelingLeft);

    cy.getByCy('library-label-input-field-right').should('be.visible');
    cy.getByCy('library-label-input-field-right').should('have.value', icalcTestConfiguration.labelingRight);

    cy.getByCy('library-label-text-field-left').should('be.visible');
    cy.getByCy('library-label-text-field-left').should('contain', icalcTestConfiguration.matNumber);
    cy.getByCy('library-label-text-field-left').should('contain', '[LENGTH]');

    cy.getByCy('library-label-text-field-right').should('be.visible');
    cy.getByCy('library-label-text-field-right').should('contain', icalcTestConfiguration.matNumber);
    cy.getByCy('library-label-text-field-right').should('contain', '[LENGTH]');
  });

  it('should be able to upload an external image to the sketch', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.library);

    // image
    cy.getByCy('library-add-image-button').click();
    cy.getByCy('library-image-input').selectFile('src/support/images/icalcTestImage.png');
    cy.getByCy('library-image-element').should('be.visible');
    cy.getByCy('library-image').invoke('attr', 'class').should('not.contain', 'border-red');

    // save, go back
    cy.getByCy('library-right-connector-button').click();
    cy.getByCy('save-connector-mat017-items').click();

    // check if elements are still there
    cy.getByCy('library-image-element').should('be.visible');
    cy.getByCy('library-image').invoke('attr', 'class').should('not.contain', 'border-red');

    // reset sketch
    cy.getByCy('library-reset-sketch-button').click();
    // check if elements have been removed
    cy.get('library-image-element').should('not.exist');
  });

  it('should be able to add elements in unlocked/active configurations and see them after reopening the sketch if they have been saved', () => {
    cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.library);

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

    // POSITION
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

    // save, go back
    cy.getByCy('library-right-connector-button').click();
    cy.getByCy('save-connector-mat017-items').click();
    // check if elements are still there
    cy.getByCy('library-comment-element').should('be.visible');
    cy.getByCy('library-box-element').should('be.visible');
    cy.getByCy('library-circle-element').should('be.visible');
    cy.getByCy('library-line-element').should('be.visible');
    cy.getByCy('library-arrow-element').should('be.visible');

    // reset sketch
    cy.getByCy('library-reset-sketch-button').click();
    // check if elements have been removed
    cy.get('library-comment-element').should('not.exist');
    cy.get('library-box-element').should('not.exist');
    cy.get('library-circle-element').should('not.exist');
    cy.get('library-line-element').should('not.exist');
    cy.get('library-arrow-element').should('not.exist');

    // save
    cy.getByCy('library-right-connector-button').click();
  });

  it('should be able to add elements in locked configurations and see them after reopening the sketch if they have been saved', () => {
    cy.clickThroughToStep(icalcLockedTestCalculation.calculationNumber, Steps.library);

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

    // POSITION is only tested for unlocked configuration since the implementation for positioning is independent of calculation status

    // save, go back
    cy.getByCy('library-right-connector-button').click();
    cy.getByCy('save-connector-mat017-items').click();
    // check if elements are still there
    cy.getByCy('library-comment-element').should('be.visible');
    cy.getByCy('library-box-element').should('be.visible');
    cy.getByCy('library-circle-element').should('be.visible');
    cy.getByCy('library-line-element').should('be.visible');
    cy.getByCy('library-arrow-element').should('be.visible');

    // reset sketch
    cy.getByCy('library-reset-sketch-button').click();
    // check if elements have been removed
    cy.get('library-comment-element').should('not.exist');
    cy.get('library-box-element').should('not.exist');
    cy.get('library-circle-element').should('not.exist');
    cy.get('library-line-element').should('not.exist');
    cy.get('library-arrow-element').should('not.exist');
  });

  context(
    'Given a configuration with an up to date mat017 item selected for leftConnector and library image for that item on left side.\n' +
      'When landing on library page, ',
    () => {
      before(() => {
        cy.dbSeed('calculation-and-configuration --imageInLibrary');
      });
      it('then the image should not have a red border.', () => {
        cy.clickThroughToStep(icalcTestCalculationWithLibraryImage.calculationNumber, Steps.library);

        cy.getByCy('library-image').invoke('attr', 'class').should('not.contain', 'border-red');
      });
    }
  );

  context('scenario: Widen Uploads', () => {
    context(
      'Given a configuration with an mat017 item without a current image.\n' + 'When landing on library page, ',
      () => {
        after(() => {
          cy.deleteMat017TestItemWidenImages();
          cy.dbSeed('delete-testdata');
        });

        xit('then a new image should be uploadable and be displayed in the item tile.', () => {
          cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.library);

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

          cy.getByCy('save-library').click();
          cy.getByCy('back-to-library-button').click();

          cy.getByCy('widen-image-in-mat-card').eq(0).should('be.visible');
        });
      }
    );

    context(
      'Given a configuration with an mat017 item with a current image.\n' + 'When landing on library page, ',
      () => {
        before(() => {
          cy.dbSeed('calculation-and-configuration');
        });

        after(() => {
          cy.deleteMat017TestItemWidenImages();
          cy.dbSeed('delete-testdata');
        });

        xit('then a new image should be uploadable and should replace the old image in the item tile.', () => {
          cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.library);

          cy.getByCy('widen-image-in-mat-card')
            .eq(0)
            .then((noImageElement) => {
              const sourceWithoutImage = noImageElement.attr('src');

              expect(sourceWithoutImage).to.eq('');

              cy.getByCy('upload-widen-image-button-photo').eq(0).click();
              cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/1.png');

              cy.getByCy('photo-loading-spinner').eq(0).should('be.visible');

              cy.getByCy('widen-image-in-mat-card').eq(0, { timeout: 50000 }).should('be.visible');

              cy.getByCy('widen-image-in-mat-card')
                .eq(0)
                .then((firstImageElement) => {
                  const sourceOfFirstImage = firstImageElement.attr('src');

                  expect(sourceOfFirstImage).not.to.eq(sourceWithoutImage);

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
        });
      }
    );

    context(
      'Given a configuration with a mat017 item, for which the image has been updated in the context of another configuration.\n' +
        'When landing on library page, ',
      () => {
        before(() => {
          cy.dbSeed('calculation-and-configuration');
        });

        after(() => {
          cy.deleteMat017TestItemWidenImages();
          cy.dbSeed('delete-testdata');
        });

        xit('then the current image should be displayed in the item tile.', () => {
          cy.clickThroughToStep(icalcTestCalculation.calculationNumber, Steps.library);

          cy.getByCy('widen-image-in-mat-card')
            .eq(0)
            .then((noImageElement) => {
              const sourceWithoutImage = noImageElement.attr('src');

              expect(sourceWithoutImage).to.eq('');
            });

          // introduce image in context of first configuration
          cy.getByCy('upload-widen-image-button-photo').eq(0).click();
          cy.getByCy('upload-widen-image-button-photo').eq(0).selectFile('src/support/images/widen/1.png');
          cy.getByCy('photo-loading-spinner').eq(0).should('be.visible');
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

                  cy.getByCy('save-connector-mat017-items').should('be.visible');
                  // eslint-disable-next-line cypress/no-unnecessary-waiting
                  cy.wait(100);
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
      }
    );
  });
});
