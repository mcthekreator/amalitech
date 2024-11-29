import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { ConnectorSide, Favorites, FavoritesToMat017Item } from '@igus/icalc-domain';
import { filter, Observable, take } from 'rxjs';
import { Mat017ItemFavoritesComponent } from './mat017-item-favorites.component';

export enum ConnectorSideEnum {
  leftConnector = 'leftConnector',
  rightConnector = 'rightConnector',
}

@Injectable({ providedIn: 'root' })
export class Mat017ItemFavoritesService {
  public favorites$: Observable<Favorites[]>;
  public favoriteIsLoading$: Observable<boolean>;

  constructor(
    private connectorStateFacadeService: ConnectorStateFacadeService,
    private matDialog: MatDialog
  ) {}

  public open(side: ConnectorSide): Observable<FavoritesToMat017Item[]> {
    this.connectorStateFacadeService.getFavorites({
      which: side,
    });

    const dialogRef = this.matDialog.open(Mat017ItemFavoritesComponent, {
      id: 'confirmFavoritesDialog',
      minWidth: 1400,
      minHeight: 400,
      data: this.getConnectorSideData(side),
    });

    return dialogRef.afterClosed().pipe(
      take(1),
      filter((response: FavoritesToMat017Item[]) => Array.isArray(response))
    );
  }

  private getConnectorSideData(side: ConnectorSide): {
    favorites$: Observable<Favorites[]>;
    favoritesIsLoading$: Observable<boolean>;
  } {
    const leftConnectorFavoritesData = {
      favorites$: this.connectorStateFacadeService.leftFavorites$,
      favoritesIsLoading$: this.connectorStateFacadeService.leftFavoritesIsLoading$,
    };

    const rightConnectorFavoritesData = {
      favorites$: this.connectorStateFacadeService.rightFavorites$,
      favoritesIsLoading$: this.connectorStateFacadeService.rightFavoritesIsLoading$,
    };

    return side === ConnectorSideEnum.leftConnector ? leftConnectorFavoritesData : rightConnectorFavoritesData;
  }
}
