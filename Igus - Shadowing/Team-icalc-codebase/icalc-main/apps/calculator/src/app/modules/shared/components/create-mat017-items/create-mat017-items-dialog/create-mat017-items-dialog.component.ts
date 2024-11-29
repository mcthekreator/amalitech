import type { OnDestroy, OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, Subscription, take } from 'rxjs';
import { CreateMat017ItemsService } from './create-mat017-items-service';
import { ConnectorSide, FormlyFormSettings, ObjectUtils, Mat017ItemCreationData } from '@igus/icalc-domain';
import { CreateMat017ItemsFormModel, CreateMat017ItemsFormService } from './create-mat017-items-form.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';

@Component({
  selector: 'icalc-create-mat017-items-dialog',
  templateUrl: './create-mat017-items-dialog.component.html',
  styleUrls: ['./create-mat017-items-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMat017ItemsDialogComponent implements OnInit, OnDestroy {
  public errorMessages$: Observable<string>;
  public whichConnector: ConnectorSide;
  public addedItems: Mat017ItemCreationData[];
  public subHeaderList: Observable<string[]>;
  public creationErrorMessage: string;

  public createMat017ItemsForm: FormlyFormSettings<CreateMat017ItemsFormModel> =
    this.createMat017ItemsFormService.initializeForm();

  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: { whichConnector: ConnectorSide },
    private dialogRef: MatDialogRef<CreateMat017ItemsDialogComponent>,
    private readonly createMat017ItemsService: CreateMat017ItemsService,
    private readonly createMat017ItemsFormService: CreateMat017ItemsFormService,
    private readonly translate: TranslateService,
    private readonly connectorStateFacadeService: ConnectorStateFacadeService
  ) {
    this.whichConnector = dialogData.whichConnector;
    this.errorMessages$ = this.createMat017ItemsService.getErrorMessage();
  }

  public ngOnInit(): void {
    this.createMat017ItemsForm.fields = [...this.createMat017ItemsFormService.generateFields(this.subscriptions)];

    this.subHeaderList = this.translate
      .get('icalc.create_new_mat017_item_dialog.DIALOG_SUB_HEADER_LIST')
      .pipe(map((value) => Object.values(value)));

    this.translate
      .get('icalc.create_new_mat017_item_dialog.CREATION_FAILED_ERROR')
      .pipe(take(1))
      .subscribe((value) => (this.creationErrorMessage = value));

    this.subscriptions.add(
      this.connectorStateFacadeService.creatingMat017ItemsSucceeded$().subscribe(() => {
        this.dialogRef.close();
      })
    );

    this.subscriptions.add(
      this.connectorStateFacadeService.creatingMat017ItemsFailed$().subscribe(() => {
        this.createMat017ItemsService.nextErrorMessage(this.creationErrorMessage);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onWarningClose(): void {
    this.createMat017ItemsService.nextErrorMessage(null);
  }

  public onAddNewRow(): void {
    const addFn = this.createMat017ItemsForm.options.formState['add'];

    if (ObjectUtils.isFunction(addFn)) {
      addFn();
    }
  }

  public onPasteButtonClick(): void {
    const onPasteButtonClickFn = this.createMat017ItemsForm.options.formState['onPasteButtonClick'];

    if (ObjectUtils.isFunction(onPasteButtonClickFn)) {
      onPasteButtonClickFn();
    }
  }

  public onSubmit(): void {
    this.connectorStateFacadeService.creatingMat017ItemsSubmitted({
      mat017ItemsToCreate: this.createMat017ItemsForm.model.rows,
      which: this.whichConnector,
    });
  }
}
