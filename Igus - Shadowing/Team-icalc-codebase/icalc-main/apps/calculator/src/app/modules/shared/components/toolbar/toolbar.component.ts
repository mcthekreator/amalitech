import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { StepperConfig } from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2 } from 'angulartics2';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  public stepperConfig$: Observable<StepperConfig>;

  constructor(
    private angulartics2: Angulartics2,
    private translateService: TranslateService,
    private appStateFacadeService: AppStateFacadeService
  ) {
    this.stepperConfig$ = this.appStateFacadeService.steps$.pipe(
      map((steps) => ({
        steps: steps.map((step) => ({
          title: this.translateService.instant(`toolbar.stepper.${step.label}`),
          url: step.route,
        })),
      }))
    );
  }

  public trackStepClick(): void {
    this.angulartics2.eventTrack.next({ action: 'Back|Button' });
  }
}
