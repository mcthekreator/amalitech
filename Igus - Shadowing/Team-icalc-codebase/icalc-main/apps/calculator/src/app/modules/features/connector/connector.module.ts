import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';
import { LeftConnectorComponent } from './components/left-connector/left-connector.component';
import { RightConnectorComponent } from './components/right-connector/right-connector.component';
import { Mat017ItemPriceChangeInfoComponent } from './components/mat017-item-price-change-info/mat017-item-price-change-info.component';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';

import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { ConnectorMat017ItemsTableComponent } from './components/connector-mat017-items-table/connector-mat017-items-table.component';
import { RequiredDataGuard } from '../../core/services/required-data.guard';
import { Mat017ItemFavoritesComponent } from './components/mat017-item-favorites/mat017-item-favorites.component';
import { Mat017ItemInvalidInfoComponent } from './components/mat017-item-invalid-info/mat017-item-invalid-info.component';
import { ConnectorSearchFilterComponent } from './components/connector-search-filter/connector-search-filter.component';

/**
 * TODO: we should consider consolidating LeftConnectorComponent and RightConnectorComponent
 * as those serve a very similar purpose and duplicate same/very similar code.
 */
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: IcalcRoutes.left,
        component: LeftConnectorComponent,
        canActivate: [RequiredDataGuard],
        data: { trackingLabel: 'Step 3', requiredData: IcalcRoutes.chainFlex, redirectTo: IcalcRoutes.chainFlex },
      },
      {
        path: IcalcRoutes.right,
        component: RightConnectorComponent,
        canActivate: [RequiredDataGuard],
        data: {
          trackingLabel: 'Step 4',
          requiredData: IcalcRoutes.connectorLeft,
          redirectTo: `${IcalcRoutes.connector}/${IcalcRoutes.left}`,
        },
      },
      { path: '', redirectTo: 'left', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, SharedModule, MatBadgeModule, MatDialogModule],
  declarations: [
    LeftConnectorComponent,
    RightConnectorComponent,
    ConnectorMat017ItemsTableComponent,
    Mat017ItemPriceChangeInfoComponent,
    Mat017ItemFavoritesComponent,
    Mat017ItemInvalidInfoComponent,
    ConnectorSearchFilterComponent,
  ],
})
export class ConnectorModule {}
