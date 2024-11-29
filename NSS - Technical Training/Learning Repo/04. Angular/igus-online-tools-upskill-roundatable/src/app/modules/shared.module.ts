import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HideAfterDirective } from '../directive/hide-after.directive';

@NgModule({
  declarations: [
    HideAfterDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    HideAfterDirective
  ]
})
export class SharedModule { }