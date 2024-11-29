import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [AdminComponent],
})
export class AdminModule {}
