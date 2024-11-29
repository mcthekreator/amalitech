import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@icalc/frontend/modules/shared/shared.module';

import { PinAssignmentComponent } from './components/pin-assignment/pin-assignment.component';
import {
  ActionModelValuePipe,
  BridgeButtonPipe,
  IsBridgeButtonDisabledPipe,
  IsLitzeDotVisible,
  IsLitzeSideActivePipe,
} from './pipes/pin-assignment-structure.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreToCssClassNamePipe } from './pipes/core-to-css-class-name.pipe';
import { CoreToThicknessPipe } from './pipes/core-to-thickness.pipe';
import { CoreToTranslateKeyPipe } from './pipes/core-to-translate-key.pipe';
import { ItemToShieldPipe } from './pipes/item-to-shield.pipe';
import { HasSubActionsValuePipe } from './pipes/has-sub-actions.pipe';

const routes: Routes = [
  {
    path: '',
    component: PinAssignmentComponent,
    data: { trackingLabel: 'Step 6' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule, MatDialogModule],
  declarations: [
    PinAssignmentComponent,
    CoreToCssClassNamePipe,
    CoreToTranslateKeyPipe,
    CoreToThicknessPipe,
    ItemToShieldPipe,
    BridgeButtonPipe,
    IsBridgeButtonDisabledPipe,
    ActionModelValuePipe,
    IsLitzeSideActivePipe,
    HasSubActionsValuePipe,
    IsLitzeDotVisible,
  ],
})
export class PinAssignmentModule {}
