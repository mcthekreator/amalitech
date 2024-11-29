import type { OnInit } from '@angular/core';
import type { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ProcessStateFacadeService } from '../../../core/state/process-state/process-state-facade.service';
import type { Observable } from 'rxjs';
import { take } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-remove-link-between-configuration-and-calculation-dialog',
  templateUrl: './remove-link-between-configuration-and-calculation-dialog.component.html',
  styleUrls: ['./remove-link-between-configuration-and-calculation-dialog.component.scss'],
})
export class RemoveLinkBetweenConfigurationAndCalculationDialogComponent implements OnInit {
  public dialogIsLoading = true;
  public canLinkBetweenConfigurationAndCalculationBeRemoved: boolean;
  public httpError: HttpErrorResponse = null;

  private removalSucceeded$: Observable<{ canLinkBetweenConfigurationAndCalculationBeRemoved: boolean }>;
  private removalPermissionFailed$: Observable<HttpErrorResponse>;
  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.processStateFacadeService.removeLinkBetweenConfigurationAndCalculationDialogOpened();
    this.removalSucceeded$ = this.processStateFacadeService.canLinkBetweenConfigurationAndCalculationBeRemoved$();
    this.removalPermissionFailed$ =
      this.processStateFacadeService.canLinkBetweenConfigurationAndCalculationBeRemovedFailed$();

    this.removalSucceeded$.pipe(take(1)).subscribe((value) => {
      this.canLinkBetweenConfigurationAndCalculationBeRemoved =
        value.canLinkBetweenConfigurationAndCalculationBeRemoved;
      this.dialogIsLoading = false;
      this.changeDetectorRef.detectChanges();
    });

    this.removalPermissionFailed$.pipe(take(1)).subscribe((value: HttpErrorResponse) => {
      this.httpError = value;
      this.dialogIsLoading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  public removeConfiguration(): void {
    this.processStateFacadeService.removeLinkBetweenConfigurationAndCalculationDialogStarted();
  }
}
