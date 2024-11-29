import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type {
  CopyWithUpdatedOverridesDialogData,
  Mat017ItemWithOutdatedPrice,
} from './copy-configuration-with-updated-overrides-dialog.component';
import {
  CopyConfigurationWithUpdatedOverridesDialogComponent,
  CopyWithUpdatedOverridesResult,
} from './copy-configuration-with-updated-overrides-dialog.component';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { Mat017ItemChange, Mat017ItemWithWidenData } from '@igus/icalc-domain';
import { Mat017ItemStatus } from '@igus/icalc-domain';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';

@Injectable({ providedIn: 'root' })
export class CopyConfigurationWithUpdatedOverridesDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(
    mat017ItemsWithOutdatedPrices: Mat017ItemWithOutdatedPrice[]
  ): Observable<CopyWithUpdatedOverridesResult> {
    const dialogRef = this.matDialog.open<
      CopyConfigurationWithUpdatedOverridesDialogComponent,
      CopyWithUpdatedOverridesDialogData,
      CopyWithUpdatedOverridesResult
    >(CopyConfigurationWithUpdatedOverridesDialogComponent, {
      panelClass: 'duplicate-configuration-dialog',
      minWidth: 1000,
      maxWidth: 1000,
      data: {
        mat017Items: mat017ItemsWithOutdatedPrices,
      },
    });

    return dialogRef
      .afterClosed()
      .pipe(
        map((result) =>
          result === undefined
            ? CopyWithUpdatedOverridesResult.create(AssignOrCopyConfigurationActionsEnum.cancel)
            : result
        )
      );
  }

  public mapToMat017ItemsWithOutdatedPrices(
    mat017Items: (Mat017ItemWithWidenData | Mat017ItemChange)[]
  ): Mat017ItemWithOutdatedPrice[] {
    return mat017Items
      .filter((item) => {
        if (item.itemStatus === Mat017ItemStatus.removed) {
          return false;
        }
        if (item.itemStatus === Mat017ItemStatus.inactive) {
          const itemChange = item as Mat017ItemChange;

          if (itemChange.newOverrides)
            return !(
              itemChange.newOverrides.amountDividedByPriceUnit === itemChange.currentOverrides.amountDividedByPriceUnit
            );
          else return true;
        }
        return true;
      })
      .map((item) => {
        const { matNumber, itemDescription1, itemDescription2 } = item;

        if ((item as Mat017ItemWithWidenData).overrides) {
          const { overrides, amountDividedByPriceUnit } = item as Mat017ItemWithWidenData;

          return {
            matNumber,
            itemDescription1,
            itemDescription2,
            currentPrice: overrides.amountDividedByPriceUnit,
            newPrice: amountDividedByPriceUnit,
          };
        }

        if ((item as Mat017ItemChange).currentOverrides) {
          const { currentOverrides, newOverrides } = item as Mat017ItemChange;

          return {
            matNumber,
            itemDescription1,
            itemDescription2,
            currentPrice: currentOverrides.amountDividedByPriceUnit,
            newPrice: newOverrides.amountDividedByPriceUnit,
          };
        }
      });
  }
}
