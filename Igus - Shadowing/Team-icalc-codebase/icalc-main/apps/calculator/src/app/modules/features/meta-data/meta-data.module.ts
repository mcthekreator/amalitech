import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';

import { MetaDataComponent } from './components/meta-data/meta-data.component';
import { MetaDataFormComponent } from './components/meta-data-form/meta-data-form.component';
import { CalculationSearchComponent } from './components/calculation-search/calculation-search.component';

import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: MetaDataComponent,
    data: { trackingLabel: 'Step 1' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule, MatDialogModule],
  declarations: [MetaDataComponent, MetaDataFormComponent, CalculationSearchComponent],
})
export class MetaDataModule {}
