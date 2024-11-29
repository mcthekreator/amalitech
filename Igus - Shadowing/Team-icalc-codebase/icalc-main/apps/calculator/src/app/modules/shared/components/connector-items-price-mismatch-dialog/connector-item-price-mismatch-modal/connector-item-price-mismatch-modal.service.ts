import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type {
  ConfigurationConnectorStatePresentation,
  ConnectorSide,
  FavoritesToMat017Item,
  Mat017ItemWithWidenData,
} from '@igus/icalc-domain';
import { Mat017ItemStatus, NumberUtils } from '@igus/icalc-domain';
import { DialogConfirmOrCancelEnum } from '@icalc/frontend/app/modules/shared/types';
import { firstValueFrom, map, Observable, take } from 'rxjs';
import { ConnectorItemPriceMismatchModalComponent } from './connector-item-price-mismatch-modal.component';

export enum ModalActionsEnum {
  cancel = 'CANCEL',
  update = 'UPDATE_OTHER_SIDE',
}

@Injectable({
  providedIn: 'root',
})
export class ConnectorItemPriceMismatchModalService {
  public connectorState: ConfigurationConnectorStatePresentation;
  public currentConnectorSide: ConnectorSide;
  public isFavorites: boolean;
  constructor(
    public processStateFacadeService: ProcessStateFacadeService,
    private matDialog: MatDialog
  ) {}

  public checkMat017ItemPriceMismatchOnOtherConnectorSide(
    currentSide: ConnectorSide,
    selectedMat017ItemNumber: string
  ): boolean {
    this.currentConnectorSide = currentSide;
    this.setConnectorData();
    return this.isPriceMismatchInOtherSideOfConnector(selectedMat017ItemNumber);
  }

  public checkFavoriteItemPriceMismatchOnOtherConnectorSide(
    currentSide: ConnectorSide,
    favorites: FavoritesToMat017Item[]
  ): boolean {
    this.currentConnectorSide = currentSide;
    this.setConnectorData();
    return !!this.getFavoriteItemsWithMismatchedPrices(favorites).length;
  }

  public syncMat017ItemPriceAccrossConnectors$(
    currentSide: ConnectorSide,
    selectedMat017ItemNumber: string
  ): Observable<DialogConfirmOrCancelEnum> {
    this.isFavorites = false;
    this.currentConnectorSide = currentSide;
    this.setConnectorData();
    const isItemPriceMismatched = this.isPriceMismatchInOtherSideOfConnector(selectedMat017ItemNumber);

    if (!isItemPriceMismatched) {
      return;
    }
    return this.openConfirmationDialog([selectedMat017ItemNumber]);
  }

  public syncFavoriteItemsPricesAccrossConnectors$(
    currentSide: ConnectorSide,
    favorites: FavoritesToMat017Item[]
  ): Observable<DialogConfirmOrCancelEnum> {
    this.currentConnectorSide = currentSide;
    this.isFavorites = true;
    this.setConnectorData();
    const mismatchedItems = this.getFavoriteItemsWithMismatchedPrices(favorites);

    if (!mismatchedItems.length) {
      return;
    }
    return this.openConfirmationDialog(mismatchedItems);
  }

  public setConnectorData(): void {
    this.processStateFacadeService.selectedConfigurationData$.pipe(take(1)).subscribe((data) => {
      this.connectorState = data.state.connectorState;
    });
  }

  public async arePricesOnBothSidesConsistentOrIsMismatchCorrected(
    sideOfAddedItems: ConnectorSide,
    favorites: FavoritesToMat017Item[]
  ): Promise<boolean> {
    const hasMismatchedItemInOtherConnectorSide = this.checkFavoriteItemPriceMismatchOnOtherConnectorSide(
      sideOfAddedItems,
      favorites
    );

    if (!hasMismatchedItemInOtherConnectorSide) {
      return true;
    } else
      return firstValueFrom(
        this.syncFavoriteItemsPricesAccrossConnectors$(this.currentConnectorSide, favorites).pipe(
          map((response) => response === DialogConfirmOrCancelEnum.confirmAction)
        )
      );
  }

  private getFavoriteItemsWithMismatchedPrices(favorites: FavoritesToMat017Item[]): string[] {
    const itemsInFavorites = favorites.map((item) => item.matNumber);

    return itemsInFavorites.reduce((acc, currentMatNumber) => {
      if (this.isPriceMismatchInOtherSideOfConnector(currentMatNumber)) {
        acc.push(currentMatNumber);
        return acc;
      } else return acc;
    }, []);
  }

  private isPriceMismatchInOtherSideOfConnector(mat017ItemNumber: string): boolean {
    const otherSide = this.currentConnectorSide === 'leftConnector' ? 'rightConnector' : 'leftConnector';
    const itemInOtherSide = this.connectorState?.[otherSide]?.mat017ItemListWithWidenData.find(
      (item: Mat017ItemWithWidenData) => item.matNumber === mat017ItemNumber
    );

    if (!itemInOtherSide) {
      return false;
    }

    return (
      itemInOtherSide.itemStatus === Mat017ItemStatus.active &&
      !NumberUtils.areFloatsEqual(
        itemInOtherSide.overrides.amountDividedByPriceUnit,
        itemInOtherSide.amountDividedByPriceUnit
      )
    );
  }

  private syncPrices(mat017ItemsWithMismatch: string[]): void {
    if (this.currentConnectorSide === 'leftConnector') {
      this.processStateFacadeService.syncRightMat017ItemPriceToLeft({
        mat017ItemsWithMismatch,
        currentConnectorSide: this.currentConnectorSide,
      });
    } else {
      this.processStateFacadeService.syncLeftMat017ItemPriceToRight({
        mat017ItemsWithMismatch,
        currentConnectorSide: this.currentConnectorSide,
      });
    }
  }

  private openConfirmationDialog(mismatchedItems: string[]): Observable<DialogConfirmOrCancelEnum> {
    const dialogRef = this.matDialog.open<ConnectorItemPriceMismatchModalComponent>(
      ConnectorItemPriceMismatchModalComponent,
      {
        minWidth: 800,
        maxWidth: 800,
        data: {
          isFavorites: this.isFavorites,
          allItemsInOneString: mismatchedItems.join(', '),
        },
      }
    );

    return dialogRef.afterClosed().pipe(
      map((response) => {
        if (response === ModalActionsEnum.update) {
          this.syncPrices(mismatchedItems);
          return DialogConfirmOrCancelEnum.confirmAction;
        }
        return DialogConfirmOrCancelEnum.cancelAction;
      })
    );
  }
}
