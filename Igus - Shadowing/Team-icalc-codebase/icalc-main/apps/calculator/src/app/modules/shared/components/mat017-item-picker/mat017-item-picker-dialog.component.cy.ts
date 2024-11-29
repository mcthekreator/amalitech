import { TranslateModule } from '@ngx-translate/core';
import { Mat017ItemPickerDialogComponent } from './mat017-item-picker-dialog.component';
import { MaterialModule } from '../../material.module';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mat017Item1, mat017Item2, mat017Item3 } from './mock-data';

const selectors = {
  matSortHeaderArrow: '.mat-sort-header-arrow',
  tableRows: 'tbody tr',
};

const mat017Items = [mat017Item1, mat017Item2, mat017Item3];

describe(Mat017ItemPickerDialogComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (_: string) => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mat017Items,
          },
        },
      ],
    });
  });

  it('should have sort arrows visible for all columns', () => {
    cy.mount(Mat017ItemPickerDialogComponent, {});
    cy.getByCy('sort-header-mat-number').find(selectors.matSortHeaderArrow).should('be.visible');
    cy.getByCy('sort-header-item-description-1').find(selectors.matSortHeaderArrow).should('be.visible');
    cy.getByCy('sort-header-item-description-2').find(selectors.matSortHeaderArrow).should('be.visible');
    cy.getByCy('sort-header-mat017-item-group').find(selectors.matSortHeaderArrow).should('be.visible');
    cy.getByCy('sort-header-supplier-item-number').find(selectors.matSortHeaderArrow).should('be.visible');
  });

  it('should display mat017Items in table', () => {
    cy.mount(Mat017ItemPickerDialogComponent, {});
    cy.getByCy('mat017-items-table').find(selectors.tableRows).should('have.length', 3);
    cy.getByCy('mat017-items-table')
      .find(selectors.tableRows)
      .each(($el, index) => {
        cy.wrap($el).within(() => {
          cy.get('td').eq(1).should('contain', mat017Items[index].matNumber);
          cy.get('td').eq(2).should('contain', mat017Items[index].itemDescription1);
          cy.get('td').eq(3).should('contain', mat017Items[index].itemDescription2);
          cy.get('td').eq(4).should('contain', mat017Items[index].mat017ItemGroup);
          cy.get('td').eq(5).should('contain', mat017Items[index].supplierItemNumber);
        });
      });
  });

  it('should enable confirmation button when an mat017Item is selected in the table', () => {
    cy.mount(Mat017ItemPickerDialogComponent, {});
    cy.getByCy('confirm-mat017-item-selection').should('be.disabled');
    cy.getByCy('mat017-items-table').find(selectors.tableRows).eq(0).click();
    cy.getByCy('confirm-mat017-item-selection').should('be.enabled');
  });
});
