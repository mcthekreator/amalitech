import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './components/library/library.component';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';
import { SketchElementComponent } from '@icalc/frontend/modules/features/library/components/sketch-element/sketch-element.component';
import { MatBadgeModule } from '@angular/material/badge';

const routes: Routes = [
  {
    path: '',
    component: LibraryComponent,
    data: { trackingLabel: 'Step 5' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule, MatBadgeModule],
  declarations: [LibraryComponent, SketchElementComponent],
})
export class LibraryModule {}
