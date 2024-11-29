import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainflexComponent } from './components/chainflex/chainflex.component';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ChainflexComponent,
    data: { trackingLabel: 'Step2' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [ChainflexComponent],
})
export class ChainflexModule {}
