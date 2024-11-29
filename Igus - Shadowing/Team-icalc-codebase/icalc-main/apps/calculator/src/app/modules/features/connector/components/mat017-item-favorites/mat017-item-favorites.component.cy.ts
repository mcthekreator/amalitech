import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Mat017ItemFavoritesComponent } from './mat017-item-favorites.component';
import type { Favorites } from '@igus/icalc-domain';
import { createMat017Item } from '@igus/icalc-domain';
import { MaterialModule } from '@icalc/frontend/app/modules/shared/material.module';
import { of, type Observable } from 'rxjs';
import type { MountConfig } from 'cypress/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { TranslateGermanPipe } from '@icalc/frontend/app/modules/shared/pipes/translate-to-german.pipe';

const selectors = {
  matSortHeaderArrow: '.mat-sort-header-arrow',
  tableRows: 'tbody tr',
  checkboxInput: 'input[type="checkbox"]',
};

const mockFavorites = [
  {
    id: 'exampleConnectorSetId',
    name: 'example connector set template',
    favoritesToMat017Items: [
      {
        id: 'mat017ExampleId',
        favoritesId: 'exampleConnectorSetId',
        matNumber: 'exampleMatNumber',
        amount: 1,
        mat017Item: createMat017Item(),
      },
      {
        id: 'mat017ExampleIdInvalid',
        favoritesId: 'exampleConnectorSetId',
        matNumber: 'exampleMatNumberInvalid',
        amount: 1,
        mat017Item: createMat017Item(),
      },
      {
        id: 'mat017ExampleIdRemoved',
        favoritesId: 'exampleConnectorSetId',
        matNumber: 'exampleMatNumberRemoved',
        amount: 1,
        mat017Item: createMat017Item(),
      },
    ],
  },
];

describe(Mat017ItemFavoritesComponent.name, () => {
  let matDialogDataMock: { favorites$: Observable<Favorites[]>; favoritesIsLoading$: Observable<boolean> };

  const config = (): MountConfig<Mat017ItemFavoritesComponent> => {
    matDialogDataMock = { favorites$: of(mockFavorites), favoritesIsLoading$: of(false) };

    return {
      declarations: [Mat017ItemFavoritesComponent, TranslateGermanPipe],
      imports: [MaterialModule, ReactiveFormsModule, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (_: string) => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: matDialogDataMock,
        },
        {
          provide: ProcessStateFacadeService,
          useValue: { chainflexCable$: of({}) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    };
  };

  it('should display favorites items in a row of accordions with an unchecked checkbox on every accordion', () => {
    const firstAccordion = 'firstAccordion';

    cy.mount(Mat017ItemFavoritesComponent, config());
    cy.get('mat-accordion').should('have.length', 1);
    cy.get('mat-accordion').first().as(firstAccordion);
    cy.get(`@${firstAccordion}`).getByCy('connector-set-item-checkbox').should('exist').should('not.be.checked');
  });

  it('should display a table of unchecked items when an accordion checkbox is unchecked and the accordion is opened', () => {
    const firstAccordion = 'firstAccordion';
    const favoriteLength = mockFavorites[0].favoritesToMat017Items.length;

    cy.mount(Mat017ItemFavoritesComponent, config());

    cy.get('mat-accordion').first().as(firstAccordion);
    cy.get(`@${firstAccordion}`).click();
    cy.getByCy('mat017-favorite-items-table')
      .find(selectors.tableRows)
      .should('have.length', favoriteLength)
      .each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('td').eq(0).getByCy('individual-connector-item-checkbox').should('exist').should('not.be.checked');
        });
      });
  });

  it('should open the accordion and display a table of checked items when an accordion checkbox is checked', () => {
    const firstAccordion = 'firstAccordion';
    const favoriteLength = mockFavorites[0].favoritesToMat017Items.length;

    cy.mount(Mat017ItemFavoritesComponent, config());

    cy.get('mat-accordion').first().as(firstAccordion);
    cy.get(`@${firstAccordion}`)
      .getByCy('connector-set-item-checkbox')
      .should('exist')
      .find(selectors.checkboxInput)
      .check({ force: true });
    cy.getByCy('mat017-favorite-items-table')
      .find(selectors.tableRows)
      .should('have.length', favoriteLength)
      .each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('td')
            .eq(0)
            .getByCy('individual-connector-item-checkbox')
            .should('exist')
            .find(selectors.checkboxInput)
            .should('be.checked');
        });
      });
  });

  it('should uncheck all individual items and close the accordion if the accordion checkbox is unchecked', () => {
    const firstAccordion = 'firstAccordion';
    const favoriteLength = mockFavorites[0].favoritesToMat017Items.length;

    cy.mount(Mat017ItemFavoritesComponent, config());

    cy.get('mat-accordion').first().as(firstAccordion);
    cy.get(`@${firstAccordion}`)
      .getByCy('connector-set-item-checkbox')
      .should('exist')
      .find(selectors.checkboxInput)
      .check({ force: true });
    cy.getByCy('mat017-favorite-items-table').find(selectors.tableRows).should('have.length', favoriteLength);

    cy.get(`@${firstAccordion}`)
      .getByCy('connector-set-item-checkbox')
      .find(selectors.checkboxInput)
      .uncheck({ force: true });

    cy.getByCy('mat017-favorite-items-table').find(selectors.tableRows).should('not.be.visible');

    cy.get(`@${firstAccordion}`).click();

    cy.getByCy('mat017-favorite-items-table')
      .find(selectors.tableRows)
      .each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('td')
            .eq(0)
            .getByCy('individual-connector-item-checkbox')
            .should('exist')
            .find(selectors.checkboxInput)
            .should('not.be.checked');
        });

        cy.get(`@${firstAccordion}`).click();
      });
  });

  it('should close the accordion if all the individual items are unchecked', () => {
    const firstAccordion = 'firstAccordion';

    cy.mount(Mat017ItemFavoritesComponent, config());

    cy.get('mat-accordion').first().as(firstAccordion);
    cy.get(`@${firstAccordion}`)
      .getByCy('connector-set-item-checkbox')
      .should('exist')
      .find(selectors.checkboxInput)
      .check({ force: true });

    cy.getByCy('mat017-favorite-items-table')
      .find(selectors.tableRows)
      .each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('td')
            .eq(0)
            .getByCy('individual-connector-item-checkbox')
            .should('exist')
            .find(selectors.checkboxInput)
            .uncheck();
        });
      });

    cy.getByCy('mat017-favorite-items-table').find(selectors.tableRows).should('not.be.visible');
    cy.get(`@${firstAccordion}`)
      .getByCy('connector-set-item-checkbox')
      .find(selectors.checkboxInput)
      .should('not.be.checked');
  });

  it('should show an indeterminate state of the accordion checkbox if some, but not all of the individual items are selected', () => {
    const firstAccordion = 'firstAccordion';

    cy.mount(Mat017ItemFavoritesComponent, config());

    cy.get('mat-accordion').first().as(firstAccordion);
    cy.get(`@${firstAccordion}`).click();

    cy.getByCy('mat017-favorite-items-table')
      .find(selectors.tableRows)
      .first()
      .get('td')
      .eq(0)
      .should('exist')
      .find(selectors.checkboxInput)
      .check();

    cy.get(`@${firstAccordion}`)
      .getByCy('connector-set-item-checkbox')
      .find(selectors.checkboxInput)
      .should('have.prop', 'indeterminate', true);
  });
});
