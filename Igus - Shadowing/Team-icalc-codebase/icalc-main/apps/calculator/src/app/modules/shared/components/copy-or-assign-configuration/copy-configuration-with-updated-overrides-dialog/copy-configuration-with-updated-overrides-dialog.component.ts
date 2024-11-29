import type { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import type { CopyConfigurationToExistingCalculationDialogComponent } from '../copy-configuration-to-existing-calculation-dialog';
import { AssignOrCopyConfigurationActionsEnum } from '../copy-configuration-model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

export class CopyWithUpdatedOverridesResult {
  private constructor(private selectedAction: AssignOrCopyConfigurationActionsEnum) {}

  public get shouldUpdatePrices(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.copyWithPriceUpdates;
  }

  public get isCanceled(): boolean {
    return this.selectedAction === AssignOrCopyConfigurationActionsEnum.cancel;
  }

  public static create(selectedDialogAction?: AssignOrCopyConfigurationActionsEnum): CopyWithUpdatedOverridesResult {
    return new CopyWithUpdatedOverridesResult(selectedDialogAction);
  }
}

export interface Mat017ItemWithOutdatedPrice {
  matNumber: string;
  itemDescription1: string;
  itemDescription2: string;
  currentPrice: number;
  newPrice: number;
}

export interface CopyWithUpdatedOverridesDialogData {
  mat017Items: Mat017ItemWithOutdatedPrice[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-copy-configuration-with-updated-overrides-dialog',
  templateUrl: './copy-configuration-with-updated-overrides-dialog.component.html',
  styleUrls: ['./copy-configuration-with-updated-overrides-dialog.component.scss'],
})
export class CopyConfigurationWithUpdatedOverridesDialogComponent implements OnInit {
  public tableData: Mat017ItemWithOutdatedPrice[];
  public isLocked: boolean;

  public primaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyWithoutPriceUpdates;
  public secondaryButtonAction = AssignOrCopyConfigurationActionsEnum.copyWithPriceUpdates;

  public displayedColumns: string[] = ['matNumber', 'itemDescription1', 'itemDescription2', 'oldPrice', 'newPrice'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: CopyWithUpdatedOverridesDialogData,
    private dialogRef: MatDialogRef<CopyConfigurationToExistingCalculationDialogComponent>,
    private processStateFacadeService: ProcessStateFacadeService
  ) {}

  public ngOnInit(): void {
    this.isLocked = this.processStateFacadeService.isLocked();
    this.tableData = this.dialogData.mat017Items;
  }

  public onActionSelect(
    selectedDialogAction: AssignOrCopyConfigurationActionsEnum = AssignOrCopyConfigurationActionsEnum.cancel
  ): void {
    this.dialogRef.close(CopyWithUpdatedOverridesResult.create(selectedDialogAction));
  }
}
