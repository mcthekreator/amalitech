import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './components/results/results.component';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkStepInformationComponent } from './components/results/work-step-information.component';
import { FileSaverModule } from 'ngx-filesaver';
import { WorkStepHasOverridePipe } from './pipes/work-step-has-override.pipe';

import { MatDialogModule } from '@angular/material/dialog';
import { FilterWorkStepsByCategory } from './pipes/filter-work-steps-by-type.pipe';
import { ShouldHighlightWorkStepNamePipe } from './pipes/should-highlight-work-step-name.pipe';
import { Mat017ItemsUpdateComponent } from './components/mat017Item-update/mat017-items-update.component';
import { Mat017ItemRemovalDialogComponent } from './components/mat017Item-removal-dialog/mat017-item-removal-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: ResultsComponent,
    data: { trackingLabel: 'Step 7' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileSaverModule,
    MatDialogModule,
  ],
  declarations: [
    ResultsComponent,
    WorkStepInformationComponent,
    WorkStepHasOverridePipe,
    ShouldHighlightWorkStepNamePipe,
    FilterWorkStepsByCategory,
    Mat017ItemsUpdateComponent,
    Mat017ItemRemovalDialogComponent,
  ],
  providers: [FilterWorkStepsByCategory],
})
export class ResultsModule {}
