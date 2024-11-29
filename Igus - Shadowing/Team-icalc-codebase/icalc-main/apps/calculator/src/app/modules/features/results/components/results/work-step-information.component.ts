import type { OnInit } from '@angular/core';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { InformUserAboutWorkSteps } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="data.informUserAboutWorkSteps.length === 1" dataCy="inform-user-about-work-steps">
      <div *ngFor="let item of data.informUserAboutWorkSteps">
        <p>
          {{ 'icalc.results.OVERRIDE_INFORMATION_HEADLINE' | translate: item }}
        </p>
        <ul>
          <li *ngFor="let step of item.workStepTypes">{{ 'icalc.results.' + step | translate }}</li>
        </ul>
      </div>
    </div>
    <div *ngIf="data.informUserAboutWorkSteps.length > 1">
      <p>
        {{ 'icalc.results.OVERRIDE_INFORMATION_HEADLINE_MAT-NUMBER_LIST' | translate }}
      </p>
      <div *ngFor="let item of data.informUserAboutWorkSteps">
        <ul>
          <li>{{ item.matNumber }} (CF-Length: {{ item.chainflexLength }}m, Batch size: {{ item.batchSize }})</li>
        </ul>
      </div>
    </div>

    <p class="override-info-close" (click)="onClose()" dataCy="inform-user-about-work-steps-close">
      {{ 'icalc.SNACKBARS.CLOSE' | translate }}
    </p>
  `,
  styles: [
    `
      p.override-info-close {
        text-align: end;
        cursor: pointer;
        font-weight: bold;
      }
    `,
  ],
})
export class WorkStepInformationComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      informUserAboutWorkSteps: InformUserAboutWorkSteps[];
    },
    private matSnackBar: MatSnackBar,
    private processStateFacadeService: ProcessStateFacadeService
  ) {}

  public ngOnInit(): void {
    this.processStateFacadeService.openingWorkStepInformationPopupStarted();
  }

  public onClose(): void {
    this.matSnackBar.dismiss();
  }
}
